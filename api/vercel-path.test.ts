import assert from 'node:assert/strict';
import type { IncomingMessage } from 'node:http';
import { test } from 'node:test';
import { restoreApiPath } from './[...path]';

function request(url: string): IncomingMessage {
  return { url } as IncomingMessage;
}

test('vercel catch-all requests keep the original API path', () => {
  const contact = request('/api/contact');
  restoreApiPath(contact);
  assert.equal(contact.url, '/api/contact');

  const nested = request('/api/auth/forgot-password?email=ada%40example.com');
  restoreApiPath(nested);
  assert.equal(nested.url, '/api/auth/forgot-password?email=ada%40example.com');
});

test('vercel catch-all query segments are rebuilt into the API path', () => {
  const contact = request('/?path=contact');
  restoreApiPath(contact);
  assert.equal(contact.url, '/api/contact');

  const nested = request('/?path=auth&path=reset-password&token=abc');
  restoreApiPath(nested);
  assert.equal(nested.url, '/api/auth/reset-password?token=abc');
});
