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

import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export type AdminAccessState = 'ok' | 'unconfigured' | 'rejected';

/** Reads the admin key at request time. An empty or missing value never grants access. */
export function getAdminApiKey(): string | null {
  const value = process.env.ADMIN_API_KEY?.trim();
  return value ? value : null;
}

function keysMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) {
    crypto.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export function readProvidedAdminKey(req: Request): string {
  const customHeader = req.headers['x-admin-key'];
  if (typeof customHeader === 'string' && customHeader.trim()) {
    return customHeader.trim();
  }

  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'string') return '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7).trim();
  return authHeader.trim();
}

export function adminAccessState(provided: string): AdminAccessState {
  const expected = getAdminApiKey();
  if (!expected) return 'unconfigured';
  if (!provided || !keysMatch(provided, expected)) return 'rejected';
  return 'ok';
}

export function adminAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const state = adminAccessState(readProvidedAdminKey(req));
    if (state === 'unconfigured') {
      throw new AppError(
        'Administrator access is not configured.',
        503,
        'ADMIN_UNCONFIGURED'
      );
    }
    if (state !== 'ok') {
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
