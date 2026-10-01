import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { dispatchReservationEmail, EmailDeliveryError } from './src/services/emailDelivery';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory cache for leads synced from client
const leadsCache: Record<string, any> = {};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    emailProviderConfigured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
  });
});

// Endpoint: Send formal reservation confirmation email and digital receipt
app.post('/api/send-reservation-receipt', async (req, res) => {
  try {
    const { recipientEmail, recipientName, receipt, emailHtml, dryRun } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ error: 'recipientEmail is required' });
    }

    const senderFrom = process.env.EMAIL_FROM;
    const subject = `Officiële Reserveringsbevestiging & Betalingsbewijs #${receipt?.receiptNumber || 'RZ-REC-50'} — RedZen Suites`;
    const dispatch = await dispatchReservationEmail({
      recipientEmail,
      senderFrom: senderFrom || '',
      subject,
      html: emailHtml || '',
      text: `Geachte ${recipientName || 'Gewaardeerde Gast'},\n\nHartelijk dank voor je reservering bij RedZen Private Eco Wellness.\n\nJouw aanbetaling van €50,00 is succesvol ontvangen.\nReserveringscode: ${receipt?.reservationCode}\nFactuurnummer: ${receipt?.receiptNumber}\nTransactie ID: ${receipt?.transactionId}\n\nMet vriendelijke groet,\nRedZen Private Eco Wellness B.V.`,
      dryRun: dryRun === true
    });

    return res.status(200).json({
      ...dispatch,
      ...(dispatch.success ? { messageId: dispatch.messageId } : {}),
      recipientEmail,
      receiptNumber: receipt?.receiptNumber,
      reservationCode: receipt?.reservationCode
    });
  } catch (error: any) {
    console.error('Error handling reservation receipt email:', error);
    const statusCode = error instanceof EmailDeliveryError ? error.statusCode : 502;
    return res.status(statusCode).json({
      success: false,
      mode: 'failed',
      error: error?.message || 'Failed to send email'
    });
  }
});

// Endpoint: Save/sync lead
app.post('/api/leads', (req, res) => {
  const lead = req.body;
  if (lead && lead.id) {
    leadsCache[lead.id] = { ...leadsCache[lead.id], ...lead };
  }
  res.json({ success: true, lead });
});

// Endpoint: Record payment on lead
app.post('/api/leads/:id/payment', (req, res) => {
  const { id } = req.params;
  const paymentInfo = req.body;
  if (leadsCache[id]) {
    leadsCache[id] = {
      ...leadsCache[id],
      status: 'converted',
      paymentStatus: 'deposit_paid',
      paidAt: new Date().toISOString(),
      ...paymentInfo
    };
  }
  res.json({ success: true, lead: leadsCache[id] });
});

// Endpoint: Update lead status
app.patch('/api/leads/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (leadsCache[id]) {
    leadsCache[id].status = status;
  }
  res.json({ success: true, id, status });
});

app.patch('/api/leads/:id/email-status', (req, res) => {
  const { id } = req.params;
  const { emailDeliveryStatus } = req.body;
  if (leadsCache[id]) {
    leadsCache[id].emailDeliveryStatus = emailDeliveryStatus;
    leadsCache[id].emailSentAt = emailDeliveryStatus === 'sent' ? new Date().toISOString() : undefined;
  }
  res.json({ success: true, id, emailDeliveryStatus });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RedZen Server running on http://localhost:${PORT}`);
  });
}

startServer();
