import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BOOKING_STATUS, bookingView, PRICE_LABEL } from '../src/data/bookingStatus';
import { submitInterest } from '../src/services/interestService';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import { EarlyAccessPage } from '../src/pages/EarlyAccessPage';

test('current status shows standard price and denies bookings and unconfirmed discount', () => {
  assert.equal(PRICE_LABEL, '€150 per 2 uur');
  assert.deepEqual(bookingView(BOOKING_STATUS), { canReserve: false, offerActive: false, price: 150, primaryLabel: 'Early Access aanvragen' });
});
test('each operational gate must be explicitly true; phase alone cannot enable bookings', () => {
  const ready = { ...BOOKING_STATUS, phase: 'open' as const, locationConfirmed: true, openingConfirmed: true, calendarReady: true, reservationsApproved: true };
  assert.equal(bookingView(ready).canReserve, true);
  for (const key of ['locationConfirmed', 'openingConfirmed', 'calendarReady', 'reservationsApproved']) {
    for (const value of [false, undefined, 'true', 1]) assert.equal(bookingView({ ...ready, [key]: value } as any).canReserve, false);
  }
  assert.equal(bookingView({ ...ready, phase: 'development' }).canReserve, false);
});
test('discount requires confirmation, current expiry and terms', () => {
  const offer = { confirmed: true, discount: 50, expiresAt: '2026-12-01', terms: 'One session' };
  const now = new Date('2026-10-13');
  assert.equal(bookingView({ ...BOOKING_STATUS, offer }, now).price, 100);
  for (const change of [{ confirmed: false }, { expiresAt: null }, { expiresAt: 'invalid' }, { expiresAt: '2026-10-12' }, { terms: '' }, { discount: -50 }, { discount: 150 }, { discount: 200 }]) {
    assert.equal(bookingView({ ...BOOKING_STATUS, offer: { ...offer, ...change } }, now).price, 150);
  }
});
const input = { kind: 'interest' as const, name: 'Guest', email: 'guest@example.com', consent: true };
test('client never treats simulated, HTML, malformed, failed or offline response as success', async () => {
  const bodies = [ { success: true, mode: 'simulated' }, { status: 'received' }, { status: 'received', id: 'id', kind: 'interest', reservationConfirmed: true, paymentReceived: false } ];
  for (const body of bodies) await assert.rejects(submitInterest(input, 'request-id', async () => new Response(JSON.stringify(body))));
  await assert.rejects(submitInterest(input, 'request-id', async () => new Response('<html>SPA</html>')));
  await assert.rejects(submitInterest(input, 'request-id', async () => { throw Error('offline'); }));
  const good = { status: 'received', id: 'id', kind: 'interest', reservationConfirmed: false, paymentReceived: false };
  await assert.rejects(submitInterest(input, 'request-id', async () => new Response(JSON.stringify(good), { status: 503 })));
  assert.equal(await submitInterest(input, 'request-id', async () => new Response(JSON.stringify(good))), 'id');
});
test('application page has distinct labelled actions and no payment, voucher or member dashboard', () => {
  const html = renderToStaticMarkup(React.createElement(EarlyAccessPage, { onNavigate: () => {} }));
  for (const text of ['€150 per 2 uur', 'Belangstelling registreren', 'Early Access aanvragen', 'interest-email', 'privacy', 'Markerkant 13-10']) assert.ok(html.includes(text));
  for (const text of ['€200', 'iDEAL', 'Creditcard', 'Demolid selecteren', 'Officiële Reserveringsbevestiging']) assert.ok(!html.includes(text));
});

test('legacy receipt and email helpers cannot fabricate a paid receipt or delivered email', async () => {
  const service = await import('../src/services/emailService');
  assert.throws(() => service.generateReservationReceipt({} as any));
  assert.throws(() => service.buildReservationEmailHtml({} as any));
  await assert.rejects(service.sendReservationConfirmation({} as any));
});

test('home and suite marketing agree with current price and application status', async () => {
  const { HomePage } = await import('../src/pages/HomePage');
  const { SuitesPage } = await import('../src/pages/SuitesPage');
  for (const page of [HomePage, SuitesPage]) {
    const html = renderToStaticMarkup(React.createElement(page, { onNavigate: () => {} }));
    assert.ok(html.includes('€150 per 2 uur'));
    assert.ok(html.includes('Early Access aanvragen') || html.includes('EARLY ACCESS AANVRAGEN'));
    for (const forbidden of ['€200', 'RESERVEER JOUW DATE', 'CLAIM €50', '48u Boekingsvoorsprong']) assert.ok(!html.includes(forbidden));
  }
});
