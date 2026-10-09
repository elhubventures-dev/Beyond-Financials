import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, test } from 'node:test';
import type { AddressInfo } from 'node:net';
import { resetAuthRateLimitsForTests } from '../middleware/authRateLimit';
import { createApp } from '../app';
import { leadStore } from '../services/leadStore';
import {
  EmailTransport,
  EmailTransportPayload,
  resetEmailStateForTests,
  setEmailTransportForTests,
} from '../services/emailService';

process.env.NODE_ENV = 'test';
process.env.APP_BASE_URL = 'http://127.0.0.1:3000';
process.env.ADMIN_API_KEY = 'forms-test-admin-key';
process.env.EMAIL_CONTACT_INBOX = 'ops-test@example.com';
process.env.EMAIL_LEADS_INBOX = 'leads-test@example.com';
delete process.env.RESEND_API_KEY;
delete process.env.EMAIL_FROM;

const sent: EmailTransportPayload[] = [];
let failNext = false;

const transport: EmailTransport = {
  async send(payload) {
    if (failNext) {
      failNext = false;
      return { ok: false, statusCode: 422, message: 'provider down' };
    }
    sent.push(payload);
    return { ok: true, id: `mock_${sent.length}` };
  },
};

let server: http.Server;
let baseUrl = '';

async function request(path: string, init: { method?: string; body?: unknown; headers?: Record<string, string> } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: init.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await response.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: response.status, json };
}

function messagesFor(idempotencyPrefix: string) {
  return sent.filter((message) => message.idempotencyKey.startsWith(idempotencyPrefix));
}

