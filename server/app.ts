/**
 * Express application used by the server entrypoint and by API tests.
 * Does not listen, and does not start Vite.
 */

import express from 'express';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { waitlistRouter } from './routes/waitlist';
import { contactRouter } from './routes/contact';
import { adminRouter } from './routes/adminLeads';
import { authRouter } from './routes/auth';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/waitlist', waitlistRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/admin', adminRouter);

  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found on Beyond Financials gateway.',
      error: { code: 'NOT_FOUND' },
      timestamp: new Date().toISOString(),
    });
  });

  app.use(errorHandler);
  return app;
}
