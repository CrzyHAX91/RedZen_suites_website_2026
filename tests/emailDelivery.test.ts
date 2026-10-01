import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dispatchReservationEmail, EmailDeliveryError } from '../src/services/emailDelivery.ts';

const email = {
  recipientEmail: 'guest@example.com',
  senderFrom: 'RedZen <reserveringen@redzensuites.nl>',
  subject: 'Reservation receipt',
  html: '<p>Receipt</p>',
  text: 'Receipt'
};

test('sends with Resend and returns the provider message ID', async () => {
  let requestUrl = '';
  let requestInit: RequestInit | undefined;
  const result = await dispatchReservationEmail(
    email,
    { NODE_ENV: 'production', RESEND_API_KEY: 're_test_key', EMAIL_FROM: email.senderFrom },
    async (input, init) => {
      requestUrl = String(input);
      requestInit = init;
      return new Response(JSON.stringify({ id: 'resend-message-123' }), { status: 200 });
    }
  );

  assert.deepEqual(result, { success: true, mode: 'resend', messageId: 'resend-message-123' });
  assert.equal(requestUrl, 'https://api.resend.com/emails');
  assert.equal(requestInit?.method, 'POST');
  assert.equal(new Headers(requestInit?.headers).get('authorization'), 'Bearer re_test_key');
  assert.deepEqual(JSON.parse(String(requestInit?.body)), {
    from: email.senderFrom,
    to: [email.recipientEmail],
    subject: email.subject,
    html: email.html,
    text: email.text
  });
});

test('fails closed when Resend rejects the request', async () => {
  await assert.rejects(
    dispatchReservationEmail(
      email,
      { NODE_ENV: 'production', RESEND_API_KEY: 're_test_key', EMAIL_FROM: email.senderFrom },
      async () => new Response(JSON.stringify({ message: 'invalid sender' }), { status: 422 })
    ),
    error => error instanceof EmailDeliveryError && error.statusCode === 502
  );
});

test('fails closed when provider configuration is missing', async () => {
  let requestCalled = false;
  await assert.rejects(
    dispatchReservationEmail(email, { NODE_ENV: 'production' }, async () => {
      requestCalled = true;
      return new Response('{}');
    }),
    error => error instanceof EmailDeliveryError && error.statusCode === 503
  );
  assert.equal(requestCalled, false);
});

test('returns a non-delivery preview only for an explicit development dry-run', async () => {
  let requestCalled = false;
  const result = await dispatchReservationEmail(
    { ...email, dryRun: true },
    { NODE_ENV: 'development' },
    async () => {
      requestCalled = true;
      return new Response('{}');
    }
  );

  assert.deepEqual(result, { success: false, mode: 'simulated', preview: true });
  assert.equal(requestCalled, false);
});

test('blocks dry-run requests in production', async () => {
  await assert.rejects(
    dispatchReservationEmail(
      { ...email, dryRun: true },
      { NODE_ENV: 'production', RESEND_API_KEY: 're_test_key', EMAIL_FROM: email.senderFrom }
    ),
    error => error instanceof EmailDeliveryError && error.statusCode === 403
  );
});