describe('website form and email workflows', { concurrency: 1 }, () => {
before(async () => {
  resetEmailStateForTests();
  setEmailTransportForTests(transport);
  const app = createApp();
  server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  resetEmailStateForTests();
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
});

test('invalid waitlist input does not send email', async () => {
  const beforeCount = sent.length;
  const response = await request('/api/waitlist', {
    method: 'POST',
    body: { firstName: 'A', email: 'not-an-email', consent: false },
  });
  assert.equal(response.status, 422);
  assert.equal(response.json.success, false);
  assert.equal(sent.length, beforeCount);
});

test('a saved waitlist registration sends one confirmation and one internal notice', async () => {
  const email = `waitlist.${Date.now()}@example.com`;
  const response = await request('/api/waitlist', {
    method: 'POST',
    body: {
      firstName: '<script>alert(1)</script>',
      lastName: 'Okoro',
      email,
      phoneNumber: '08031234567',
      primaryInterest: 'digital_banking',
      customerSegment: 'individual',
      consentAccepted: true,
      source: 'HOMEPAGE',
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.json.success, true);
  assert.equal(response.json.data.emailConfirmation, 'accepted');
  assert.equal(response.json.data.alreadyRegistered, false);

  const confirmation = sent.find((message) => message.to === email);
  assert.ok(confirmation);
  assert.match(confirmation.subject, /waitlist/i);
  assert.equal(confirmation.html.includes('<script>'), false);
  assert.match(confirmation.html, /&lt;script&gt;/);
  assert.match(confirmation.text, /Beyond Financials/);
  assert.match(confirmation.html, /#0046AD/);
  assert.match(confirmation.html, /unsubscribe\?token=/);

  const internal = sent.find((message) => message.to === 'leads-test@example.com' && message.idempotencyKey.startsWith('lead-internal:'));
  assert.ok(internal);
  assert.equal(internal.html.includes('<script>'), false);

  const duplicate = await request('/api/waitlist', {
    method: 'POST',
    body: {
      firstName: 'Ada',
      lastName: 'Okoro',
      email,
      primaryInterest: 'smart_savings',
      customerSegment: 'individual',
      consentAccepted: true,
    },
  });
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.json.data.emailConfirmation, 'skipped');
  assert.equal(sent.filter((message) => message.to === email).length, 1);
});

test('a failed confirmation email still keeps the waitlist registration', async () => {
  failNext = true;
  const email = `outage.${Date.now()}@example.com`;
  const response = await request('/api/waitlist', {
    method: 'POST',
    body: {
      firstName: 'Ngozi',
      lastName: 'Adeyemi',
      email,
      primaryInterest: 'bill_payments',
      customerSegment: 'individual',
      consentAccepted: true,
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.json.data.emailConfirmation, 'failed');
  assert.equal(sent.some((message) => message.to === email), false);
});

test('email is not sent when the lead store fails', async () => {
  const beforeCount = sent.length;
  const original = leadStore.createOrUpdateLead.bind(leadStore);
  leadStore.createOrUpdateLead = () => {
    throw new Error('store unavailable');
  };

  try {
    const response = await request('/api/waitlist', {
      method: 'POST',
      body: {
        firstName: 'Store',
        lastName: 'Failure',
        email: `store.${Date.now()}@example.com`,
        primaryInterest: 'digital_banking',
        customerSegment: 'individual',
        consentAccepted: true,
      },
    });
    assert.equal(response.status, 500);
    assert.equal(sent.length, beforeCount);
  } finally {
    leadStore.createOrUpdateLead = original;
  }
});

test('invalid contact input does not send email', async () => {
  const beforeCount = sent.length;
  const response = await request('/api/contact', {
    method: 'POST',
    body: { firstName: 'A', email: 'bad', message: 'short', consentAccepted: false },
  });
  assert.equal(response.status, 422);
  assert.equal(sent.length, beforeCount);
});

test('a saved contact enquiry sends an acknowledgement and an internal notice', async () => {
  const email = `contact.${Date.now()}@example.com`;
  const response = await request('/api/contact', {
    method: 'POST',
    body: {
      firstName: 'Chidi',
      lastName: 'Nwosu',
      email,
      phoneNumber: '08032345678',
      category: 'partnership',
      subject: 'Hello',
      message: 'Please tell me when the website services open. <b>bold</b>',
      consentAccepted: true,
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.json.data.emailConfirmation, 'accepted');
  assert.ok(response.json.data.referenceId);

  const acknowledgement = sent.find((message) => message.to === email);
  assert.ok(acknowledgement);
  assert.match(acknowledgement.html, /We received your message/);
  assert.match(acknowledgement.text, /hello@beyondfinancials.ng/);

  const internal = messagesFor('contact-internal:').at(-1);
  assert.ok(internal);
  assert.equal(internal.to, 'ops-test@example.com');
  assert.equal(internal.html.includes('<b>bold</b>'), false);
  assert.match(internal.html, /&lt;b&gt;bold&lt;\/b&gt;/);
});

test('contact acknowledgement is unavailable when email delivery is not configured, and the enquiry remains saved', async () => {
  setEmailTransportForTests(null);
  try {
    const response = await request('/api/contact', {
      method: 'POST',
      body: {
        firstName: 'Amina',
        lastName: 'Bello',
        email: `noconfig.${Date.now()}@example.com`,
        category: 'general',
        message: 'This message should still be stored.',
        consentAccepted: true,
      },
    });
    assert.equal(response.status, 201);
    assert.equal(response.json.data.emailConfirmation, 'unavailable');
    assert.notEqual(response.json.message.toLowerCase().includes('email sent'), true);
  } finally {
    setEmailTransportForTests(transport);
  }
});

test('registration sends a verification email and does not mark the address verified', async () => {
  const email = `register.${Date.now()}@example.com`;
  const response = await request('/api/auth/register', {
    method: 'POST',
    body: {
      firstName: 'Tunde',
      lastName: 'Bakare',
      email,
      phone: '+2348031112233',
      password: 'BeyondPass2026!',
      confirmPassword: 'BeyondPass2026!',
      termsAccepted: true,
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.json.data.user.emailVerified, false);
  assert.equal(response.json.data.emailVerification, 'accepted');
  assert.ok(response.json.data.devVerificationToken);
  assert.equal(JSON.stringify(response.json).includes(response.json.data.user.passwordHash || 'scrypt:'), false);

  const verification = sent.find((message) => message.to === email && message.idempotencyKey.startsWith('email-verify:'));
  assert.ok(verification);
  assert.match(verification.html, /Verify email address/);
  assert.equal(verification.html.includes(response.json.data.devVerificationToken), true);

  const verify = await request('/api/auth/verify-email', {
    method: 'POST',
    body: { token: response.json.data.devVerificationToken },
  });
  assert.equal(verify.status, 200);

  const session = await request('/api/auth/session', {
    headers: { Authorization: `Bearer ${response.json.data.session.sessionId}` },
  });
  assert.equal(session.json.data.user.emailVerified, true);

  const reuse = await request('/api/auth/verify-email', {
    method: 'POST',
    body: { token: response.json.data.devVerificationToken },
  });
  assert.equal(reuse.status, 400);
});

test('forgot-password responses do not reveal whether the account exists, and reset tokens stay out of logs', async () => {
  const logs: string[] = [];
  const originals = {
    info: console.info,
    error: console.error,
    log: console.log,
    warn: console.warn,
  };
  console.info = (message?: unknown) => logs.push(String(message));
  console.error = (message?: unknown) => logs.push(String(message));
  console.log = (message?: unknown) => logs.push(String(message));
  console.warn = (message?: unknown) => logs.push(String(message));

  try {
    const unknownEmail = `missing.${Date.now()}@example.com`;
    const unknown = await request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: unknownEmail },
    });
    const knownEmail = `reset.${Date.now()}@example.com`;
    await request('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: 'Reset',
        lastName: 'User',
        email: knownEmail,
        phone: '+2348032223344',
        password: 'BeyondPass2026!',
        confirmPassword: 'BeyondPass2026!',
        termsAccepted: true,
      },
    });
    const known = await request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: knownEmail },
    });

    assert.equal(unknown.status, 200);
    assert.equal(known.status, 200);
    assert.equal(unknown.json.message, known.json.message);
    assert.equal(unknown.json.data?.devResetToken, undefined);
    assert.ok(known.json.data.devResetToken);
    assert.equal(logs.join('\n').includes(known.json.data.devResetToken), false);
    assert.equal(sent.some((message) => message.to === unknownEmail), false);

    const resetMail = sent.find((message) => message.to === knownEmail && message.idempotencyKey.startsWith('password-reset:'));
    assert.ok(resetMail);
    assert.equal(logs.join('\n').includes(known.json.data.devResetToken), false);

    const reset = await request('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: known.json.data.devResetToken,
        newPassword: 'BeyondPass2027!',
        confirmPassword: 'BeyondPass2027!',
      },
    });
    assert.equal(reset.status, 200);
    assert.equal(JSON.stringify(reset.json).includes('BeyondPass2027!'), false);

    const reused = await request('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: known.json.data.devResetToken,
        newPassword: 'BeyondPass2028!',
        confirmPassword: 'BeyondPass2028!',
      },
    });
    assert.equal(reused.status, 400);

    const notice = sent.find((message) => message.to === knownEmail && message.idempotencyKey.startsWith('password-changed:'));
    assert.ok(notice);
    assert.equal(notice.html.includes('BeyondPass'), false);
  } finally {
    console.info = originals.info;
    console.error = originals.error;
    console.log = originals.log;
    console.warn = originals.warn;
  }
});

