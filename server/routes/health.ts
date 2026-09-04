/**
 * Beyond Financials - Health & System Status Route
 */

import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Beyond Financials core gateway is healthy.',
    data: {
      service: 'beyond-financials-api',
      domain: 'beyondfinancials.ng',
      version: '1.0.0-foundation',
      status: 'HEALTHY',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      activePhase: 'PHASE_1_FOUNDATION',
      contractedScope: {
        timeline: '8–10 weeks',
        investment: '₦3,500,000',
        totalDeliverables: 45,
      },
      mockProvidersActive: true,
      security: {
        auditLoggingEnabled: true,
        secretsIsolation: 'SERVER_SIDE_ONLY',
        realTransactionsEnabled: false,
      },
    },
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get('/system/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'System architecture active status overview.',
    data: {
      ledgerArchitecture: 'PREPARED_IMMUTABLE_DOUBLE_ENTRY',
      providers: {
        banking: 'MOCK_BANKING_ADAPTER_DEV_ONLY',
        kyc: 'MOCK_KYC_ADAPTER_DEV_ONLY',
        payment: 'MOCK_PAYMENT_GATEWAY_DEV_ONLY',
        bills: 'MOCK_BILLS_ADAPTER_DEV_ONLY',
        notification: 'MOCK_NOTIFICATION_ADAPTER_DEV_ONLY',
      },
      disclaimer: 'This application is currently in Foundation Development Phase. No real financial operations are executed.',
    },
    timestamp: new Date().toISOString(),
  });
});
