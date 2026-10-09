/**
 * Transactional templates for flows that exist in this repository.
 * Copy stays factual: no launch date, returns, or guaranteed follow-up.
 */

import { getEmailLogoUrl, safeAppUrl } from './config';
import { escapeHtml, escapeText, renderEmailDocument } from './html';

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

export const INTEREST_LABELS: Record<string, string> = {
  BANKING: 'Digital banking',
  SAVINGS: 'Savings',
  LOANS: 'Loans',
  PAYMENTS: 'Payments',
  INVESTMENTS: 'Investments',
  CRYPTO: 'Digital assets',
  MERCHANTS: 'Merchant services',
  AGENTS: 'Agency services',
  OTHER: 'General interest',
};

export const CONTACT_CATEGORY_LABELS: Record<string, string> = {
  general: 'General information',
  partnership: 'Partnerships',
  banking: 'Digital banking',
  savings: 'Savings',
  loans: 'Loans',
  payments: 'Payments',
  investments: 'Investments',
  crypto: 'Digital assets',
  merchants: 'Merchant services',
  agents: 'Agency services',
  support: 'Waitlist support',
  other: 'Other',
};

function interestLabel(code: string): string {
  return INTEREST_LABELS[code] || 'General interest';
}

function categoryLabel(code: string): string {
  return CONTACT_CATEGORY_LABELS[code] || 'General information';
}

function configuredPage(path: string): string | null {
  return safeAppUrl(path);
}

function render(input: Parameters<typeof renderEmailDocument>[0]): { html: string; text: string } {
  const footerLinks = [
    ['Privacy', '/privacy'],
    ['Terms', '/terms'],
    ['Contact', '/contact'],
  ].flatMap(([label, path]) => {
    const href = configuredPage(path);
    return href ? [{ label, href }] : [];
  });

  return renderEmailDocument({
    ...input,
    siteUrl: input.siteUrl === undefined ? configuredPage('/') : input.siteUrl,
    footerLinks: input.footerLinks === undefined ? footerLinks : input.footerLinks,
    logoUrl: input.logoUrl === undefined ? getEmailLogoUrl() : input.logoUrl,
  });
}

export function renderWaitlistConfirmation(input: {
  firstName: string;
  interests: string[];
  referenceId: string;
  unsubscribeUrl: string | null;
}): RenderedEmail {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const interests = input.interests.map(interestLabel);
  const interestLine = interests.length > 0 ? interests.join(', ') : 'General interest';
  const servicesUrl = configuredPage('/services');
  const homeUrl = configuredPage('/');
  const document = render({
    preheader: 'Your Beyond Financials waitlist registration is saved.',
    heading: 'You are on the waitlist',
    paragraphs: [
      `Hello ${name},`,
      'Thank you for registering your interest with Beyond Financials. Your waitlist registration has been saved.',
      'We will email this address when there is news about opening. A place on the waitlist does not open an account, approve a loan, or reserve a product. Services described on the website are not available yet.',
    ],
    panel: {
      title: 'Your registration',
      lines: [
        `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
        `<strong>Interests:</strong> ${escapeHtml(interestLine)}`,
      ],
    },
    ...(homeUrl ? { cta: { label: 'Visit Beyond Financials', href: homeUrl } } : {}),
    ...(servicesUrl ? { secondaryLink: { label: 'Explore planned services', href: servicesUrl } } : {}),
    footerNote: 'This message confirms a waitlist registration you submitted.',
    unsubscribeUrl: input.unsubscribeUrl || undefined,
  });

  return {
    subject: 'You are on the Beyond Financials waitlist',
    ...document,
  };
}

export function renderContactAcknowledgement(input: {
  firstName: string;
  referenceId: string;
  category: string;
}): RenderedEmail {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const contactUrl = configuredPage('/contact');
  const document = render({
    preheader: `We received your message. Reference ${input.referenceId}.`,
    heading: 'We received your message',
    paragraphs: [
      `Hello ${name},`,
      'Your enquiry has been received and stored. A member of the Beyond Financials team can review it from the details you submitted.',
      'If you need to add something, reply to this email or write to us again and include your reference number.',
    ],
    panel: {
      title: 'Enquiry reference',
      lines: [
        `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
        `<strong>Topic:</strong> ${escapeHtml(categoryLabel(input.category))}`,
      ],
    },
    ...(contactUrl ? { cta: { label: 'Contact Beyond Financials', href: contactUrl } } : {}),
    footerNote: 'This message confirms an enquiry you submitted. It is not a marketing email.',
  });

  return {
    subject: 'We received your Beyond Financials message',
    ...document,
  };
}