test('login failure, profile update, and password-change failure do not send mail for the failed action', async () => {
  const beforeCount = sent.length;
  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'customer@beyondfinancials.ng', password: 'wrong-password' },
  });
  assert.equal(login.status, 401);
  assert.equal(sent.length, beforeCount);

  const email = `profile.${Date.now()}@example.com`;
  const registered = await request('/api/auth/register', {
    method: 'POST',
    body: {
      firstName: 'Profile',
      lastName: 'User',
      email,
      phone: '+2348033334455',
      password: 'BeyondPass2026!',
      confirmPassword: 'BeyondPass2026!',
      termsAccepted: true,
    },
  });
  const token = registered.json.data.session.sessionId;
  const afterRegister = sent.length;

  const profile = await request('/api/auth/profile', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: { firstName: 'Updated', phone: '+2348033334456' },
  });
  assert.equal(profile.status, 200);
  assert.equal(sent.length, afterRegister);

  const badChange = await request('/api/auth/change-password', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      currentPassword: 'not-the-password',
      newPassword: 'BeyondPass2027!',
      confirmPassword: 'BeyondPass2027!',
    },
  });
  assert.equal(badChange.status, 400);
  assert.equal(sent.length, afterRegister);

  const changed = await request('/api/auth/change-password', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: {
      currentPassword: 'BeyondPass2026!',
      newPassword: 'BeyondPass2027!',
      confirmPassword: 'BeyondPass2027!',
    },
  });
  assert.equal(changed.status, 200);
  assert.equal(changed.json.data.securityNotice, 'accepted');
  assert.ok(sent.some((message) => message.to === email && message.subject.includes('password was changed')));
});

