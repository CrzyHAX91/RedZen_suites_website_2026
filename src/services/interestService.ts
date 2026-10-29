export type InterestKind = 'interest' | 'early-access';
export interface InterestInput { kind: InterestKind; name: string; email: string; consent: boolean; }
// HTTP previews may expose getRandomValues but not randomUUID. Never use weak random IDs.
export function createInterestRequestId(source: Pick<Crypto, 'getRandomValues'> & Partial<Pick<Crypto, 'randomUUID'>> = globalThis.crypto) {
  if (typeof source?.randomUUID === 'function') return source.randomUUID();
  if (typeof source?.getRandomValues !== 'function') throw new Error('Veilige aanvraagcode niet beschikbaar.');
  return Array.from(source.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
}
export function validInterest(value: unknown): value is InterestInput {
  if (!value || typeof value !== 'object') return false;
  const v = value as InterestInput;
  return ['interest', 'early-access'].includes(v.kind) && typeof v.name === 'string' &&
    v.name.trim().length > 0 && v.name.length <= 100 && typeof v.email === 'string' &&
    v.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) && v.consent === true;
}
export async function submitInterest(input: InterestInput, requestId: string, request = fetch) {
  if (!validInterest(input)) throw new Error('Controleer je naam, e-mailadres en toestemming.');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await request('/api/interest', { method: 'POST', headers: {
      'Content-Type': 'application/json', 'Idempotency-Key': requestId,
    }, body: JSON.stringify(input), signal: controller.signal });
    const result = await response.json();
    if (!response.ok || result.status !== 'received' || typeof result.id !== 'string' ||
      result.kind !== input.kind || result.reservationConfirmed !== false || result.paymentReceived !== false) {
      throw new Error('Je aanvraag kon niet worden bevestigd. Je invoer blijft staan; probeer later opnieuw.');
    }
    return result.id as string;
  } catch {
    throw new Error('Je aanvraag kon niet worden bevestigd. Je invoer blijft staan; probeer later opnieuw.');
  } finally { clearTimeout(timer); }
}
