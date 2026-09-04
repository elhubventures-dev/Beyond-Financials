/**
 * Beyond Financials - Core Full-Stack Application Server
 * 
 * Architecture:
 * - Express API Backend with centralized error handling and request sanitization
 * - Vite Middleware integration for seamless frontend development and static delivery
 * - Port: 3000, Host: 0.0.0.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requestLogger } from './server/middleware/logger';
import { errorHandler } from './server/middleware/errorHandler';
import { healthRouter } from './server/routes/health';
import { waitlistRouter } from './server/routes/waitlist';
import { contactRouter } from './server/routes/contact';
import { adminRouter } from './server/routes/adminLeads';
import { authRouter } from './server/routes/auth';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Global Middlewares
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  // Security Headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // API Routes (Mounted FIRST before Vite middleware)
  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/waitlist', waitlistRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/admin', adminRouter);

  // Fallback 404 for unhandled API routes
  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found on Beyond Financials gateway.',
      error: { code: 'NOT_FOUND' },
      timestamp: new Date().toISOString(),
    });
  });

  // Centralized Error Handling Middleware for API
  app.use(errorHandler);

  // Vite Middleware / Static Asset Serving
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

startServer().catch((err) => {
  console.error('[FATAL] Failed to start Beyond Financials server:', err);
  process.exit(1);
});
