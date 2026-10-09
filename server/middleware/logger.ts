/**
 * Beyond Financials - Sanitized Request Logging Middleware
 * 
 * SECURITY PRINCIPLE:
 * Strictly avoids logging passwords, BVN, NIN, card details, or auth tokens.
 */

import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const { method, url } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    // Mask sensitive routes or headers
    const sanitizedUrl = String(url || '')
      .replace(/([?&](bvn|nin|password|token)=)[^&]+/gi, '$1[REDACTED]')
      .replace(/(\/sessions\/)[^/?]+/gi, '$1[REDACTED]');
    console.log(`[HTTP] ${method} ${sanitizedUrl} -> ${statusCode} (${duration}ms)`);
  });

  next();
}
