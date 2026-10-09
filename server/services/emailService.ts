/**
 * Transactional email delivery through Resend.
 * Live sends happen only when credentials exist and delivery mode allows them.
 * Tests inject a transport. This module never logs API keys, tokens, or message bodies.
 */

import { Resend } from 'resend';
import {
  getEmailFrom,
  getEmailReplyTo,
  isSafeEmailAddress,
  isSafeFromAddress,
  resolveEmailRuntime,
} from '../email/config';

export type EmailDeliveryStatus = 'accepted' | 'failed' | 'unavailable' | 'skipped';

export type EmailDeliveryReason =
  | 'unconfigured'
  | 'dev_hold'
  | 'test'
  | 'production_log_mode'
  | 'invalid_origin'
  | 'duplicate'
  | 'invalid_recipient'
  | 'invalid_sender'
  | 'provider_error'
  | 'network_error'
  | 'authentication_error'
  | 'permission_error'
  | 'domain_unverified'
  | 'rate_limited';

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  template: string;
  correlationId?: string;
}

export interface EmailDeliveryResult {
  status: EmailDeliveryStatus;
  reason?: EmailDeliveryReason;
  providerMessageId?: string;
  attempts: number;
  template: string;
}

export interface EmailTransportPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  idempotencyKey: string;
}

export interface EmailTransportResult {
  ok: boolean;
  id?: string;
  statusCode?: number;
  name?: string;
  message?: string;
}

export interface EmailTransport {
  send(payload: EmailTransportPayload): Promise<EmailTransportResult>;
}

interface DeliveryLogEntry {
  at: string;
  template: string;
  status: EmailDeliveryStatus;
  reason?: EmailDeliveryReason;
  recipient: string;
  providerMessageId?: string;
  attempts: number;
  correlationId?: string;
}

const completed = new Map<string, EmailDeliveryResult>();
const inflight = new Map<string, Promise<EmailDeliveryResult>>();
const deliveryLog: DeliveryLogEntry[] = [];
const MAX_LOG = 500;

let testTransport: EmailTransport | null = null;

const TRANSIENT_STATUS = new Set([408, 409, 425, 429, 500, 502, 503, 504]);
const RESEND_API_ORIGIN = 'https://api.resend.com';

const AUTH_ERROR_NAMES = new Set(['missing_api_key', 'invalid_api_key']);
const PERMISSION_ERROR_NAMES = new Set(['restricted_api_key', 'invalid_access']);
const RATE_LIMIT_NAMES = new Set(['rate_limit_exceeded']);
const QUOTA_NAMES = new Set(['monthly_quota_exceeded', 'daily_quota_exceeded']);

export interface ClassifiedProviderFailure {
  reason: EmailDeliveryReason;
  retry: boolean;
}

/** Classifies a provider failure without logging the response body. Authentication failures are not retried. */
export function classifyProviderFailure(statusCode: number, name?: string, message?: string): ClassifiedProviderFailure {
  const code = (name || '').trim().toLowerCase();
  const text = (message || '').toLowerCase();
  const domainUnverified = /domain/.test(text) && /verif/.test(text);

  if (AUTH_ERROR_NAMES.has(code) || statusCode === 401 || /invalid api key|missing api key|unauthorized/.test(text)) {
    return { reason: 'authentication_error', retry: false };
  }
  if (domainUnverified) {
    return { reason: 'domain_unverified', retry: false };
  }
  if (code === 'invalid_from_address') {
    return { reason: 'invalid_sender', retry: false };
  }
  if (PERMISSION_ERROR_NAMES.has(code) || statusCode === 403) {
    return { reason: 'permission_error', retry: false };
  }
  if (QUOTA_NAMES.has(code)) {
    return { reason: 'rate_limited', retry: false };
  }
  if (RATE_LIMIT_NAMES.has(code) || statusCode === 429) {
    return { reason: 'rate_limited', retry: true };
  }
  if (statusCode === 0 || TRANSIENT_STATUS.has(statusCode) || code === 'internal_server_error' || code === 'application_error') {
    return { reason: statusCode === 0 ? 'network_error' : 'provider_error', retry: true };
  }
  return { reason: 'provider_error', retry: false };
}

export function setEmailTransportForTests(transport: EmailTransport | null): void {
  if (process.env.NODE_ENV === 'production') return;
  testTransport = transport;
}

export function resetEmailStateForTests(): void {
  if (process.env.NODE_ENV === 'production') return;
  testTransport = null;
  completed.clear();
  inflight.clear();
  deliveryLog.length = 0;
}

export function getEmailDeliveryLog(): readonly DeliveryLogEntry[] {
  return deliveryLog;
}

export function maskEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf('@');
  if (at <= 0) return '[redacted]';
  return `${trimmed.slice(0, 1)}***@${trimmed.slice(at + 1)}`;
}

export function scrubSensitiveText(value: string): string {
  return value
    .replace(/re_[A-Za-z0-9_]+/g, '[redacted]')
    .replace(/\b(reset|verify|unsub)_[a-f0-9]{8,}\b/gi, '[redacted-token]')
    .replace(/([?&]token=)[^&\s]+/gi, '$1[redacted]')
    .slice(0, 300);
}

function activeTransport(): EmailTransport | null {
  if (process.env.NODE_ENV === 'production') return null;
  return testTransport;
}

