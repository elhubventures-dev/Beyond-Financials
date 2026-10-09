/**
 * Connects saved website events to transactional email.
 * Callers must persist the underlying record before calling these helpers.
 * Failures are returned, not thrown, so a saved submission is not rolled back.
 */

import { safeAppUrl, getContactInbox, getLeadsInbox, isSafeEmailAddress } from '../email/config';
import {
  renderContactAcknowledgement,
  renderEmailVerification,
  renderInternalContactNotification,
  renderInternalLeadNotification,
  renderPasswordChanged,
  renderPasswordReset,
  renderWaitlistConfirmation,
} from '../email/templates';
import { CryptoService } from './cryptoService';
import { leadStore } from './leadStore';
import { EmailDeliveryResult, scrubSensitiveText, sendEmail } from './emailService';

export type PublicEmailStatus = 'accepted' | 'failed' | 'unavailable' | 'skipped';

function publicStatus(result: EmailDeliveryResult): PublicEmailStatus {
  return result.status;
}

async function safeSend(input: Parameters<typeof sendEmail>[0]): Promise<EmailDeliveryResult> {
  try {
    return await sendEmail(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'notification_error';
    console.error(`[EMAIL] notification failed template=${input.template} detail=${scrubSensitiveText(message)}`);
    return {
      status: 'failed',
      reason: 'network_error',
      attempts: 0,
      template: input.template,
    };
  }
}

export async function notifyWaitlistCreated(input: {
  leadId: string;
  firstName: string;
  lastName: string;
  email: string;
  interest: string;
  interests: string[];
  segment: string;
  correlationId?: string;
}): Promise<PublicEmailStatus> {
  if (!isSafeEmailAddress(input.email)) return 'failed';

  const unsubscribeToken = leadStore.createUnsubscribeToken(input.leadId);
  const unsubscribeUrl = unsubscribeToken ? safeAppUrl(`/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`) : null;
  const message = renderWaitlistConfirmation({
    firstName: input.firstName,
    interests: input.interests,
    referenceId: input.leadId,
    unsubscribeUrl,
  });

  const confirmation = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `waitlist-confirmation:${input.leadId}`,
    template: 'waitlist-confirmation',
    correlationId: input.correlationId,
  });

  const inbox = getLeadsInbox();
  if (isSafeEmailAddress(inbox)) {
    const internal = renderInternalLeadNotification({
      referenceId: input.leadId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      interest: input.interest,
      segment: input.segment,
    });
    await safeSend({
      to: inbox,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      idempotencyKey: `lead-internal:${input.leadId}`,
      template: 'lead-internal',
      correlationId: input.correlationId,
    });
  }

  return publicStatus(confirmation);
}

export async function notifyContactAccepted(input: {
  referenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  category: string;
  subject?: string;
  message: string;
  correlationId?: string;
}): Promise<PublicEmailStatus> {
  if (!isSafeEmailAddress(input.email)) return 'failed';

  const acknowledgement = renderContactAcknowledgement({
    firstName: input.firstName,
    referenceId: input.referenceId,
    category: input.category,
  });

  const confirmation = await safeSend({
    to: input.email,
    subject: acknowledgement.subject,
    html: acknowledgement.html,
    text: acknowledgement.text,
    idempotencyKey: `contact-ack:${input.referenceId}`,
    template: 'contact-acknowledgement',
    correlationId: input.correlationId,
  });

  const inbox = getContactInbox();
  if (isSafeEmailAddress(inbox)) {
    const internal = renderInternalContactNotification(input);
    await safeSend({
      to: inbox,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      idempotencyKey: `contact-internal:${input.referenceId}`,
      template: 'contact-internal',
      correlationId: input.correlationId,
    });
  }

  return publicStatus(confirmation);
}

export async function notifyEmailVerification(input: {
  userId: string;
  email: string;
  firstName: string;
  token: string;
  correlationId?: string;
}): Promise<PublicEmailStatus> {
  const verifyUrl = safeAppUrl(`/verify-email?token=${encodeURIComponent(input.token)}`);
  if (!verifyUrl || !isSafeEmailAddress(input.email)) return 'failed';

  const message = renderEmailVerification({ firstName: input.firstName, verifyUrl });
  const result = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `email-verify:${input.userId}:${CryptoService.hashToken(input.token).slice(0, 16)}`,
    template: 'email-verification',
    correlationId: input.correlationId,
  });
  return publicStatus(result);
}

export async function notifyPasswordReset(input: {
  userId: string;
  email: string;
  firstName: string;
  token: string;
  correlationId?: string;
}): Promise<PublicEmailStatus> {
  const resetUrl = safeAppUrl(`/reset-password?token=${encodeURIComponent(input.token)}`);
  if (!resetUrl || !isSafeEmailAddress(input.email)) return 'failed';

  const message = renderPasswordReset({ firstName: input.firstName, resetUrl });
  const result = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `password-reset:${input.userId}:${CryptoService.hashToken(input.token).slice(0, 16)}`,
    template: 'password-reset',
    correlationId: input.correlationId,
  });
  return publicStatus(result);
}

export async function notifyPasswordChanged(input: {
  userId: string;
  email: string;
  firstName: string;
  changedAt: string;
  correlationId?: string;
}): Promise<PublicEmailStatus> {
  if (!isSafeEmailAddress(input.email)) return 'failed';
  const message = renderPasswordChanged({ firstName: input.firstName, changedAt: input.changedAt });
  const result = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `password-changed:${input.userId}:${input.changedAt}`,
    template: 'password-changed',
    correlationId: input.correlationId,
  });
  return publicStatus(result);
}
