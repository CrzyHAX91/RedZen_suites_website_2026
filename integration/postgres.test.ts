import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { once } from 'node:events';
import pg from 'pg';
import { createPostgresInterestStore } from '../server/postgresInterestStore';
import { createIntakeHandler } from '../server/vercelIntake';

// Disposable GitHub Linux service only. No configurable production URL or host.
const container = process.env.PG_TEST_CONTAINER;
const port = Number(process.env.PG_TEST_PORT);
assert.equal(process.env.CI, 'true');
assert.match(container || '', /^[a-f0-9]{12,64}$/);
assert.ok(Number.isInteger(port) && port > 0 && port < 65536);
const config = { host: '127.0.0.1', port, database: 'redzen_ci', connectionTimeoutMillis: 2000 };
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const docker = (...args: string[]) => execFileSync('docker', args, { timeout: 30000 });
const owner = new pg.Pool({ ...config, user: 'postgres' });
const runtime = new pg.Pool({ ...config, user: 'redzen_intake', max: 40 });
const maintenance = new pg.Pool({ ...config, user: 'redzen_maintenance' });
const env = { VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_PROJECT_ID: 'prj_RedZenTest',
  REDZEN_VERCEL_PROJECT_ID: 'prj_RedZenTest', REDZEN_INTAKE_ENABLED: 'true', REDZEN_PRIVACY_READY: 'true',
  REDZEN_APPLICATION_RETENTION_DAYS: '30', REDZEN_RATE_BUCKET_RETENTION_DAYS: '2', REDZEN_BACKUP_RETENTION_DAYS: '7',
  REDZEN_RATE_LIMIT_SECRET: hash('synthetic CI secret, never used outside tests') };
const store = createPostgresInterestStore(async (sql, values = []) => (await runtime.query(sql, values)).rows);
const handler = createIntakeHandler('interest', { env, store: () => store });
const input = { kind: 'interest', name: 'Synthetic Guest', email: 'guest@example.com', consent: true };

