import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sendReservationConfirmation } from '../src/services/emailService.ts';
import type { EarlyAccessLead } from '../src/types.ts';

const lead = {
  id: 'lead-1',
  firstName: 'Test',
  email: 'guest@example.com',
  city: 'Almere',
  useCase: 'Ontspanning',
  pricePreference: '€150',
  createdAt: '2026-10-01T00:00:00.000Z',
  status: 'new',
  memberNumber: 1
} as EarlyAccessLead;

async function withResponse(
  response: Response,
  run: () => Promise<void>
): Promise<void> {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => response) as typeof fetch;
  try {
    await run();
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('client marks a Resend-accepted email as sent', async () => {
  await withResponse(
    new Response(JSON.stringify({ success: true, mode: 'resend', messageId: 'resend-message-123' }), { status: 200 }),
    async () => {
      const result = await sendReservationConfirmation(lead);
      assert.equal(result.success, true);
      assert.equal(result.deliveryMode, 'resend');
      assert.equal(result.messageId, 'resend-message-123');
    }
  );
});

test('client does not turn a development preview into a successful send', async () => {
  await withResponse(
    new Response(JSON.stringify({ success: false, mode: 'simulated', preview: true }), { status: 200 }),
    async () => {
      const result = await sendReservationConfirmation(lead, 'iDEAL', undefined, { dryRun: true });
      assert.equal(result.success, false);
      assert.equal(result.deliveryMode, 'simulated');
      assert.equal(result.messageId, undefined);
    }
  );
});

test('client reports provider errors as failed instead of simulated success', async () => {
  await withResponse(
    new Response(JSON.stringify({ success: false, mode: 'failed', error: 'Email provider is not configured.' }), { status: 503 }),
    async () => {
      const result = await sendReservationConfirmation(lead);
      assert.equal(result.success, false);
      assert.equal(result.deliveryMode, 'failed');
      assert.equal(result.error, 'Email provider is not configured.');
    }
  );
});
