import { EarlyAccessLead, DigitalReceipt, PaymentMethod } from '../types';
export interface EmailDispatchResult {
  success: boolean; messageId?: string; deliveredTo: string; receiptNumber: string;
  reservationCode: string; timestamp: string; receipt: DigitalReceipt;
  emailHtml: string; deliveryMode: 'smtp' | 'simulated';
}
export function generateReservationReceipt(_lead: EarlyAccessLead, _method: PaymentMethod = 'iDEAL', _transaction?: string): DigitalReceipt {
  throw new Error('Betalingsbewijzen en reserveringen zijn niet beschikbaar zonder gecontroleerde betaling en afzonderlijke activatie.');
}
export function buildReservationEmailHtml(_receipt: DigitalReceipt): string {
  throw new Error('Reserveringsbevestigingen zijn nog niet beschikbaar.');
}
export async function sendReservationConfirmation(_lead: EarlyAccessLead, _method: PaymentMethod = 'iDEAL', _transaction?: string): Promise<EmailDispatchResult> {
  throw new Error('Reserveringsbevestigingen zijn nog niet beschikbaar.');
}
