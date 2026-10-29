import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PRICE_LABEL, PRICE_NOTICE, BOOKING_STATUS, bookingView } from '../src/data/bookingStatus';
import { SUITES_DATA } from '../src/data/suites';
import { FAQ_ITEMS_DATA } from '../src/data/faqs';
import { LanguageProvider } from '../src/context/LanguageContext';
import { HomePage } from '../src/pages/HomePage';
import { SuitesPage } from '../src/pages/SuitesPage';
import { EarlyAccessPage } from '../src/pages/EarlyAccessPage';
import { FaqPage } from '../src/pages/FaqPage';
import { ConceptPage } from '../src/pages/ConceptPage';
import { ArrangementsPage } from '../src/pages/ArrangementsPage';
import { SuiteConfigurator } from '../src/components/SuiteConfigurator';
import { BookingStatusPanel } from '../src/components/BookingStatusPanel';
import { InvestorRoiCalculator } from '../src/components/InvestorRoiCalculator';

const render = (Component: React.ComponentType<any>) => renderToStaticMarkup(
  React.createElement(LanguageProvider, null, React.createElement(Component, { onNavigate: () => {} }))
);

test('all public price surfaces use €150, including FAQ answers and suite data', () => {
  for (const Page of [HomePage, SuitesPage, EarlyAccessPage, SuiteConfigurator, BookingStatusPanel]) {
    const html = render(Page);
    assert.ok(html.includes(PRICE_LABEL), Page.name);
    assert.doesNotMatch(html, /€200|€199[,.]95|€50|<del\b|<s\b|line-through/i, Page.name);
  }
  assert.ok(FAQ_ITEMS_DATA.find(item => item.id === 'faq-book-2')?.answer.includes(PRICE_LABEL));
  assert.ok(FAQ_ITEMS_DATA.find(item => item.id === 'faq-book-2')?.answer.includes(PRICE_NOTICE));
  for (const suite of SUITES_DATA) {
    assert.ok(suite.pricingNote.includes(PRICE_LABEL));
    assert.ok(suite.pricingNote.includes('geen tijdelijke korting'));
    assert.ok(suite.sessionDuration.startsWith('2 uur'));
  }
});

test('concept, FAQ and arrangements do not resurrect a discount or booking CTA', () => {
  for (const Page of [ConceptPage, FaqPage, ArrangementsPage]) {
    const html = render(Page);
    assert.doesNotMatch(html, /€200|€50|CLAIM PRIVILEGE|CLAIM €|RESERVEER JOUW DATE|48u Boekingsvoorsprong/i);
  }
});

test('configurator starts at the base price without preselected chargeable extras or false saved claim', () => {
  const html = render(SuiteConfigurator);
  assert.ok(html.includes('€150 per 2 uur'));
  assert.ok(html.includes('niet opgeslagen'));
  assert.ok(html.includes('geen reservering of betaling'));
  assert.doesNotMatch(html, /€234|€275|€285|\+€|Indicatief Totaal|Selectie opgeslagen|lidmaatschap/);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((html.match(/aria-pressed="false"/g) || []).length, 1);
});

test('owner price approval does not open location, bookings or payment', () => {
  assert.equal(BOOKING_STATUS.phase, 'development');
  assert.equal(BOOKING_STATUS.locationConfirmed, false);
  assert.equal(BOOKING_STATUS.openingConfirmed, false);
  assert.equal(BOOKING_STATUS.calendarReady, false);
  assert.equal(BOOKING_STATUS.reservationsApproved, false);
  assert.equal(BOOKING_STATUS.offer.discount, 0);
  assert.equal(bookingView(BOOKING_STATUS).price, 150);
  assert.equal(bookingView(BOOKING_STATUS).canReserve, false);
  assert.match(render(BookingStatusPanel), /nummer 146 wordt onderzocht/);
});

test('investor default follows the current price and is described as a scenario', () => {
  const html = render(InvestorRoiCalculator);
  assert.ok(html.includes('€150 per 2u slot'));
  assert.doesNotMatch(html, /€200|Standaard Gevalideerd|gevalideerde benchmark/);
  assert.ok(html.includes('geen aanbod'));
});

test('request IDs work without randomUUID and fail closed without secure randomness', async () => {
  const { webcrypto } = await import('node:crypto');
  const { createInterestRequestId } = await import('../src/services/interestService');
  const fallback = { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) } as unknown as Crypto;
  const first = createInterestRequestId(fallback);
  assert.match(first, /^[a-f0-9]{32}$/);
  assert.notEqual(createInterestRequestId(fallback), first);
  assert.throws(() => createInterestRequestId({} as Crypto));
});
