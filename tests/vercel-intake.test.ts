import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { PGlite } from '@electric-sql/pglite';
import { createPostgresInterestStore, createNeonInterestStore, type InterestStore } from '../server/postgresInterestStore';
import { createIntakeHandler } from '../server/vercelIntake';
import { BADDBEATZ_PROJECT_ID, validHostingTarget } from '../server/hostingTarget';

const migration = await readFile(new URL('../db/migrations/001_private_intake.sql', import.meta.url), 'utf8');
const hardening = await readFile(new URL('../db/migrations/002_intake_concurrency_and_retention.sql', import.meta.url), 'utf8');
const hash = (s: string) => createHash('sha256').update(s).digest('hex');
const env = {
  VERCEL: '1', VERCEL_ENV: 'preview', VERCEL_PROJECT_ID: 'prj_RedZenTest',
  REDZEN_VERCEL_PROJECT_ID: 'prj_RedZenTest', REDZEN_INTAKE_ENABLED: 'true', REDZEN_PRIVACY_READY: 'true',
  REDZEN_APPLICATION_RETENTION_DAYS: '30', REDZEN_RATE_BUCKET_RETENTION_DAYS: '2', REDZEN_BACKUP_RETENTION_DAYS: '7',
  REDZEN_RATE_LIMIT_SECRET: hash('synthetic test-only rate-limit seed'),
};
const input = { kind: 'interest', name: 'Test Guest', email: 'guest@example.com', consent: true };
function request(body: unknown = input, key = 'test-request-00000001', headers: Record<string,string> = {}) {
  return new Request('https://redzen-test.example/api/interest', { method: 'POST', headers: {
    'Content-Type': 'application/json', 'Idempotency-Key': key,
    'x-vercel-forwarded-for': '192.0.2.1', Origin: 'https://redzen-test.example', ...headers,
  }, body: JSON.stringify(body) });
}
async function database(dir?: string) {
  const db = await PGlite.create(dir);
  await db.exec(migration);
  await db.exec(hardening);
  await db.exec('SET SESSION AUTHORIZATION redzen_intake');
  const store = createPostgresInterestStore(async (sql, values = []) => (await db.query(sql, values)).rows as Record<string, unknown>[]);
  return { db, store, handle: createIntakeHandler('interest', { env, store: () => store }) };
}

test('real PostgreSQL migration: private RPC-only access, inputs, retry and conflict behavior', async () => {
  const { db, store, handle } = await database();
  try {
    assert.equal(await store.ready(), true);
    const first = await handle(request({ ...input, paymentStatus: 'deposit_paid', reservationConfirmed: true }));
    assert.equal(first.status, 201);
    const body = await first.json();
    assert.equal(body.id, hash('test-request-00000001'));
    assert.equal(body.reservationConfirmed, false);
    assert.equal(body.paymentReceived, false);
    assert.equal(first.headers.get('cache-control'), 'no-store');
    const retry = await (await handle(request())).json();
    assert.equal(retry.id, body.id);
    assert.equal((await handle(request({ ...input, email: 'changed@example.com' }))).status, 409);
    assert.equal((await handle(request({ ...input, kind: 'early-access' }, 'test-request-00000002'))).status, 201);
    await assert.rejects(db.query('SELECT * FROM redzen_private.interest_requests'), /permission denied/);
    await assert.rejects(db.query('DELETE FROM redzen_private.interest_requests'), /permission denied/);
    await assert.rejects(db.query('INSERT INTO redzen_private.interest_requests(id) VALUES ($1)', [hash('denied')]), /permission denied/);
    await assert.rejects(db.query('SELECT * FROM redzen_private.submit_interest_v2($1,$2,$3,$4,$5,$6)',
      [hash('invalid'), hash('invalid'), 'paid-booking', 'Guest', 'guest@example.com', hash('client')]), /Invalid application/);
    // PGlite does not restore the initial principal with RESET SESSION AUTHORIZATION.
    await db.exec("SET SESSION AUTHORIZATION 'postgres'");
    const rows = (await db.query<Record<string, unknown>>('SELECT * FROM redzen_private.interest_requests ORDER BY received_at')).rows;
    assert.equal(rows.length, 2);
    assert.ok(rows.every(r => !Object.keys(r).some(k => /payment|reservation/i.test(k))));
    assert.equal(rows[0].consent, true);
    assert.equal((await store.ready()), false, 'owner credentials must fail readiness');
    await assert.rejects(store.put({ id: hash('owner'), fingerprint: hash('owner'), kind: 'interest',
      name: 'Guest', email: 'guest@example.com', clientHash: hash('client') }), /restricted runtime role/);
    await db.exec('CREATE ROLE anonymous NOLOGIN; SET SESSION AUTHORIZATION anonymous');
    await assert.rejects(db.query('SELECT redzen_private.intake_ready()'), /permission denied/);
  } finally { await db.close(); }
});