export function renderInternalContactNotification(input: {
  referenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  category: string;
  subject?: string;
  message: string;
}): RenderedEmail {
  const lines = [
    `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
    `<strong>Name:</strong> ${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}`,
    `<strong>Email:</strong> ${escapeHtml(input.email)}`,
    `<strong>Phone:</strong> ${escapeHtml(input.phoneNumber || 'Not provided')}`,
    `<strong>Topic:</strong> ${escapeHtml(categoryLabel(input.category))}`,
    `<strong>Subject:</strong> ${escapeHtml(input.subject || 'Not provided')}`,
  ];

  const document = render({
    preheader: `New contact enquiry ${input.referenceId}.`,
    heading: 'New contact enquiry',
    paragraphs: [
      'A contact form submission was accepted and stored. Review the details below. Do not request BVN, NIN, card numbers, passwords, or recovery phrases.',
    ],
    panel: {
      title: 'Submission',
      lines: [
        ...lines,
        `<strong>Message:</strong><br />${escapeHtml(input.message).replace(/\n/g, '<br />')}`,
      ],
    },
    footerNote: 'Internal notification for the configured contact inbox.',
  });

  return {
    subject: `New contact enquiry ${input.referenceId}`,
    ...document,
  };
}

export function renderInternalLeadNotification(input: {
  referenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  segment: string;
}): RenderedEmail {
  const document = render({
    preheader: `New waitlist registration ${input.referenceId}.`,
    heading: 'New waitlist registration',
    paragraphs: [
      'A new waitlist registration was saved. This notice is not sent again when the same email submits a duplicate.',
    ],
    panel: {
      title: 'Registration',
      lines: [
        `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
        `<strong>Name:</strong> ${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}`,
        `<strong>Email:</strong> ${escapeHtml(input.email)}`,
        `<strong>Interest:</strong> ${escapeHtml(interestLabel(input.interest))}`,
        `<strong>Segment:</strong> ${escapeHtml(input.segment)}`,
      ],
    },
    footerNote: 'Internal notification for the configured leads inbox.',
  });

  return {
    subject: `New waitlist registration ${input.referenceId}`,
    ...document,
  };
}

export function renderEmailVerification(input: { firstName: string; verifyUrl: string }): RenderedEmail {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const document = render({
    preheader: 'Confirm the email address on your Beyond Financials account.',
    heading: 'Verify your email address',
    paragraphs: [
      `Hello ${name},`,
      'Use the button below to confirm this email address for your Beyond Financials account. The link expires in 24 hours and can be used once.',
      'You can still sign in before verification. Verifying this address does not open a financial account.',
      'If you did not create an account, you can ignore this email.',
    ],
    cta: { label: 'Verify email address', href: input.verifyUrl },
    secondaryLink: { label: 'Or copy this verification link', href: input.verifyUrl },
    footerNote: 'This message was sent because an account was registered with this email address.',
  });

  return {
    subject: 'Verify your Beyond Financials email address',
    ...document,
  };
}

export function renderPasswordReset(input: { firstName: string; resetUrl: string }): RenderedEmail {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const document = render({
    preheader: 'A password reset was requested for your Beyond Financials account.',
    heading: 'Reset your password',
    paragraphs: [
      `Hello ${name},`,
      'A password reset was requested for your Beyond Financials account. The link below expires in 1 hour and can be used once.',
      'If you did not request this, you can ignore this email. Your password will stay the same.',
    ],
    cta: { label: 'Reset password', href: input.resetUrl },
    secondaryLink: { label: 'Or copy this reset link', href: input.resetUrl },
    footerNote: 'Beyond Financials will never ask you to send your password by email.',
  });

  return {
    subject: 'Reset your Beyond Financials password',
    ...document,
  };
}

export function renderPasswordChanged(input: { firstName: string; changedAt: string }): RenderedEmail {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const securityUrl = configuredPage('/contact');
  const document = render({
    preheader: 'The password on your Beyond Financials account was changed.',
    heading: 'Your password was changed',
    paragraphs: [
      `Hello ${name},`,
      'The password for your Beyond Financials account was changed. Other sessions were signed out.',
      'If you made this change, no further action is needed. If you did not, contact security immediately.',
    ],
    panel: {
      title: 'Security notice',
      lines: [`<strong>When:</strong> ${escapeHtml(input.changedAt)}`],
    },
    ...(securityUrl ? { cta: { label: 'Contact security support', href: securityUrl } } : {}),
    footerNote: 'This is a security notice about your account. It does not include your password.',
  });

  return {
    subject: 'Your Beyond Financials password was changed',
    ...document,
  };
}
