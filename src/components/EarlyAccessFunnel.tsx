import React, { useRef, useState } from 'react';
import { BOOKING_STATUS, PRICE_LABEL, PRICE_NOTICE } from '../data/bookingStatus';
import { InterestKind, createInterestRequestId, submitInterest } from '../services/interestService';
export const EarlyAccessFunnel: React.FC = () => {
  const [kind, setKind] = useState<InterestKind>('interest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [received, setReceived] = useState('');
  const lock = useRef(false);
  const attempt = useRef({ fingerprint: '', id: '' });
  const feedback = useRef<HTMLDivElement>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setPending(true); setError('');
    const input = { kind, name: name.trim(), email: email.trim(), consent };
    const fingerprint = JSON.stringify(input);
    try {
      if (attempt.current.fingerprint !== fingerprint) attempt.current = { fingerprint, id: createInterestRequestId() };
      setReceived(await submitInterest(input, attempt.current.id));
    }
    catch { setError('Je aanvraag kon niet worden bevestigd. Je invoer blijft staan; probeer later opnieuw.'); }
    finally { lock.current = false; setPending(false); requestAnimationFrame(() => feedback.current?.focus()); }
  }
  const fieldClass = 'mt-2 w-full min-h-12 rounded-xl bg-[#0B0D0E] border border-[#A9875A]/50 p-3 text-[#F7F5F1]';
  return <section aria-labelledby="interest-title" className="max-w-2xl mx-auto rounded-3xl border border-[#A9875A]/40 bg-[#15191A] p-5 sm:p-8 space-y-6 scroll-mt-28">
    <h2 id="interest-title" className="text-3xl font-serif">Blijf betrokken bij RedZen</h2>
    <p className="text-[#CBC8C0]">Standaardtarief: {PRICE_LABEL}. Geen aanbetaling, voucher of gereserveerd tijdslot.</p>
    <p className="text-sm text-[#CBC8C0]">{PRICE_NOTICE}</p>
    {received ? <div ref={feedback} tabIndex={-1} role="status" className="space-y-3">
      <h3 className="font-serif text-xl">{kind === 'early-access' ? 'Early Access-aanvraag ontvangen' : 'Belangstelling ontvangen'}</h3>
      <p>Referentie: {received}</p><p>Er is geen reservering of betaling bevestigd. Er is geen e-mailverzending bevestigd. Eventuele voordelen en opening volgen pas na bevestiging.</p>
    </div> : <form onSubmit={submit} aria-busy={pending} className="space-y-5">
      <fieldset disabled={pending} className="space-y-4">
        <legend className="font-semibold mb-3">Wat wil je aanvragen?</legend>
        <label className="flex gap-3 items-start min-h-12"><input className="mt-1" type="radio" name="kind" checked={kind === 'interest'} onChange={() => setKind('interest')} /><span>Belangstelling registreren <small className="block text-[#CBC8C0]">Ontvang nieuws over de ontwikkeling en opening.</small></span></label>
        {BOOKING_STATUS.earlyAccessApplications && <label className="flex gap-3 items-start min-h-12"><input className="mt-1" type="radio" name="kind" checked={kind === 'early-access'} onChange={() => setKind('early-access')} /><span>Early Access aanvragen <small className="block text-[#CBC8C0]">Vraag informatie over toekomstige toegang. Geen gegarandeerde korting of voorrang.</small></span></label>}
        <label className="block" htmlFor="interest-name">Naam<input className={fieldClass} id="interest-name" name="name" autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} required maxLength={100} /></label>
        <label className="block" htmlFor="interest-email">E-mailadres<input className={fieldClass} id="interest-email" name="email" type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} /></label>
        <label className="flex gap-3 items-start min-h-12"><input type="checkbox" className="mt-1" required checked={consent} onChange={e => setConsent(e.target.checked)} /><span className="text-sm">Je mag mij per e-mail informeren over mijn aanvraag en de ontwikkeling van RedZen. Lees de <a href="#/privacy" className="underline">privacyverklaring</a>.</span></label>
        <button disabled={pending} className="w-full min-h-12 rounded-xl bg-[#C5A069] text-[#0B0D0E] font-bold px-4 py-3 disabled:opacity-60" type="submit">{pending ? 'Aanvraag wordt verwerkt…' : kind === 'early-access' ? 'Early Access aanvragen' : 'Belangstelling registreren'}</button>
      </fieldset>
      <div ref={feedback} tabIndex={-1}>{error && <p role="alert" className="text-rose-200">{error}</p>}</div>
      <p className="text-sm text-[#CBC8C0]">Reserveren is nog niet beschikbaar. Alleen een bevestiging na serveropslag betekent dat je aanvraag ontvangen is.</p>
    </form>}
  </section>;
};