test('real PostgreSQL: permissions, independent concurrency, outage, restart, restore and retention', { timeout: 180000 }, async t => {
  t.after(async () => { await Promise.all([owner.end(), runtime.end(), maintenance.end()]); });
  for (const file of ['001_private_intake.sql', '002_intake_concurrency_and_retention.sql']) {
    await owner.query(await readFile(new URL('../db/migrations/' + file, import.meta.url), 'utf8'));
  }
  await owner.query('ALTER ROLE redzen_intake LOGIN; ALTER ROLE redzen_maintenance LOGIN; CREATE ROLE redzen_anonymous LOGIN');
  // Test adapter exercises real HTTP and the actual handler/store/SQL. It is not Vercel transport.
  const server = createServer(async (req, res) => {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const result = await handler(new Request('http://127.0.0.1/api/interest', {
        method: req.method, headers: req.headers as Record<string, string>, body: Buffer.concat(chunks),
      }));
      res.writeHead(result.status, Object.fromEntries(result.headers));
      res.end(Buffer.from(await result.arrayBuffer()));
    } catch { res.writeHead(500); res.end(); }
  });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise<void>(r => server.close(() => r())); });
  const address = server.address(); assert.ok(address && typeof address !== 'string');
  const httpPort = address.port;
  async function submit(key: string, body = input, ip = '192.0.2.1') {
    return fetch(`http://127.0.0.1:${httpPort}/api/interest`, { method: 'POST', headers: {
      'Content-Type': 'application/json', 'Idempotency-Key': key, 'x-vercel-forwarded-for': ip,
    }, body: JSON.stringify(body) });
  }

  await t.test('runtime/anonymous cannot read or modify PII; elevated memberships fail closed', async () => {
    assert.equal(await store.ready(), true);
    for (const sql of ['SELECT * FROM redzen_private.interest_requests', 'DELETE FROM redzen_private.interest_requests']) {
      await assert.rejects(runtime.query(sql), /permission denied/);
    }
    const anonymous = new pg.Client({ ...config, user: 'redzen_anonymous' });
    await anonymous.connect();
    try { await assert.rejects(anonymous.query('SELECT redzen_private.intake_ready()'), /permission denied/); }
    finally { await anonymous.end(); }
    await owner.query('CREATE ROLE synthetic_group; GRANT synthetic_group TO redzen_intake');
    assert.equal(await store.ready(), false);
    assert.equal((await submit('membership-test-00001')).status, 503);
    await owner.query('REVOKE synthetic_group FROM redzen_intake');
    assert.equal(await store.ready(), true);
  });

  await t.test('40 independent-session retries store one record and consume one rate slot', async () => {
    const pids = await Promise.all(Array.from({ length: 40 }, () => runtime.query('SELECT pg_backend_pid() AS pid, pg_sleep(0.05)')));
    assert.ok(new Set(pids.map(r => r.rows[0].pid)).size > 1);
    const results = await Promise.all(Array.from({ length: 40 }, () => submit('concurrent-request-0001')));
    assert.ok(results.every(r => r.status === 201), String(results.map(r => r.status)));
    const bodies = await Promise.all(results.map(r => r.json()));
    assert.equal(new Set(bodies.map(r => r.id)).size, 1);
    assert.ok(bodies.every(r => r.paymentReceived === false && r.reservationConfirmed === false));
    assert.equal((await owner.query('SELECT count(*)::int AS n FROM redzen_private.interest_requests')).rows[0].n, 1);
    assert.equal((await owner.query('SELECT sum(attempts)::int AS n FROM redzen_private.rate_buckets')).rows[0].n, 1);
    assert.equal((await submit('concurrent-request-0001', { ...input, email: 'other@example.com' })).status, 409);
    const statuses = await Promise.all(Array.from({ length: 30 }, (_, i) => submit(`rate-test-request-${i.toString().padStart(4, '0')}`, input, '192.0.2.2').then(r => r.status)));
    assert.equal(statuses.filter(s => s === 201).length, 20);
    assert.equal(statuses.filter(s => s === 429).length, 10);
    assert.equal((await submit('early-access-request-001', { ...input, kind: 'early-access' }, '192.0.2.3')).status, 201);
  });

  await t.test('backup restores records and restrictive permissions in a fresh database', async () => {
    const dump = docker('exec', container!, 'pg_dump', '-U', 'postgres', '-d', 'redzen_ci');
    await owner.query('CREATE DATABASE redzen_ci_restore');
    execFileSync('docker', ['exec', '-i', container!, 'psql', '-v', 'ON_ERROR_STOP=1', '-U', 'postgres', '-d', 'redzen_ci_restore'], { input: dump, stdio: ['pipe', 'ignore', 'pipe'], timeout: 30000 });
    const restored = new pg.Pool({ ...config, database: 'redzen_ci_restore', user: 'redzen_intake' });
    try {
      const restoredStore = createPostgresInterestStore(async (sql, values = []) => (await restored.query(sql, values)).rows);
      assert.equal(await restoredStore.ready(), true);
      const replay = await restoredStore.put({ id: hash('concurrent-request-0001'), fingerprint: hash(JSON.stringify(input)),
        kind: 'interest', name: input.name, email: input.email, clientHash: hash('synthetic-client') });
      assert.equal(replay.status, 'received');
      await assert.rejects(restored.query('SELECT * FROM redzen_private.interest_requests'), /permission denied/);
    } finally { await restored.end(); }
  });

  await t.test('actual database outage returns 503; restart preserves committed records', async () => {
    runtime.on('error', () => {}); owner.on('error', () => {}); maintenance.on('error', () => {});
    docker('stop', '--time', '5', container!);
    try {
      assert.equal((await submit('outage-request-00001')).status, 503);
    } finally { docker('start', container!); }
    let ready = false;
    for (let i = 0; i < 40 && !ready; i++) {
      try { ready = await store.ready(); } catch { /* old pool sockets may have closed */ }
      if (!ready) await new Promise(r => setTimeout(r, 250));
    }
    assert.equal(ready, true);
    assert.equal((await submit('concurrent-request-0001')).status, 201);
    assert.equal((await owner.query('SELECT count(*)::int AS n FROM redzen_private.interest_requests WHERE id=$1', [hash('outage-request-00001')])).rows[0].n, 0);
  });

  await t.test('maintenance dry-run is non-destructive; only its role can delete expired records', async () => {
    await owner.query("UPDATE redzen_private.interest_requests SET received_at=now()-interval '60 days' WHERE id=$1", [hash('concurrent-request-0001')]);
    await owner.query("UPDATE redzen_private.rate_buckets SET window_start=window_start-interval '3 days' WHERE client_hash IN (SELECT client_hash FROM redzen_private.rate_buckets LIMIT 1)");
    const args = [new Date(Date.now()-30*86400000), new Date(Date.now()-2*86400000)];
    const query = 'SELECT * FROM redzen_private.expire_intake($1,$2,$3)';
    await assert.rejects(runtime.query(query, [...args, false]), /permission denied/);
    await assert.rejects(maintenance.query('SELECT * FROM redzen_private.interest_requests'), /permission denied/);
    const before = (await owner.query('SELECT count(*)::int AS n FROM redzen_private.interest_requests')).rows[0].n;
    const preview = (await maintenance.query(query, [...args, true])).rows[0];
    assert.equal(Number(preview.applications), 1);
    assert.equal((await owner.query('SELECT count(*)::int AS n FROM redzen_private.interest_requests')).rows[0].n, before);
    const deleted = (await maintenance.query(query, [...args, false])).rows[0];
    assert.deepEqual(deleted, preview);
    assert.equal((await owner.query('SELECT count(*)::int AS n FROM redzen_private.interest_requests')).rows[0].n, before-1);
    await assert.rejects(maintenance.query(query, [new Date(Date.now()+86400000), ...args.slice(1), false]), /Invalid retention cutoffs/);
  });
});
