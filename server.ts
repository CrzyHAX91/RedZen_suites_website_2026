import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { interestRoutes } from './server/interestRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', interestRoutes());
app.use('/api', (_req, res) => res.status(404).json({ status: 'not_found' }));

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
