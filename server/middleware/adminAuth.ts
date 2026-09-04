/**
 * Beyond Financials - Pre-Launch Admin Authentication Middleware
 * 
 * Protects administrative lead management routes (/api/admin/*) using
 * server-enforced key verification.
 * 
 * NOTE FOR PHASE 1 PRODUCTION:
 * This development-safe pre-launch key verification will be superseded
 * by the complete Multi-Factor Role-Based Access Control (RBAC) authentication
 * framework during the foundation rollout.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'bf_admin_dev_key_2026';

export function adminAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers['authorization'];
    const customHeader = req.headers['x-admin-key'];

    let providedKey: string | undefined;

    if (customHeader && typeof customHeader === 'string') {
      providedKey = customHeader.trim();
    } else if (authHeader && typeof authHeader === 'string') {
      if (authHeader.startsWith('Bearer ')) {
        providedKey = authHeader.slice(7).trim();
      } else {
        providedKey = authHeader.trim();
      }
    }

    if (!providedKey || providedKey !== ADMIN_API_KEY) {
      throw new AppError(
        'Unauthorized: Invalid or missing administrator credentials for Beyond Financials lead management.',
        401,
        'ADMIN_UNAUTHORIZED'
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
