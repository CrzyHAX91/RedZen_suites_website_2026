import { test } from 'node:test';
import type { TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request } from 'node:http';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gzipSync, deflateSync } from 'node:zlib';
import nodemailer from 'nodemailer';
import { createApp } from '../server/app';

const lead = { kind: 'interest', name: 'Zoë & René', email: 'guest@example.com', consent: true };
const key = 'dependency-test-1234567890';

async function fixture(t: TestContext, onRequestEnd?: () => void) {
  const dir = await mkdtemp(path.join(tmpdir(), 'redzen-dependencies-'));
  const app = createApp(dir);
  const server = createServer((req, res) => {
    if (req.method === 'POST' && onRequestEnd) {
      req.once('end', onRequestEnd);
      // Keep the response open for a downstream consumer of the whole request,
      // as in the upstream regression. Headers release the client's late tail.
      const end = res.end;
      res.end = function (...args: any[]) {
        res.flushHeaders();
        if (req.readableEnded) Reflect.apply(end, res, args);
        else req.once('end', () => Reflect.apply(end, res, args));
        return res;
      } as typeof res.end;
    }
    app(req, res);
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
    await rm(dir, { recursive: true, force: true });
  });
  return { dir, port: address.port, base: 'http://127.0.0.1:' + address.port };
}

for (const [label, api] of [
  ['ES module', nodemailer],
  ['CommonJS', createRequire(import.meta.url)('nodemailer') as typeof nodemailer],
] as const) {
  test('Nodemailer 10 ' + label + ' renders a message without SMTP or credentials', async () => {
    const transport = api.createTransport({ jsonTransport: true });
    try {
      const info = await transport.sendMail({
        from: { name: 'RedZen-Suites', address: 'sender@example.com' },
        to: { name: 'Zoë', address: lead.email },
        subject: 'Offline compatibiliteitscontrole',
        text: 'Geen reservering of betaling.',
        html: '<p>Geen reservering of betaling.</p>',
      });
      const message = JSON.parse(String(info.message));
      assert.equal(message.subject, 'Offline compatibiliteitscontrole');
      assert.equal(message.text, 'Geen reservering of betaling.');
      assert.deepEqual(info.envelope.to, [lead.email]);
      assert.ok(info.messageId);
    } finally { transport.close(); }
  });
}

test('production parsers reject invalid URL-encoded intake and preserve Unicode JSON intake', { timeout: 8000 }, async t => {
  const { base, dir } = await fixture(t);
  const body = new URLSearchParams({ ...lead, consent: 'true' });
  // HTML form booleans are strings; the existing API correctly refuses them.
  const invalid = await fetch(base + '/api/interest', {
    method: 'POST', headers: { 'Idempotency-Key': key }, body,
  });
  assert.equal(invalid.status, 400);
  const duplicate = await fetch(base + '/api/interest', {
    method: 'POST', headers: { 'Idempotency-Key': key },
    body: new URLSearchParams([['kind', 'interest'], ['name', lead.name],
      ['email', lead.email], ['email', 'other@example.com'], ['consent', 'true']]),
  });
  assert.equal(duplicate.status, 400);
  assert.equal((await readdir(dir)).length, 0);
  const good = await fetch(base + '/api/interest', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key },
    body: JSON.stringify(lead),
  });
  assert.equal(good.status, 201);
  const saved = JSON.parse(await readFile(path.join(dir, (await readdir(dir))[0]), 'utf8'));
  assert.equal(saved.name, lead.name);
  assert.equal(saved.email, lead.email);
});

for (const [encoding, compress] of [['gzip', gzipSync], ['deflate', deflateSync]] as const) {
  test('CVE-2026-111181: trailing bytes after ' + encoding + ' are drained without crashing intake', { timeout: 8000 }, async t => {
    let requestEnded!: () => void;
    const ended = new Promise<void>(resolve => { requestEnded = resolve; });
    const { base, port, dir } = await fixture(t, requestEnded);
    const first = Buffer.concat([compress(JSON.stringify(lead)), Buffer.from([0])]);
    const trailing = Buffer.alloc(100 * 1024, 0x58);
    const response = await new Promise<{ status?: number; body: string }>((resolve, reject) => {
      const req = request({
        host: '127.0.0.1', port, path: '/api/interest', method: 'POST', agent: false,
        headers: {
          'Content-Type': 'application/json', 'Content-Encoding': encoding,
          'Content-Length': first.length + trailing.length, 'Idempotency-Key': key,
        },
      }, res => {
        // For deflate, deliver the tail only after the parser has completed.
        if (encoding === 'deflate') req.end(trailing);
        let body = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { body += chunk; });
        res.on('error', reject);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', reject);
      req.setTimeout(4000, () => req.destroy(new Error('compressed request timed out')));
      req.write(first);
      // Gzip may wait for another concatenated frame, so send its tail immediately.
      if (encoding === 'gzip') req.end(trailing);
      t.after(() => req.destroy());
    });
    await ended;
    assert.equal(response.status, 201);
    const received = JSON.parse(response.body);
    assert.equal(received.reservationConfirmed, false);
    assert.equal(received.paymentReceived, false);
    assert.equal((await readdir(dir)).length, 1);
    assert.deepEqual(await (await fetch(base + '/api/health')).json(), { status: 'ok' });
  });
}

test('malformed compression and oversized JSON fail without saving a lead', { timeout: 8000 }, async t => {
  const { base, dir } = await fixture(t);
  for (const [body, headers, status] of [
    [Buffer.from('invalid gzip'), { 'Content-Encoding': 'gzip' }, 400],
    [JSON.stringify({ ...lead, name: 'x'.repeat(17000) }), {}, 413],
  ] as const) {
    const response = await fetch(base + '/api/interest', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, ...headers }, body,
    });
    assert.equal(response.status, status);
  }
  assert.equal((await readdir(dir)).length, 0);
  assert.equal((await fetch(base + '/api/health')).status, 200);
});

test('production API keeps legacy email, booking and payment routes closed after the upgrade', { timeout: 8000 }, async t => {
  const { base, dir } = await fixture(t);
  for (const url of ['/api/send-reservation-receipt', '/api/leads', '/api/leads/id/payment']) {
    const response = await fetch(base + url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead),
    });
    assert.equal(response.status, 409);
    assert.deepEqual(await response.json(), {
      success: false, status: 'not_available', reservationConfirmed: false, paymentReceived: false,
    });
  }
  assert.equal((await readdir(dir)).length, 0);
});
