import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Config = { base: string; bypass: string; synthetic: boolean };
export function previewConfig(env: NodeJS.ProcessEnv, args: string[]): Config {
  const url = new URL(env.REDZEN_PREVIEW_URL || '');
  if (url.protocol !== 'https:' || url.origin !== env.REDZEN_PREVIEW_URL || url.username || url.password ||
      url.hostname !== env.REDZEN_EXPECTED_PREVIEW_HOST ||
      !/^redzen-suites-website-2026-[a-z0-9]+-crzyhaxs\.vercel\.app$/.test(url.hostname) ||
      url.hostname.includes('-git-') || env.REDZEN_PREVIEW_TARGET_CONFIRMED !== 'true' ||
      !env.REDZEN_PREVIEW_BYPASS_SECRET) throw Error('Unapproved protected preview target');
  const synthetic = args.includes('--synthetic');
  if (args.some(a => a !== '--synthetic' && a !== `--confirm-host=${url.hostname}`) ||
      (synthetic && !args.includes(`--confirm-host=${url.hostname}`)) ||
      (!synthetic && args.length !== 0)) throw Error('Synthetic tests need an explicit host confirmation');
  return { base: url.origin, bypass: env.REDZEN_PREVIEW_BYPASS_SECRET, synthetic };
}
export async function verifyPreview(config: Config, request: typeof fetch = fetch) {
  let checks = 0;
  const references: { id: string; kind: string }[] = [];
  async function call(path: string, options: RequestInit = {}, protectedRequest = true) {
    return request(config.base + path, { ...options, redirect: 'manual', signal: AbortSignal.timeout(12000),
      headers: { ...options.headers, ...(protectedRequest ? { 'x-vercel-protection-bypass': config.bypass } : {}) } });
  }
  const locked = await call('/api/health', {}, false);
  assert.ok([401,403].includes(locked.status), 'preview must reject access without its protection secret'); checks++;
  async function json(path: string, status: number, options: RequestInit = {}) {
    const response = await call(path, options);
    assert.equal(response.status, status, `unexpected status at ${path}`);
    assert.match(response.headers.get('content-type') || '', /^application\/json/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    checks++;
    return response.json();
  }
  const home = await call('/');
  assert.equal(home.status, 200); assert.match(home.headers.get('content-type') || '', /^text\/html/); checks++;
  assert.equal((await json('/api/health', 200)).status, 'ok');
  const closed = await json('/api/leads', 409, { method: 'POST' });
  assert.equal(closed.paymentReceived, false); assert.equal(closed.reservationConfirmed, false);
  await json('/api/unknown', 404);
  const input = { kind: 'interest', name: 'Synthetic Acceptance', email: 'acceptance@example.com', consent: true };
  function post(body: unknown = input, key = randomUUID(), origin = config.base): RequestInit {
    return { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': key, Origin: origin }, body: JSON.stringify(body) };
  }
  if (!config.synthetic) {
    assert.equal((await json('/api/ready',503)).status, 'unavailable');
    // Invalid, non-personal body proves closure without submitting any contact data.
    assert.equal((await json('/api/interest',503, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 'unavailable');
  } else {
    assert.equal((await json('/api/ready',200)).status, 'ready');
    const key = randomUUID();
    const receipt = await json('/api/interest',201,post(input,key));
    assert.equal(receipt.id, createHash('sha256').update(key).digest('hex'));
    assert.equal(receipt.kind, 'interest'); assert.equal(receipt.paymentReceived,false); assert.equal(receipt.reservationConfirmed,false);
    references.push({ id: receipt.id, kind: receipt.kind });
    const retries = await Promise.all(Array.from({length: 8}, () => json('/api/interest',201,post(input,key))));
    assert.ok(retries.every(r => r.id === receipt.id && r.paymentReceived === false && r.reservationConfirmed === false));
    await json('/api/interest',409,post({...input,email:'conflict@example.com'},key));
    await json('/api/interest',400,post({...input,consent:false}));
    await json('/api/interest',403,post(input,randomUUID(),'https://untrusted.example'));
    const early = await json('/api/interest',201,post({...input,kind:'early-access'}));
    assert.equal(early.kind,'early-access'); assert.equal(early.paymentReceived,false); assert.equal(early.reservationConfirmed,false);
    assert.match(early.id,/^[a-f0-9]{64}$/); references.push({id:early.id,kind:early.kind});
  }
  return { checksPassed: checks, mode: config.synthetic ? 'approved-synthetic-preview' : 'closed-preview',
    syntheticReferences: references, databaseDurabilityAndBackupRestoreVerified: false };
}
async function main() {
  try { console.log(JSON.stringify(await verifyPreview(previewConfig(process.env,process.argv.slice(2))))); }
  catch { console.error('Protected preview verification failed; no response bodies, bypass secret or personal data logged.'); process.exitCode=1; }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
