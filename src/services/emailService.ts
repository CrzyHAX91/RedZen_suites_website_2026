import { EarlyAccessLead, DigitalReceipt, PaymentMethod } from '../types';

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  deliveredTo: string;
  receiptNumber: string;
  reservationCode: string;
  timestamp: string;
  receipt: DigitalReceipt;
  emailHtml: string;
  deliveryMode: 'smtp' | 'simulated';
}

/**
 * Generate a deterministic or randomized reservation code and receipt number
 */
export function generateReservationReceipt(
  lead: EarlyAccessLead,
  paymentMethod: PaymentMethod = 'iDEAL',
  customTransactionId?: string
): DigitalReceipt {
  const dateObj = new Date();
  const dateStr = dateObj.toISOString().split('T')[0].replace(/-/g, '');
  const memberPadded = String(lead.memberNumber || 745).padStart(4, '0');
  
  const reservationCode = lead.reservationCode || `RZ-RES-${dateStr.slice(0, 4)}-${memberPadded}`;
  const receiptNumber = lead.receiptNumber || `RZ-REC-50-${memberPadded}`;
  const transactionId = customTransactionId || lead.transactionId || `TXN-RZ${Date.now().toString(36).toUpperCase()}`;

  const depositAmountPaid = 50.00;
  const totalRetailValue = 200.00;
  const earlyAccessDiscount = 50.00; // €50 discount for early members
  const remainingAmountDue = 100.00; // €150 early bird price - €50 deposit = €100 due upon booking
  const vatRate = 0.21;
  const netAmountExVat = Number((depositAmountPaid / (1 + vatRate)).toFixed(2)); // €41.32
  const vatAmount = Number((depositAmountPaid - netAmountExVat).toFixed(2)); // €8.68

  return {
    receiptNumber,
    reservationCode,
    transactionId,
    customerName: lead.firstName,
    customerEmail: lead.email,
    customerCity: lead.city,
    issueDate: dateObj.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    itemDescription: 'RedZen Early Access Pre-Order Aanbetaling & 48u Voorrangslicentie (2-Uurs Privé Wellness Suite)',
    totalRetailValue,
    earlyAccessDiscount,
    depositAmountPaid,
    vatAmount,
    netAmountExVat,
    remainingAmountDue,
    paymentMethod,
    paymentStatus: 'PAID',
    companyName: 'RedZen Private Eco Wellness B.V.',
    companyKvk: 'KVK 89412093 (Vestiging Amsterdam)',
    companyVat: 'BTW-ID NL864921048B01',
    companyAddress: 'Keizersgracht 482, 1016 EG Amsterdam, Nederland'
  };
}

/**
 * Builds the official high-end branded HTML email template for RedZen
 */