test('database rate limit is shared by handlers; retries of stored requests remain safe', async () => {
  const { db, handle, store } = await database();
  try {
    for (let i = 0; i < 20; i++) assert.equal((await handle(request(input, `rate-limit-key-${String(i).padStart(5,'0')}`))).status, 201);
    const otherWorker = createIntakeHandler('interest', { env, store: () => store });
    const denied = await otherWorker(request(input, 'rate-limit-key-00020'));
    assert.equal(denied.status, 429);
    assert.equal(denied.headers.get('retry-after'), '900');
    assert.equal((await otherWorker(request(input, 'rate-limit-key-00000'))).status, 201);
    assert.equal((await otherWorker(request(input, 'different-client-00001', { 'x-vercel-forwarded-for': '192.0.2.2' }))).status, 201);
    await db.exec("SET SESSION AUTHORIZATION 'postgres'");
    assert.equal((await db.query<{n: number}>('SELECT count(*)::int AS n FROM redzen_private.interest_requests')).rows[0].n, 21);
    const buckets = (await db.query<{client_hash: string}>('SELECT client_hash, attempts FROM redzen_private.rate_buckets')).rows;
    assert.equal(buckets.length, 2);
    assert.ok(buckets.every(r => /^[a-f0-9]{64}$/.test(String(r.client_hash))));
  } finally { await db.close(); }
});

