/**
 * Beyond Financials - Core Full-Stack Application Server
 *
 * Architecture:
 * - Express API Backend with centralized error handling and request sanitization
 * - Vite Middleware integration for seamless frontend development and static delivery
 * - Port: 3000, Host: 0.0.0.0
 */

import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { assertProcessMode } from './server/email/config';
import { createApp } from './server/app';

export async function startServer() {
  assertProcessMode();
  const app = createApp();
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BEYOND FINANCIALS] Server initialized on http://0.0.0.0:${PORT}`);
    console.log(`[BEYOND FINANCIALS] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[BEYOND FINANCIALS] Provider Architecture: PLUGGABLE ADAPTER (Mock Active)`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('[FATAL] Failed to start Beyond Financials server:', err);
    process.exit(1);
  });
}
