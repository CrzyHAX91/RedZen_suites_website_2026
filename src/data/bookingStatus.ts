// Verified business inputs, 13 October 2026. Change through reviewed code only.
export const STANDARD_PRICE = 200;
export const SESSION_HOURS = 2;
export const PRICE_LABEL = `€${STANDARD_PRICE} per ${SESSION_HOURS} uur`;
export interface BookingStatus {
  phase: 'development' | 'opening-confirmed' | 'open';
  locationConfirmed: boolean;
  openingConfirmed: boolean;
  calendarReady: boolean;
  reservationsApproved: boolean;
  earlyAccessApplications: boolean;
  offer: { confirmed: boolean; discount: number; expiresAt: string | null; terms: string | null };
}
export const BOOKING_STATUS: BookingStatus = {
  phase: 'development', locationConfirmed: false, openingConfirmed: false,
  calendarReady: false, reservationsApproved: false, earlyAccessApplications: true,
  offer: { confirmed: false, discount: 50, expiresAt: null, terms: null },
};
export function bookingView(status: BookingStatus, now = new Date()) {
  const canReserve = ['opening-confirmed', 'open'].includes(status.phase) &&
    status.locationConfirmed === true && status.openingConfirmed === true &&
    status.calendarReady === true && status.reservationsApproved === true;
  const expiry = status.offer.expiresAt ? Date.parse(status.offer.expiresAt) : NaN;
  const offerActive = status.offer.confirmed === true && Boolean(status.offer.terms?.trim()) &&
    Number.isFinite(expiry) && expiry > now.getTime() &&
    Number.isFinite(status.offer.discount) && status.offer.discount > 0 && status.offer.discount < STANDARD_PRICE;
  return { canReserve, offerActive, price: offerActive ? STANDARD_PRICE - status.offer.discount : STANDARD_PRICE,
    primaryLabel: canReserve ? 'Bekijk reserveringsmogelijkheden' :
      status.earlyAccessApplications === true ? 'Early Access aanvragen' : 'Belangstelling registreren' };
}
export const BOOKING_VIEW = bookingView(BOOKING_STATUS);
export const DEVELOPMENT_NOTICE = 'Eerste locatie in ontwikkeling. Opening en boekingskalender zijn nog niet bevestigd. Een aanvraag is geen reservering of betaling.';