test('SQL idempotency survives queued requests and reopening a persisted PostgreSQL data directory', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'redzen-pg-'));
  try {
    const { db, handle } = await database(path.join(dir, 'data'));
    const results = await Promise.all(Array.from({ length: 6 }, () => handle(request())));
    assert.ok(results.every(r => r.status === 201));
    const ids = await Promise.all(results.map(r => r.json().then(x => x.id)));
    assert.equal(new Set(ids).size, 1);
    await db.close();
    const reopened = await PGlite.create(path.join(dir, 'data'));
    try {
      assert.equal((await reopened.query<{n: number}>('SELECT count(*)::int AS n FROM redzen_private.interest_requests')).rows[0].n, 1);
      assert.equal((await reopened.query<{email: string}>('SELECT email FROM redzen_private.interest_requests')).rows[0].email, input.email);
    } finally { await reopened.close(); }
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('intake fails closed on wrong project, no enablement, no storage, and failed readiness', async () => {
  for (const change of [ { VERCEL_PROJECT_ID: BADDBEATZ_PROJECT_ID, REDZEN_VERCEL_PROJECT_ID: BADDBEATZ_PROJECT_ID },
    { REDZEN_VERCEL_PROJECT_ID: '' }, { REDZEN_INTAKE_ENABLED: 'false' }, { REDZEN_INTAKE_ENABLED: 'TRUE' },
    { VERCEL_ENV: 'development' }, { REDZEN_PRIVACY_READY: 'false' },
    { REDZEN_APPLICATION_RETENTION_DAYS: '0' }, { REDZEN_BACKUP_RETENTION_DAYS: '' }, { REDZEN_RATE_LIMIT_SECRET: '' } ]) {
    const handler = createIntakeHandler('interest', { env: { ...env, ...change } });
    assert.equal((await handler(request())).status, 503);
  }
  const failing: InterestStore = { ready: async () => false, put: async () => { throw new Error('synthetic database failure'); } };
  assert.equal((await createIntakeHandler('ready', { env, store: () => failing })(new Request('https://redzen-test.example/api/ready'))).status, 503);
  assert.equal((await createIntakeHandler('interest', { env, store: () => failing })(request())).status, 503);
  assert.equal((await createIntakeHandler('interest', { env })(request())).status, 503);
});

test('bad input, cross-origin, compressed, oversized and chunked bodies never reach storage', async () => {
  let writes = 0;
  const store: InterestStore = { ready: async () => true, put: async () => { writes++; throw Error('unexpected write'); } };
  const handle = createIntakeHandler('interest', { env, store: () => store });
  assert.equal((await handle(request({ ...input, consent: false }))).status, 400);
  assert.equal((await handle(request(input, 'short'))).status, 400);
  assert.equal((await handle(request(input, undefined, { Origin: 'https://other.example' }))).status, 403);
  assert.equal((await handle(request(input, undefined, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await handle(request(input, undefined, { 'Content-Encoding': 'gzip' }))).status, 415);
  assert.equal((await handle(request(input, undefined, { 'Content-Length': '999999' }))).status, 413);
  assert.equal((await handle(request(input, undefined, { 'x-vercel-forwarded-for': 'spoofed, ip' }))).status, 503);
  const huge = request({ ...input, extra: 'x'.repeat(20000) });
  assert.equal((await handle(huge)).status, 413);
  const malformed = new Request('https://redzen-test.example/api/interest', { method: 'POST', headers: { 'Content-Type':'application/json' }, body:'{' });
  assert.equal((await handle(malformed)).status, 400);
  assert.equal((await handle(new Request('https://redzen-test.example/api/interest'))).status, 405);
  assert.equal(writes, 0);
});

test('Vercel configuration routes API requests before SPA fallback, including query spoofing', async () => {
  const config = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.equal(config.git.deploymentEnabled, false);
  assert.equal(config.outputDirectory, 'dist');
  for (const [url, expected] of [ ['/api/interest','/api/interest'], ['/api/ready','/api/ready'],
    ['/api/leads','/api/closed'], ['/api/leads/id/payment','/api/closed'], ['/api/leads/id/status','/api/closed'],
    ['/api/send-reservation-receipt','/api/closed'], ['/api/unknown','/api/not-found'], ['/api','/api/not-found'] ]) {
    const matched = config.routes.find((r: {src?: string}) => r.src && new RegExp('^(?:'+r.src+')$').test(url));
    assert.equal(matched.dest, expected);
  }
  const closed = await createIntakeHandler('closed')(new Request('https://redzen-test.example/api/leads?route=interest',
    {method: 'POST', body: JSON.stringify(input)}));
  assert.equal(closed.status, 409);
  assert.equal((await closed.json()).paymentReceived, false);
  assert.equal((await createIntakeHandler('not-found')(request())).status, 404);
  const invalidTarget = { ...env, VERCEL_PROJECT_ID: BADDBEATZ_PROJECT_ID, REDZEN_VERCEL_PROJECT_ID: BADDBEATZ_PROJECT_ID };
  assert.equal(validHostingTarget(invalidTarget), false);
  const run = spawnSync(process.execPath, ['--import','tsx','scripts/verify-vercel-target.ts'], { env: { ...process.env, ...invalidTarget }, encoding:'utf8' });
  assert.equal(run.status, 1);
});

test('Neon connection rejects owner credentials, unexpected host and missing TLS without network calls', () => {
  for (const url of [ '', 'postgresql://owner@example.com/redzen?sslmode=require', 'postgresql://redzen_intake@example.neon.tech/redzen?sslmode=disable' ]) {
    assert.throws(() => createNeonInterestStore({ DATABASE_URL: url, REDZEN_DATABASE_HOST: 'example.neon.tech' }));
  }
});
