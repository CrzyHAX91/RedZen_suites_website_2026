import React from 'react';
import { BOOKING_STATUS, BOOKING_VIEW, PRICE_LABEL, PRICE_NOTICE, DEVELOPMENT_NOTICE } from '../data/bookingStatus';
export function BookingStatusPanel() {
  return <section aria-labelledby="booking-status-title" className="rounded-2xl border border-[#A9875A]/40 bg-[#15191A] p-5 sm:p-8 space-y-4">
    <p className="text-sm text-[#E8C58D]">{BOOKING_STATUS.phase === 'development' ? 'In ontwikkeling' : 'Openingsstatus'}</p>
    <h2 id="booking-status-title" className="font-serif text-2xl">Privéwellness · {PRICE_LABEL}</h2>
    <p className="text-sm leading-relaxed text-[#CBC8C0]">{BOOKING_VIEW.canReserve ? 'De gecontroleerde voorwaarden voor reserveren zijn vervuld.' : DEVELOPMENT_NOTICE}</p>
    <dl className="grid gap-4 sm:grid-cols-3 text-sm">
      <div><dt className="text-[#A9AAA7]">Locatie</dt><dd>{BOOKING_STATUS.locationConfirmed ? 'Bevestigd' : 'Markerkant 13-10, nummer 146 wordt onderzocht; geen bevestigde klantlocatie.'}</dd></div>
      <div><dt className="text-[#A9AAA7]">Opening</dt><dd>{BOOKING_STATUS.openingConfirmed ? 'Bevestigd' : 'Datum nog niet bevestigd'}</dd></div>
      <div><dt className="text-[#A9AAA7]">Reserveren</dt><dd>{BOOKING_VIEW.canReserve ? 'Beschikbaar na afzonderlijke activatie' : 'Nog niet beschikbaar'}</dd></div>
    </dl>
    <p className="text-sm text-[#CBC8C0]">{BOOKING_VIEW.offerActive ? `Early Access-voordeel: €${BOOKING_STATUS.offer.discount}. ${BOOKING_STATUS.offer.terms}` : PRICE_NOTICE}</p>
  </section>;
}
