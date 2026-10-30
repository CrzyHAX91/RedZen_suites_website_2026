import express from 'express';
import { interestRoutes } from './interestRoutes';

// Shared by the standalone server and HTTP regression tests.
export function createApp(storagePath = process.env.LEAD_STORAGE_PATH) {
  const app = express();
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', interestRoutes(storagePath));
  app.use('/api', (_req, res) => res.status(404).json({ status: 'not_found' }));
  return app;
}
