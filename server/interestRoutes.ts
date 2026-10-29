import { Router } from 'express';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { validInterest } from '../src/services/interestService';
import { BOOKING_STATUS } from '../src/data/bookingStatus';

// A durable, private volume is required. No in-memory or simulated success fallback.
export function interestRoutes(storagePath = process.env.LEAD_STORAGE_PATH) {
  const router = Router();
  router.post('/interest', async (req, res) => {
    if (!validInterest(req.body) || (req.body.kind === 'early-access' && !BOOKING_STATUS.earlyAccessApplications)) {
      return res.status(400).json({ status: 'invalid' });
    }
    const key = req.get('Idempotency-Key');
    if (!key || !/^[a-zA-Z0-9-]{16,80}$/.test(key)) return res.status(400).json({ status: 'invalid' });
    if (!storagePath || !path.isAbsolute(storagePath)) return res.status(503).json({ status: 'unavailable' });
    const { kind, name, email } = req.body;
    const input = { kind, name: name.trim(), email: email.trim(), consent: true };
    const fingerprint = createHash('sha256').update(JSON.stringify(input)).digest('hex');
    const id = createHash('sha256').update(key).digest('hex');
    const file = path.join(storagePath, `${id}.json`);
    try {
      await mkdir(storagePath, { recursive: true, mode: 0o700 });
      const record = { id, fingerprint, ...input, receivedAt: new Date().toISOString() };
      try {
        await writeFile(file, JSON.stringify(record), { flag: 'wx', mode: 0o600 });
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
        const previous = JSON.parse(await readFile(file, 'utf8'));
        if (previous.fingerprint !== fingerprint) return res.status(409).json({ status: 'conflict' });
      }
      return res.status(201).json({ status: 'received', id, kind, reservationConfirmed: false, paymentReceived: false });
    } catch {
      return res.status(503).json({ status: 'unavailable' });
    }
  });
  const closed = (_req: unknown, res: any) => res.status(409).json({ success: false, status: 'not_available', reservationConfirmed: false, paymentReceived: false });
  router.post('/send-reservation-receipt', closed);
  router.post('/leads/:id/payment', closed);
  // Legacy clients cannot upload paid/converted state through the generic sync endpoint.
  router.post('/leads', closed);
  router.patch('/leads/:id/status', closed);
  return router;
}
