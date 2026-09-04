/**
 * Beyond Financials - Authentication Rate Limiting Middleware
 * 
 * Protects login, registration, password change, and recovery endpoints
 * against brute force attacks and credential stuffing.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

interface RateLimitTracker {
  count: number;
  resetTime: number;
}

// In-memory buckets by IP + route
const buckets = new Map<string, RateLimitTracker>();

// Clean up stale buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, tracker] of buckets.entries()) {
    if (now > tracker.resetTime) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  endpointName: string;
}

export function createAuthRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, endpointName } = options;

  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
      const key = `${endpointName}:${clientIp}`;
      const now = Date.now();

      let tracker = buckets.get(key);

      if (!tracker || now > tracker.resetTime) {
        tracker = {
          count: 1,
          resetTime: now + windowMs,
        };
        buckets.set(key, tracker);
        return next();
      }

      tracker.count += 1;

      if (tracker.count > maxRequests) {
        const retryAfterSeconds = Math.ceil((tracker.resetTime - now) / 1000);
        throw new AppError(
          `Too many authentication requests for ${endpointName}. Please wait ${retryAfterSeconds} seconds before trying again.`,
          429,
          'RATE_LIMIT_EXCEEDED'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

// Pre-configured rate limiters
export const loginRateLimiter = createAuthRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  maxRequests: 10, // 10 login attempts per 15 min per IP
  endpointName: 'login',
});

export const registerRateLimiter = createAuthRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 10, // 10 registrations per hour per IP
  endpointName: 'register',
});

export const passwordRecoveryRateLimiter = createAuthRateLimiter({
  windowMs: 30 * 60 * 1000, // 30 mins
  maxRequests: 5, // 5 requests per 30 mins per IP
  endpointName: 'recovery',
});

export const passwordChangeRateLimiter = createAuthRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  maxRequests: 6, // 6 attempts per 15 mins
  endpointName: 'password-change',
});
