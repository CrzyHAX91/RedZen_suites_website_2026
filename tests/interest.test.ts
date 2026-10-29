import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { mkdtemp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { interestRoutes } from '../server/interestRoutes';

test('durable intake, retries, validation, legacy payment denial and missing configuration', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'redzen-test-'));
  const app = express(); app.use(express.json()); app.use('/api', interestRoutes(dir)); app.use('/closed', interestRoutes(''));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const headers = { 'Content-Type': 'application/json', 'Idempotency-Key': '12345678-1234-1234-1234-123456789012' };
  const input = { kind: 'early-access', name: 'Guest', email: 'guest@example.com', consent: true, paymentStatus: 'deposit_paid' };
  const post = (url: string, value = input) => fetch(base + url, { method: 'POST', headers, body: JSON.stringify(value) });
  try {
    assert.equal((await post('/closed/interest')).status, 503);
    assert.equal((await post('/api/interest', { ...input, consent: false })).status, 400);
    const first = await post('/api/interest'); assert.equal(first.status, 201);
    const body = await first.json(); assert.equal(body.paymentReceived, false); assert.equal(body.reservationConfirmed, false);
    assert.equal((await (await post('/api/interest')).json()).id, body.id);
    assert.equal((await readdir(dir)).length, 1);
    assert.equal((await post('/api/interest', { ...input, email: 'other@example.com' })).status, 409);
    for (const url of ['/api/leads', '/api/leads/id/payment', '/api/send-reservation-receipt']) {
      const response = await post(url); assert.equal(response.status, 409); assert.equal((await response.json()).success, false);
    }
    assert.equal((await post('/api/interest', { ...input, email: 'bad-email' })).status, 400);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); await rm(dir, { recursive: true, force: true }); }
});