test('production responses do not include reset or verification tokens', async () => {
  const previous = process.env.NODE_ENV;
  const previousBase = process.env.APP_BASE_URL;
  resetAuthRateLimitsForTests();
  process.env.NODE_ENV = 'production';
  process.env.APP_BASE_URL = 'https://beyondfinancials.ng';
  delete process.env.RESEND_API_KEY;
  try {
    const email = `prod.${Date.now()}@example.com`;
    const registered = await request('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: 'Prod',
        lastName: 'User',
        email,
        phone: '+2348034445566',
        password: 'BeyondPass2026!',
        confirmPassword: 'BeyondPass2026!',
        termsAccepted: true,
      },
    });
    assert.equal(registered.status, 201);
    assert.equal(registered.json.data.devVerificationToken, undefined);
    assert.equal(registered.json.data.user.emailVerified, false);
    assert.equal(registered.json.data.emailVerification, 'unavailable');

    const reset = await request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
    assert.equal(reset.status, 200);
    assert.equal(reset.json.data?.devResetToken, undefined);
  } finally {
    process.env.NODE_ENV = previous;
    if (previousBase === undefined) delete process.env.APP_BASE_URL;
    else process.env.APP_BASE_URL = previousBase;
    setEmailTransportForTests(transport);
  }
});

test('a public HTTPS origin does not disclose development tokens', async () => {
  const previousEnv = process.env.NODE_ENV;
  const previousBase = process.env.APP_BASE_URL;
  resetAuthRateLimitsForTests();
  process.env.NODE_ENV = 'development';
  process.env.APP_BASE_URL = 'https://beyondfinancials.ng';
  delete process.env.EMAIL_DELIVERY_MODE;
  try {
    const email = `public-origin.${Date.now()}@example.com`;
    const registered = await request('/api/auth/register', {
      method: 'POST',
      body: {
        firstName: 'Public',
        lastName: 'Origin',
        email,
        phone: '+2348037778899',
        password: 'BeyondPass2026!',
        confirmPassword: 'BeyondPass2026!',
        termsAccepted: true,
      },
    });
    assert.equal(registered.status, 201);
    assert.equal(registered.json.data.devVerificationToken, undefined);
    assert.equal(JSON.stringify(registered.json).includes('devVerificationToken'), false);

    const reset = await request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
    assert.equal(reset.status, 200);
    assert.equal(reset.json.data?.devResetToken, undefined);
    assert.equal(JSON.stringify(reset.json).includes('devResetToken'), false);
  } finally {
    process.env.NODE_ENV = previousEnv;
    if (previousBase === undefined) delete process.env.APP_BASE_URL;
    else process.env.APP_BASE_URL = previousBase;
    setEmailTransportForTests(transport);
  }
});

test('admin lead routes stay protected and notes do not send email', async () => {
  const beforeCount = sent.length;
  const denied = await request('/api/admin/leads');
  assert.equal(denied.status, 401);

  const created = await request('/api/waitlist', {
    method: 'POST',
    body: {
      firstName: 'Admin',
      lastName: 'Lead',
      email: `adminlead.${Date.now()}@example.com`,
      primaryInterest: 'digital_banking',
      customerSegment: 'individual',
      consentAccepted: true,
    },
  });
  const leadId = created.json.data.referenceId;
  const afterCreate = sent.length;

  const unauthNotes = await request(`/api/admin/leads/${leadId}/notes`, {
    method: 'PATCH',
    body: { notes: 'private note' },
  });
  assert.equal(unauthNotes.status, 401);

  const notes = await request(`/api/admin/leads/${leadId}/notes`, {
    method: 'PATCH',
    headers: { 'x-admin-key': process.env.ADMIN_API_KEY || '' },
    body: { notes: 'Reviewed internally' },
  });
  assert.equal(notes.status, 200);
  assert.equal(sent.length, afterCreate);

  const status = await request(`/api/admin/leads/${leadId}/status`, {
    method: 'PATCH',
    headers: { 'x-admin-key': process.env.ADMIN_API_KEY || '' },
    body: { status: 'CONTACTED', note: 'Called back' },
  });
  assert.equal(status.status, 200);
  assert.equal(sent.length, afterCreate);
  assert.ok(beforeCount >= 0);
});

