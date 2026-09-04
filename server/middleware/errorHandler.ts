/**
 * Beyond Financials - Centralized Error Handler
 * 
 * Standardizes API error responses and prevents server-side stack trace leaks.
 */

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: Record<string, string[]> | string;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST', details?: Record<string, string[]> | string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(err: Error | AppError, req: Request, res: Response, _next: NextFunction): void {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = isAppError ? err.message : 'An unexpected error occurred. Please try again later.';
  const details = isAppError ? err.details : undefined;

  // Log error internally (without leaking secrets)
  console.error(`[ERROR] [${code}] ${err.message}`, process.env.NODE_ENV !== 'production' ? err.stack : '');

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  });
}
