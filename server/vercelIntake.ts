import { createHash, createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { validInterest } from '../src/services/interestService';
import { BOOKING_STATUS } from '../src/data/bookingStatus';
import { validHostingTarget } from './hostingTarget';
import { createNeonInterestStore, type InterestStore } from './postgresInterestStore';

type Endpoint = 'health' | 'ready' | 'interest' | 'closed' | 'not-found';
const MAX_BYTES = 16 * 1024;
const unavailable = { status: 'unavailable', reservationConfirmed: false, paymentReceived: false };
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  } });
}

async function readJson(request: Request): Promise<unknown> {
  const length = request.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new Error('too_large');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = Buffer.concat(chunks);
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

// Each entrypoint fixes its action; user-supplied query strings cannot select an endpoint.
export function createIntakeHandler(endpoint: Endpoint, options: {
  env?: NodeJS.ProcessEnv;
  store?: () => InterestStore;
} = {}) {
  return async (request: Request): Promise<Response> => {
    if (endpoint === 'not-found') return json({ status: 'not_found' }, 404);
    if (endpoint === 'closed') return json({ success: false, status: 'not_available',
      reservationConfirmed: false, paymentReceived: false }, 409);
    const method = endpoint === 'interest' ? 'POST' : 'GET';
    if (request.method !== method) return json({ status: 'method_not_allowed' }, 405, { Allow: method });
    const env = options.env ?? process.env;
    if (!validHostingTarget(env)) return json(unavailable, 503);
    if (endpoint === 'health') return json({ status: 'ok' });
    if (env.REDZEN_INTAKE_ENABLED !== 'true' || !env.REDZEN_RATE_LIMIT_SECRET ||
        env.REDZEN_RATE_LIMIT_SECRET.length < 32) return json(unavailable, 503);
    try {
      if (endpoint === 'ready') {
        const ready = await (options.store?.() ?? createNeonInterestStore(env)).ready();
        return ready ? json({ status: 'ready' }) : json(unavailable, 503);
      }
      if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') || '')) {
        return json({ status: 'unsupported_media_type' }, 415);
      }
      if (request.headers.has('content-encoding') && request.headers.get('content-encoding') !== 'identity') {
        return json({ status: 'unsupported_media_type' }, 415);
      }
      // Same-origin JSON only; Vercel supplies the client IP independently of browser input.
      const origin = request.headers.get('origin');
      if (origin && origin !== new URL(request.url).origin) return json({ status: 'forbidden' }, 403);
      let body: unknown;
      try { body = await readJson(request); }
      catch (error) { return json({ status: 'invalid' }, (error as Error).message === 'too_large' ? 413 : 400); }
      if (!validInterest(body) || (body.kind === 'early-access' && BOOKING_STATUS.earlyAccessApplications !== true)) {
        return json({ status: 'invalid' }, 400);
      }
      const key = request.headers.get('Idempotency-Key');
      if (!key || !/^[a-zA-Z0-9-]{16,80}$/.test(key)) return json({ status: 'invalid' }, 400);
      const clientIP = request.headers.get('x-vercel-forwarded-for')?.trim();
      if (!clientIP || !isIP(clientIP)) return json(unavailable, 503);
      const input = { kind: body.kind, name: body.name.trim(), email: body.email.trim(), consent: true };
      const record = {
        id: createHash('sha256').update(key).digest('hex'),
        fingerprint: createHash('sha256').update(JSON.stringify(input)).digest('hex'),
        kind: body.kind, name: input.name, email: input.email,
        clientHash: createHmac('sha256', env.REDZEN_RATE_LIMIT_SECRET).update(clientIP).digest('hex'),
      };
      const result = await (options.store?.() ?? createNeonInterestStore(env)).put(record);
      if (result.status === 'rate_limited') return json({ status: 'rate_limited' }, 429, { 'Retry-After': '900' });
      if (result.status === 'conflict') return json({ status: 'conflict' }, 409);
      return json({ status: 'received', id: result.id, kind: result.kind,
        reservationConfirmed: false, paymentReceived: false }, 201);
    } catch {
      // Never log SQL errors, request bodies, credentials or query parameters.
      console.error('redzen_intake_unavailable');
      return json(unavailable, 503);
    }
  };
}
