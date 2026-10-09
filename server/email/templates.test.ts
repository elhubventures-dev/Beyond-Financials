import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { getEmailLogoUrl, safeAppUrl } from './config';
import {
  renderContactAcknowledgement,
  renderEmailVerification,
  renderInternalContactNotification,
  renderInternalLeadNotification,
  renderPasswordChanged,
  renderPasswordReset,
  renderWaitlistConfirmation,
} from './templates';

const templates = [
  () => renderWaitlistConfirmation({
    firstName: 'Ada',
    interests: ['BANKING', 'SAVINGS'],
    referenceId: 'LEAD-1',
    unsubscribeUrl: 'https://beyondfinancials.ng/unsubscribe?token=unsub_abc',
  }),
  () => renderContactAcknowledgement({
    firstName: 'Ada',
    referenceId: 'BF-CNT-1',
    category: 'general',
  }),
  () => renderInternalContactNotification({
    referenceId: 'BF-CNT-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    category: 'general',
    message: 'Hello team',
  }),
  () => renderInternalLeadNotification({
    referenceId: 'LEAD-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    interest: 'BANKING',
    segment: 'individual',
  }),
  () => renderEmailVerification({
    firstName: 'Ada',
    verifyUrl: 'https://beyondfinancials.ng/verify-email?token=verify_abc',
  }),
  () => renderPasswordReset({
    firstName: 'Ada',
    resetUrl: 'https://beyondfinancials.ng/reset-password?token=reset_abc',
  }),
  () => renderPasswordChanged({
    firstName: 'Ada',
    changedAt: '2026-10-09T00:00:00.000Z',
  }),
];

const originalLogo = process.env.EMAIL_LOGO_URL;
const originalBase = process.env.APP_BASE_URL;

beforeEach(() => {
  delete process.env.EMAIL_LOGO_URL;
  process.env.APP_BASE_URL = 'https://beyondfinancials.ng';
});

afterEach(() => {
  if (originalLogo === undefined) delete process.env.EMAIL_LOGO_URL;
  else process.env.EMAIL_LOGO_URL = originalLogo;
  if (originalBase === undefined) delete process.env.APP_BASE_URL;
  else process.env.APP_BASE_URL = originalBase;
});

test('every template renders html, plain text, brand colors, and a recognizable sender name', () => {
  for (const render of templates) {
    const email = render();
    assert.ok(email.subject.length > 0);
    assert.match(email.html, /Beyond Financials/i);
    assert.match(email.html, /#001B40/i);
    assert.match(email.html, /#0046AD/);
    assert.match(email.html, /#FBBF24/);
    assert.match(email.text, /Beyond Financials/i);
    assert.doesNotMatch(email.html, /<script/i);
    assert.equal(email.html.includes('javascript:'), false);
  }
});

test('waitlist confirmation includes the interest, reference, website CTA, and unsubscribe link', () => {
  const email = renderWaitlistConfirmation({
    firstName: 'Ada',
    interests: ['BANKING'],
    referenceId: 'LEAD-42',
    unsubscribeUrl: 'https://beyondfinancials.ng/unsubscribe?token=unsub_abc',
  });

  assert.match(email.html, /Digital banking/);
  assert.match(email.html, /LEAD-42/);
  assert.match(email.html, /https:\/\/beyondfinancials\.ng\/services/);
  assert.match(email.html, /unsubscribe\?token=unsub_abc/);
  assert.match(email.text, /Digital banking/);
  assert.match(email.text, /Unsubscribe from waitlist updates/);
  assert.doesNotMatch(email.subject, /Ada/);
});

test('user-supplied html is escaped in customer and internal templates', () => {
  const hostile = '<script>alert(1)</script>';
  const waitlist = renderWaitlistConfirmation({
    firstName: hostile,
    interests: ['OTHER'],
    referenceId: 'LEAD-X',
    unsubscribeUrl: null,
  });
  assert.equal(waitlist.html.includes('<script>'), false);
  assert.match(waitlist.html, /&lt;script&gt;/);

  const internal = renderInternalContactNotification({
    referenceId: 'BF-1',
    firstName: hostile,
    lastName: 'User',
    email: 'ada@example.com',
    category: 'general',
    subject: hostile,
    message: hostile,
  });
  assert.equal(internal.html.includes('<script>'), false);
  assert.match(internal.html, /&lt;script&gt;/);
});

test('logo url is used only when it is public https', () => {
  process.env.EMAIL_LOGO_URL = 'https://cdn.example.com/logo.png';
  assert.equal(getEmailLogoUrl(), 'https://cdn.example.com/logo.png');
  const email = renderPasswordReset({
    firstName: 'Ada',
    resetUrl: 'https://beyondfinancials.ng/reset-password?token=reset_abc',
  });
  assert.match(email.html, /src="https:\/\/cdn\.example\.com\/logo\.png"/);

  process.env.EMAIL_LOGO_URL = '/logo.png';
  assert.equal(getEmailLogoUrl(), null);

  delete process.env.EMAIL_LOGO_URL;
  process.env.APP_BASE_URL = 'http://127.0.0.1:3000';
  assert.equal(getEmailLogoUrl(), null);
});

test('app links stay on the configured origin', () => {
  process.env.APP_BASE_URL = 'https://beyondfinancials.ng';
  assert.equal(safeAppUrl('/reset-password?token=abc'), 'https://beyondfinancials.ng/reset-password?token=abc');
  assert.equal(safeAppUrl('//evil.example/phish'), null);
  assert.equal(safeAppUrl('https://evil.example'), null);
});
