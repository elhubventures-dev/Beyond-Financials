/**
 * Beyond Financials - Health & System Status Route
 */

import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Beyond Financials is preparing for launch.',
    data: {
      service: 'beyond-financials',
      status: 'PRE_LAUNCH',
      realTransactionsEnabled: false,
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get('/system/status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Beyond Financials services are not yet available to the public.',
    data: {
      status: 'PRE_LAUNCH',
      realTransactionsEnabled: false,
    },
    timestamp: new Date().toISOString(),
  });
});