test('admin credentials fail closed when missing and succeed only for the configured key', async () => {
  const configured = process.env.ADMIN_API_KEY;
  const knownFallback = 'bf_admin_dev_key_2026';
  delete process.env.ADMIN_API_KEY;
  try {
    const missing = await request('/api/admin/leads');
    assert.equal(missing.status, 503);
    assert.equal(missing.json.error.code, 'ADMIN_UNCONFIGURED');
    assert.equal(JSON.stringify(missing.json).includes(knownFallback), false);

    const verifyMissing = await request('/api/admin/auth/verify', {
      method: 'POST',
      headers: { 'x-admin-key': knownFallback },
      body: { adminKey: knownFallback },
    });
    assert.equal(verifyMissing.status, 503);
    assert.equal(JSON.stringify(verifyMissing.json).includes(knownFallback), false);

    process.env.ADMIN_API_KEY = configured || 'forms-test-admin-key';
    const incorrect = await request('/api/admin/leads', {
      headers: { 'x-admin-key': 'wrong-admin-key' },
    });
    assert.equal(incorrect.status, 401);
    assert.equal(JSON.stringify(incorrect.json).includes(process.env.ADMIN_API_KEY), false);

    const correct = await request('/api/admin/auth/verify', {
      method: 'POST',
      headers: { 'x-admin-key': process.env.ADMIN_API_KEY },
      body: {},
    });
    assert.equal(correct.status, 200);
    assert.equal(correct.json.data.authenticated, true);
    assert.equal(JSON.stringify(correct.json).includes(process.env.ADMIN_API_KEY), false);
  } finally {
    if (configured === undefined) delete process.env.ADMIN_API_KEY;
    else process.env.ADMIN_API_KEY = configured;
  }
});

test('unsubscribe link from a waitlist email updates the lead and does not require a second email', async () => {
  const email = `unsub.${Date.now()}@example.com`;
  const created = await request('/api/waitlist', {
    method: 'POST',
    body: {
      firstName: 'Unsubscribe',
      lastName: 'Tester',
      email,
      primaryInterest: 'smart_savings',
      customerSegment: 'individual',
      consentAccepted: true,
    },
  });
  const confirmation = sent.find((message) => message.to === email);
  assert.ok(confirmation);
  const match = confirmation.html.match(/unsubscribe\?token=([^"&]+)/);
  assert.ok(match);
  const token = decodeURIComponent(match[1]);
  const before = sent.length;

  const guessed = await request('/api/waitlist/unsubscribe', {
    method: 'POST',
    body: { token: created.json.data.referenceId },
  });
  assert.equal(guessed.status, 400);
  assert.equal(leadStore.getLeadById(created.json.data.referenceId)?.status, 'NEW');

  const response = await request('/api/waitlist/unsubscribe', {
    method: 'POST',
    body: { token },
  });
  assert.equal(response.status, 200);
  assert.equal(sent.length, before);

  const lead = leadStore.getLeadById(created.json.data.referenceId);
  assert.equal(lead?.status, 'UNSUBSCRIBED');

  const invalid = await request('/api/waitlist/unsubscribe', {
    method: 'POST',
    body: { token: 'unsub_not_real' },
  });
  assert.equal(invalid.status, 400);
});

test('session revocation only affects the signed-in user and does not send email', async () => {
  const before = sent.length;
  const first = await request('/api/auth/register', {
    method: 'POST',
    body: {
      firstName: 'Session',
      lastName: 'Owner',
      email: `session.owner.${Date.now()}@example.com`,
      phone: '+2348035556677',
      password: 'BeyondPass2026!',
      confirmPassword: 'BeyondPass2026!',
      termsAccepted: true,
    },
  });
  const second = await request('/api/auth/register', {
    method: 'POST',
    body: {
      firstName: 'Session',
      lastName: 'Other',
      email: `session.other.${Date.now()}@example.com`,
      phone: '+2348035556678',
      password: 'BeyondPass2026!',
      confirmPassword: 'BeyondPass2026!',
      termsAccepted: true,
    },
  });
  const ownerToken = first.json.data.session.sessionId;
  const otherToken = second.json.data.session.sessionId;
  const afterRegister = sent.length;

  const foreign = await request(`/api/auth/sessions/${ownerToken}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${otherToken}` },
  });
  assert.equal(foreign.status, 404);

  const stillValid = await request('/api/auth/session', {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  assert.equal(stillValid.status, 200);

  const own = await request(`/api/auth/sessions/${ownerToken}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  assert.equal(own.status, 200);
  assert.equal(sent.length, afterRegister);

  const gone = await request('/api/auth/session', {
    headers: { Authorization: `Bearer ${ownerToken}` },
  });
  assert.equal(gone.status, 401);
  assert.ok(before >= 0);
});

});