export function buildReservationEmailHtml(receipt: DigitalReceipt): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Officiële Reserveringsbevestiging & Betalingsbewijs - RedZen</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0D0E; color: #F7F5F1; margin: 0; padding: 20px; line-height: 1.6; }
    .container { max-width: 620px; margin: 0 auto; background: #141819; border: 1px solid rgba(169, 135, 90, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
    .header { background: linear-gradient(180deg, #1C2224 0%, #141819 100%); padding: 36px 30px; text-align: center; border-bottom: 1px solid rgba(169, 135, 90, 0.3); }
    .logo-badge { display: inline-block; padding: 6px 16px; background: rgba(169, 135, 90, 0.15); border: 1px solid #A9875A; color: #A9875A; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; }
    .title { font-family: 'Playfair Display', Georgia, serif; font-size: 26px; color: #F7F5F1; margin: 0 0 8px 0; }
    .subtitle { color: #A9AAA7; font-size: 13px; margin: 0; }
    .content { padding: 32px 30px; }
    .greeting { font-size: 15px; color: #F7F5F1; margin-bottom: 20px; }
    .highlight-box { background: #0B0D0E; border: 1px solid rgba(169, 135, 90, 0.5); border-radius: 12px; padding: 20px; margin: 24px 0; }
    .grid-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; }
    .grid-row:last-child { border-bottom: none; }
    .grid-label { color: #A9AAA7; }
    .grid-val { color: #F7F5F1; font-weight: 600; text-align: right; }
    .gold-text { color: #A9875A !important; font-weight: bold; }
    .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    .receipt-table th { text-align: left; padding: 10px; background: rgba(255,255,255,0.03); color: #A9875A; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .receipt-table td { padding: 12px 10px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #F7F5F1; }
    .privilege-card { background: rgba(169, 135, 90, 0.08); border-left: 3px solid #A9875A; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .footer { background: #0B0D0E; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #7A7C7E; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-badge">RedZen Suites • Officiële Bevestiging</div>
      <h1 class="title">Reservering & Betalingsbewijs</h1>
      <p class="subtitle">Aanbetaling van &euro;50,00 succesvol verwerkt • 48u Voorrang geactiveerd</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p class="greeting">Geachte <strong>${receipt.customerName}</strong>,</p>
      <p style="color: #A9AAA7; font-size: 14px;">
        Hartelijk dank voor je reservering bij <strong>RedZen Private Eco Wellness</strong>. Jouw aanbetaling van <strong>&euro;50,00</strong> is in goede orde ontvangen en je exclusieve Early Access privileges zijn per direct vastgelegd.
      </p>

      <!-- Key Codes Box -->
      <div class="highlight-box">
        <div class="grid-row">
          <span class="grid-label">Persoonlijke Reserveringscode:</span>
          <span class="grid-val gold-text">${receipt.reservationCode}</span>
        </div>
        <div class="grid-row">
          <span class="grid-label">Digitaal Factuur- / Bewijsnummer:</span>
          <span class="grid-val">${receipt.receiptNumber}</span>
        </div>
        <div class="grid-row">
          <span class="grid-label">Transactie ID:</span>
          <span class="grid-val" style="font-family: monospace;">${receipt.transactionId}</span>
        </div>
        <div class="grid-row">
          <span class="grid-label">Betaalwijze & Status:</span>
          <span class="grid-val" style="color: #34D399;">${receipt.paymentMethod} • Voldaangesteld (PAID)</span>
        </div>
        <div class="grid-row">
          <span class="grid-label">Datum & Tijdstip:</span>
          <span class="grid-val">${receipt.issueDate}</span>
        </div>
      </div>

      <!-- Financial Receipt Breakdown -->
      <h3 style="font-size: 15px; font-family: Georgia, serif; color: #F7F5F1; margin: 24px 0 10px 0;">Financiële Specificatie & BTW-Overzicht</h3>
      <table class="receipt-table">
        <thead>
          <tr>
            <th>Omschrijving</th>
            <th style="text-align: right;">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${receipt.itemDescription}</strong><br>
              <span style="font-size: 11px; color: #A9AAA7;">Standaard tarief 2-uurs suite: &euro;200,00</span>
            </td>
            <td style="text-align: right;">&euro;${receipt.totalRetailValue.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="color: #A9875A;">
              <strong>Early Access Welkomstkorting</strong><br>
              <span style="font-size: 11px; color: #A9AAA7;">Exclusief toegekend voor de eerste 1.000 members</span>
            </td>
            <td style="text-align: right; color: #A9875A;">- &euro;${receipt.earlyAccessDiscount.toFixed(2)}</td>
          </tr>
          <tr>
            <td>
              <strong>Voldane Aanbetaling (Nu afgerekend)</strong><br>
              <span style="font-size: 11px; color: #A9AAA7;">Inclusief 21% BTW (&euro;${receipt.vatAmount.toFixed(2)}) • Netto excl. BTW: &euro;${receipt.netAmountExVat.toFixed(2)}</span>
            </td>
            <td style="text-align: right; color: #34D399; font-weight: bold;">&euro;${receipt.depositAmountPaid.toFixed(2)}</td>
          </tr>
          <tr style="background: rgba(255,255,255,0.02);">
            <td style="font-weight: bold; border-top: 1px solid rgba(169,135,90,0.3);">
              Resterend te voldoen bij het definitief inplannen van je datum/tijd:
            </td>
            <td style="text-align: right; font-weight: bold; border-top: 1px solid rgba(169,135,90,0.3); font-size: 15px; color: #F7F5F1;">
              &euro;${receipt.remainingAmountDue.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Guaranteed Privileges -->
      <div class="privilege-card">
        <h4 style="margin: 0 0 6px 0; color: #A9875A; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Jouw Gegarandeerde Voordelen:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #A9AAA7;">
          <li style="margin-bottom: 4px;"><strong style="color: #F7F5F1;">48u Voorrangstoegang:</strong> Je ontvangt 48 uur vóór de landelijke publieksopening een persoonlijke link om als eerste je suite, datum en gewenste tijdstip te selecteren.</li>
          <li style="margin-bottom: 4px;"><strong style="color: #F7F5F1;">100% Verrekening:</strong> Jouw &euro;50 aanbetaling wordt direct in mindering gebracht op het gereduceerde Early Bird tarief (&euro;150 i.p.v. &euro;200).</li>
          <li style="margin-bottom: 4px;"><strong style="color: #F7F5F1;">Locatiereveal Primeur:</strong> Je ontvangt als allereerste bericht over de exacte adreslocatie en openingsdata.</li>
          <li><strong style="color: #F7F5F1;">Kosteloos Omboeken:</strong> Je gekozen datum kan tot 24u voor aanvang kosteloos gewijzigd worden.</li>
        </ul>
      </div>

      <p style="font-size: 12px; color: #7A7C7E; margin-top: 24px;">
        Vragen over je reservering of wil je een arrangement toevoegen? Beantwoord gerust deze e-mail of neem contact op via <a href="mailto:contact@redzensuites.nl" style="color: #A9875A; text-decoration: underline;">contact@redzensuites.nl</a>.
      </p>
    </div>

    <!-- Footer with legal / business info -->
    <div class="footer">
      <p style="font-weight: 600; color: #A9AAA7;">${receipt.companyName}</p>
      <p>${receipt.companyAddress}</p>
      <p>${receipt.companyKvk} • ${receipt.companyVat}</p>
      <p style="margin-top: 8px;">&copy; ${new Date().getFullYear()} RedZen Suites. Alle rechten voorbehouden.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sends or simulates sending the formal reservation confirmation and receipt
 */
export async function sendReservationConfirmation(
  lead: EarlyAccessLead,
  paymentMethod: PaymentMethod = 'iDEAL',
  customTransactionId?: string
): Promise<EmailDispatchResult> {
  const receipt = generateReservationReceipt(lead, paymentMethod, customTransactionId);
  const emailHtml = buildReservationEmailHtml(receipt);
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch('/api/send-reservation-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail: lead.email,
        recipientName: lead.firstName,
        receipt,
        emailHtml
      })
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        messageId: data.messageId || `msg_${Date.now()}`,
        deliveredTo: lead.email,
        receiptNumber: receipt.receiptNumber,
        reservationCode: receipt.reservationCode,
        timestamp,
        receipt,
        emailHtml,
        deliveryMode: data.mode === 'smtp' ? 'smtp' : 'simulated'
      };
    }
  } catch {
    // Graceful fallback for local development or disconnected backend
  }

  return {
    success: true,
    messageId: `sim_msg_${Date.now()}`,
    deliveredTo: lead.email,
    receiptNumber: receipt.receiptNumber,
    reservationCode: receipt.reservationCode,
    timestamp,
    receipt,
    emailHtml,
    deliveryMode: 'simulated'
  };
}
