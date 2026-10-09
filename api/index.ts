/**
 * Vercel registers TypeScript files in /api as functions.
 * The bundled server is CommonJS so it can load under this ESM project.
 */
import { createRequire } from 'node:module';
import type { IncomingMessage, ServerResponse } from 'node:http';

const require = createRequire(import.meta.url);
const app = require('./server.cjs') as (req: IncomingMessage, res: ServerResponse) => void;

export default function handler(req: IncomingMessage, res: ServerResponse): void {
  app(req, res);
}
