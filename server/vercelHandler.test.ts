import assert from 'node:assert/strict';
import type { IncomingMessage } from 'node:http';
import { test } from 'node:test';
import { restoreApiPath } from './vercelHandler';

function request(url: string): IncomingMessage {
  return { url } as IncomingMessage;
}

test('direct API paths are left unchanged', () => {
  const contact = request('/api/contact');
  restoreApiPath(contact);
  assert.equal(contact.url, '/api/contact');

  const nested = request('/api/auth/forgot-password?email=ada%40example.com');
  restoreApiPath(nested);
  assert.equal(nested.url, '/api/auth/forgot-password?email=ada%40example.com');
});

test('rewritten Vercel paths are restored from bfpath', () => {
  const contact = request('/api/index?bfpath=contact');
  restoreApiPath(contact);
  assert.equal(contact.url, '/api/contact');

  const nested = request('/api/index?bfpath=auth/reset-password&token=abc');
  restoreApiPath(nested);
  assert.equal(nested.url, '/api/auth/reset-password?token=abc');
});