function logDelivery(entry: DeliveryLogEntry): void {
  deliveryLog.unshift(entry);
  if (deliveryLog.length > MAX_LOG) deliveryLog.pop();

  const provider = entry.providerMessageId ? ` provider=${entry.providerMessageId}` : '';
  const correlation = entry.correlationId ? ` correlation=${entry.correlationId}` : '';
  const reason = entry.reason ? ` reason=${entry.reason}` : '';
  console.info(
    `[EMAIL] ${entry.status} template=${entry.template} to=${entry.recipient} attempts=${entry.attempts}${reason}${provider}${correlation}`
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function resendTransport(apiKey: string, payload: EmailTransportPayload): Promise<EmailTransportResult> {
  const resend = new Resend(apiKey);
  if (resend.baseUrl !== RESEND_API_ORIGIN) {
    return {
      ok: false,
      statusCode: 0,
      name: 'application_error',
      message: 'Unexpected email provider endpoint.',
    };
  }
  const replyTo = payload.replyTo && isSafeEmailAddress(payload.replyTo) ? payload.replyTo : undefined;
  const result = await resend.emails.send(
    {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo,
    },
    { idempotencyKey: payload.idempotencyKey }
  );

  if (result.error) {
    const error = result.error;
    return {
      ok: false,
      statusCode: error.statusCode ?? undefined,
      name: error.name,
      message: error.message || 'Email provider rejected the request.',
    };
  }

  return { ok: true, id: result.data?.id };
}

async function deliver(input: SendEmailInput): Promise<EmailDeliveryResult> {
  const base: Pick<EmailDeliveryResult, 'template'> = { template: input.template };

  if (!isSafeEmailAddress(input.to)) {
    return { ...base, status: 'failed', reason: 'invalid_recipient', attempts: 0 };
  }

  const injected = activeTransport();
  const runtime = resolveEmailRuntime();

  if (!injected && !runtime.canSend) {
    const reason: EmailDeliveryReason =
      runtime.reason === 'live' ? 'unconfigured' : runtime.reason;
    return { ...base, status: 'unavailable', reason, attempts: 0 };
  }

  const from = getEmailFrom();
  if (!injected && !isSafeFromAddress(from)) {
    return { ...base, status: 'unavailable', reason: 'invalid_sender', attempts: 0 };
  }

  const payload: EmailTransportPayload = {
    from: from || 'Beyond Financials <notifications@example.com>',
    to: input.to.trim(),
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: getEmailReplyTo() || undefined,
    idempotencyKey: input.idempotencyKey,
  };

  const transport = injected
    ? injected
    : {
        send: (message: EmailTransportPayload) => resendTransport(process.env.RESEND_API_KEY!.trim(), message),
      };

  const maxAttempts = 2;
  let attempts = 0;
  let lastStatus = 0;
  let lastMessage = '';

  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      const result = await transport.send(payload);
      if (result.ok) {
        return {
          ...base,
          status: 'accepted',
          providerMessageId: result.id,
          attempts,
        };
      }

      lastStatus = result.statusCode || 0;
      lastMessage = result.message || 'provider_error';
      const classified = classifyProviderFailure(lastStatus, result.name, lastMessage);
      console.error(
        `[EMAIL] provider failure template=${input.template} status=${lastStatus || 'network'} reason=${classified.reason} detail=${scrubSensitiveText(lastMessage)}`
      );
      if (!classified.retry || attempts >= maxAttempts) {
        return {
          ...base,
          status: 'failed',
          reason: classified.reason,
          attempts,
        };
      }
    } catch (error) {
      lastStatus = 0;
      lastMessage = error instanceof Error ? error.message : 'network_error';
      const classified = classifyProviderFailure(0, undefined, lastMessage);
      console.error(
        `[EMAIL] provider failure template=${input.template} status=network reason=${classified.reason} detail=${scrubSensitiveText(lastMessage)}`
      );
      if (!classified.retry || attempts >= maxAttempts) {
        return {
          ...base,
          status: 'failed',
          reason: classified.reason,
          attempts,
        };
      }
    }

    const waitMs = process.env.NODE_ENV === 'test' ? 20 : 400 * attempts;
    await delay(waitMs);
  }

  return {
    ...base,
    status: 'failed',
    reason: lastStatus === 0 ? 'network_error' : 'provider_error',
    attempts,
  };
}

/**
 * Sends one transactional email.
 * A repeated idempotency key does not send again after a completed attempt.
 * Provider acceptance is not inbox delivery.
 */
export async function sendEmail(input: SendEmailInput): Promise<EmailDeliveryResult> {
  const existing = completed.get(input.idempotencyKey);
  if (existing) {
    const duplicate: EmailDeliveryResult =
      existing.status === 'accepted'
        ? { ...existing, status: 'skipped', reason: 'duplicate' }
        : existing;
    logDelivery({
      at: new Date().toISOString(),
      template: input.template,
      status: duplicate.status,
      reason: duplicate.reason,
      recipient: maskEmail(input.to),
      attempts: 0,
      correlationId: input.correlationId,
    });
    return duplicate;
  }

  const pending = inflight.get(input.idempotencyKey);
  if (pending) return pending;

  const promise = deliver(input)
    .then((result) => {
      completed.set(input.idempotencyKey, result);
      logDelivery({
        at: new Date().toISOString(),
        template: input.template,
        status: result.status,
        reason: result.reason,
        recipient: maskEmail(input.to),
        providerMessageId: result.providerMessageId,
        attempts: result.attempts,
        correlationId: input.correlationId,
      });
      return result;
    })
    .finally(() => {
      inflight.delete(input.idempotencyKey);
    });

  inflight.set(input.idempotencyKey, promise);
  return promise;
}
