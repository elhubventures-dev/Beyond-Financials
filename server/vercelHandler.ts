/**
 * Express app used by the Vercel function.
 * The marketing site is static. This file is bundled to api/index.js during the production build.
 */

import express from 'express';
import type { IncomingMessage } from 'node:http';
import { createApp } from './app';

export function restoreApiPath(req: IncomingMessage): void {
  const current = req.url || '/';
  let parsed: URL;
  try {
    parsed = new URL(current, 'http://localhost');
  } catch {
    return;
  }

  const forwarded = parsed.searchParams.get('bfpath');
  if (forwarded) {
    parsed.searchParams.delete('bfpath');
    const search = parsed.searchParams.toString();
    const path = forwarded.replace(/^\/+/, '');
    req.url = `/api/${path}${search ? `?${search}` : ''}`;
    return;
  }

  if (parsed.pathname === '/api' || parsed.pathname.startsWith('/api/')) return;

  const segments = parsed.searchParams
    .getAll('path')
    .flatMap((value) => value.split('/'))
    .filter(Boolean);
  if (segments.length === 0) return;

  parsed.searchParams.delete('path');
  const search = parsed.searchParams.toString();
  req.url = `/api/${segments.join('/')}${search ? `?${search}` : ''}`;
}

export function createVercelApp() {
  const root = express();
  root.use((req, _res, next) => {
    restoreApiPath(req);
    next();
  });
  root.use(createApp());
  return root;
}

export default createVercelApp();
