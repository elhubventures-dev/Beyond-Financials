/**
 * Vercel serves the marketing site as static files.
 * This catch-all exposes the existing Express API at /api/* on that host.
 * Static files are chosen before this rewrite, so /api requests reach this function.
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server/app';

const app = createApp();

export function restoreApiPath(req: IncomingMessage): void {
  const current = req.url || '/';
  const pathOnly = current.split('?')[0];
  if (pathOnly === '/api' || pathOnly.startsWith('/api/')) return;

  const parsed = new URL(current, 'http://localhost');
  const segments = parsed.searchParams
    .getAll('path')
    .flatMap((value) => value.split('/'))
    .filter(Boolean);
  if (segments.length === 0) return;

  parsed.searchParams.delete('path');
  const search = parsed.searchParams.toString();
  req.url = `/api/${segments.join('/')}${search ? `?${search}` : ''}`;
}

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  restoreApiPath(req);
  app(req, res);
}
