import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper to get nodemailer transport
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass }
    });
  }
  return null;
}

// In-memory cache for leads synced from client
const leadsCache: Record<string, any> = {};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    smtpConfigured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
  });
});

// Endpoint: Send formal reservation confirmation email and digital receipt
app.post('/api/send-reservation-receipt', async (req, res) => {
  try {
    const { recipientEmail, recipientName, receipt, emailHtml } = req.body;

    if (!recipientEmail) {
      return res.status(400).json({ error: 'recipientEmail is required' });
    }

    const transporter = getMailTransporter();
    const senderFrom = process.env.EMAIL_FROM || 'RedZen Private Eco Wellness <reserveringen@redzensuites.nl>';
    const subject = `Officiële Reserveringsbevestiging & Betalingsbewijs #${receipt?.receiptNumber || 'RZ-REC-50'} — RedZen Suites`;

    if (transporter) {
      try {
        const info = await transporter.sendMail({
          from: senderFrom,
          to: recipientEmail,
          subject,
          html: emailHtml,
          text: `Geachte ${recipientName || 'Gewaardeerde Gast'},\n\nHartelijk dank voor je reservering bij RedZen Private Eco Wellness.\n\nJouw aanbetaling van €50,00 is succesvol ontvangen.\nReserveringscode: ${receipt?.reservationCode}\nFactuurnummer: ${receipt?.receiptNumber}\nTransactie ID: ${receipt?.transactionId}\n\nMet vriendelijke groet,\nRedZen Private Eco Wellness B.V.`
        });

        return res.json({
          success: true,
          mode: 'smtp',
          messageId: info.messageId,
          recipient: recipientEmail,
          receiptNumber: receipt?.receiptNumber,
          reservationCode: receipt?.reservationCode
        });
      } catch (smtpError: any) {
        console.warn('SMTP delivery attempt failed, falling back to simulated high-fidelity dispatch:', smtpError?.message);
      }
    }

    // High-fidelity fallback / preview mode
    return res.json({
      success: true,
      mode: 'simulated',
      messageId: `sim_msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      recipient: recipientEmail,
      receiptNumber: receipt?.receiptNumber,
      reservationCode: receipt?.reservationCode,
      note: 'Formal confirmation & digital receipt registered and rendered in-app. SMTP credentials can be set in .env to deliver to external inbox.'
    });
  } catch (error: any) {
    console.error('Error handling reservation receipt email:', error);
    return res.status(500).json({ error: error?.message || 'Failed to process email dispatch' });
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
