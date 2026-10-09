import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import {
  classifyProviderFailure,
  EmailTransport,
  getEmailDeliveryLog,
  resetEmailStateForTests,
  sendEmail,
  setEmailTransportForTests,
} from './emailService';

const baseInput = {
  to: 'ada@example.com',
  subject: 'Hello',
  html: '<p>Hello</p>',
  text: 'Hello',
  template: 'unit',
  correlationId: 'corr-1',
};

beforeEach(() => {
  process.env.NODE_ENV = 'test';
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
  resetEmailStateForTests();
});

afterEach(() => {
  resetEmailStateForTests();
});

test('missing Resend configuration does not report a successful send', async () => {
  const result = await sendEmail({ ...baseInput, idempotencyKey: 'missing-config' });
  assert.equal(result.status, 'unavailable');
  assert.equal(result.providerMessageId, undefined);
  assert.equal(result.attempts, 0);
});

test('provider acceptance is recorded without treating it as inbox delivery', async () => {
  const calls: string[] = [];
  const transport: EmailTransport = {
    async send(payload) {
      calls.push(payload.to);
      return { ok: true, id: 'msg_123' };
    },
  };
  setEmailTransportForTests(transport);

  const result = await sendEmail({ ...baseInput, idempotencyKey: 'accepted-1' });
  assert.equal(result.status, 'accepted');
  assert.equal(result.providerMessageId, 'msg_123');
  assert.deepEqual(calls, ['ada@example.com']);

  const duplicate = await sendEmail({ ...baseInput, idempotencyKey: 'accepted-1' });
  assert.equal(duplicate.status, 'skipped');
  assert.equal(duplicate.reason, 'duplicate');
  assert.deepEqual(calls, ['ada@example.com']);
});

test('transient provider failures are retried once and then fail closed', async () => {
  let attempts = 0;
  const transport: EmailTransport = {
    async send() {
      attempts += 1;
      if (attempts === 1) return { ok: false, statusCode: 503, message: 'unavailable re_live_secret reset_abcdef1234567890' };
      return { ok: false, statusCode: 500, message: 'still down' };
    },
  };
  setEmailTransportForTests(transport);

  const errors: string[] = [];
  const original = console.error;
  console.error = (message?: unknown) => {
    errors.push(String(message));
  };

  try {
    const result = await sendEmail({ ...baseInput, idempotencyKey: 'retry-1' });
    assert.equal(result.status, 'failed');
    assert.equal(result.reason, 'provider_error');
    assert.equal(result.attempts, 2);
    assert.equal(attempts, 2);
    const logged = errors.join('\n');
    assert.equal(logged.includes('re_live_secret'), false);
    assert.equal(logged.includes('reset_abcdef1234567890'), false);
    assert.match(logged, /\[redacted\]/);
  } finally {
    console.error = original;
  }
});

test('authentication and domain failures are not retried', async () => {
  assert.deepEqual(classifyProviderFailure(401, 'invalid_api_key', 'API key is invalid'), {
    reason: 'authentication_error',
    retry: false,
  });
  assert.equal(classifyProviderFailure(403, 'restricted_api_key', 'This key cannot send').reason, 'permission_error');
  assert.equal(
    classifyProviderFailure(403, 'validation_error', 'The beyondfinancials.ng domain is not verified').reason,
    'domain_unverified'
  );
  assert.equal(classifyProviderFailure(429, 'rate_limit_exceeded', 'Too many requests').retry, true);
  assert.equal(classifyProviderFailure(0, undefined, 'socket hang up').reason, 'network_error');

  let attempts = 0;
  setEmailTransportForTests({
    async send() {
      attempts += 1;
      return { ok: false, statusCode: 401, name: 'invalid_api_key', message: 'API key is invalid re_live_secret' };
    },
  });

  const errors: string[] = [];
  const original = console.error;
  console.error = (message?: unknown) => {
    errors.push(String(message));
  };
  try {
    const result = await sendEmail({ ...baseInput, idempotencyKey: 'auth-fail' });
    assert.equal(result.status, 'failed');
    assert.equal(result.reason, 'authentication_error');
    assert.equal(result.attempts, 1);
    assert.equal(attempts, 1);
    assert.equal(errors.join('\n').includes('re_live_secret'), false);
  } finally {
    console.error = original;
  }
});

test('invalid recipients are not sent', async () => {
  let called = false;
  setEmailTransportForTests({
    async send() {
      called = true;
      return { ok: true, id: 'nope' };
    },
  });

  const result = await sendEmail({
    ...baseInput,
    to: 'not-an-email',
    idempotencyKey: 'bad-recipient',
  });
  assert.equal(result.status, 'failed');
  assert.equal(result.reason, 'invalid_recipient');
  assert.equal(called, false);
  assert.equal(getEmailDeliveryLog().some((entry) => entry.recipient.includes('not-an-email')), false);
});

test('delivery logs mask the recipient and omit message bodies', async () => {
  setEmailTransportForTests({
    async send() {
      return { ok: true, id: 'msg_log' };
    },
  });

  const lines: string[] = [];
  const original = console.info;
  console.info = (message?: unknown) => {
    lines.push(String(message));
  };

  try {
    await sendEmail({
      ...baseInput,
      html: '<p>secret-body-marker</p>',
      text: 'secret-body-marker',
      idempotencyKey: 'log-1',
    });
  } finally {
    console.info = original;
  }

  const logged = lines.join('\n');
  assert.match(logged, /a\*\*\*@example\.com/);
  assert.equal(logged.includes('secret-body-marker'), false);
  assert.equal(logged.includes('ada@example.com'), false);
});
