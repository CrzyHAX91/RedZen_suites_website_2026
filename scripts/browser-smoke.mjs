import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:4173';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'ignore' });
let browser;
try {
  let ready = false;
  for (let i = 0; i < 40 && !ready; i++) {
    if (server.exitCode !== null) throw Error('Preview server exited');
    try { ready = (await fetch(base)).ok; } catch { /* starting */ }
    if (!ready) await new Promise(r => setTimeout(r, 250));
  }
  assert.ok(ready, 'preview server starts');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_EXECUTABLE_PATH || '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
  let checks = 0;
  for (const mobile of [false, true]) {
    const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, isMobile: mobile });
    const page = await context.newPage(); const errors = []; const scripts = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', r => { if (r.url().includes('/assets/') && r.url().endsWith('.js')) scripts.push(r.url()); });
    await page.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.ok(!scripts.some(s => /ConceptPage|SuitesPage|InvestPage/.test(s)), 'secondary pages are not downloaded on home');
    for (const route of ['concept', 'suites', 'arrangements', 'sustainability', 'early-access', 'invest', 'partners', 'faq', 'contact', 'privacy', 'cookies']) {
      await page.evaluate(route => { location.hash = '/' + route; }, route);
      await page.waitForLoadState('networkidle');
      await page.locator('main h1').waitFor({ state: 'visible' });
      assert.ok((await page.locator('main h1').innerText()).trim()); checks++;
    }
    await page.evaluate(() => { location.hash = '/early-access'; });
    await page.locator('#interest-name').fill('Synthetic Guest');
    await page.locator('#interest-email').fill('guest@example.com');
    await page.locator('form input[type=checkbox]').check();
    // UI-only synthetic responses. Actual storage/outage tests live in postgres.test.ts.
    await page.route('**/api/interest', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{"status":"unavailable"}' }));
    await page.locator('form button[type=submit]').click();
    await page.locator('[role=alert]').waitFor({ state: 'visible' });
    assert.equal(await page.locator('#interest-name').inputValue(), 'Synthetic Guest');
    await page.unroute('**/api/interest');
    await page.route('**/api/interest', route => route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ status: 'received', id: 'synthetic-reference', kind: 'interest', reservationConfirmed: false, paymentReceived: false }) }));
    await page.locator('form button[type=submit]').click();
    await page.getByText('Referentie: synthetic-reference', { exact: true }).waitFor();
    assert.ok((await page.locator('main').innerText()).includes('Er is geen reservering of betaling bevestigd.'));
    assert.deepEqual(errors, []); checks += 2;
    await context.close();
  }
  console.log(JSON.stringify({ browserChecksPassed: checks, javascriptErrors: 0, externalRequests: 'blocked', liveStorage: false }));
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
