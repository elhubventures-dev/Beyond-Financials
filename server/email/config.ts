/**
 * Server-only email configuration.
 * Reads environment variables at call time so tests can set them safely.
 * The Resend API key never leaves this module's send path.
 */

export type EmailRuntimeReason =
  | 'live'
  | 'unconfigured'
  | 'dev_hold'
  | 'test'
  | 'production_log_mode';

export interface EmailRuntime {
  canSend: boolean;
  reason: EmailRuntimeReason;
}

const EMAIL_ADDRESS = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function getAppBaseUrl(): string {
  const raw = (process.env.APP_BASE_URL || process.env.APP_URL || '').trim();
  return raw.replace(/\/$/, '');
}

export function isSafeEmailAddress(value: string): boolean {
  if (!value || value.length > 254) return false;
  if (/[\r\n\0]/.test(value)) return false;
  return EMAIL_ADDRESS.test(value.trim());
}

/** Accepts `notifications@domain` or `Beyond Financials <notifications@domain>`. */
export function isSafeFromAddress(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || /[\r\n\0]/.test(trimmed)) return false;
  const wrapped = trimmed.match(/^([^<>]{1,80})<([^<>]+)>$/);
  if (wrapped) {
    return isSafeEmailAddress(wrapped[2].trim());
  }
  return isSafeEmailAddress(trimmed);
}

export function getEmailFrom(): string {
  return (process.env.EMAIL_FROM || '').trim();
}

export function getEmailReplyTo(): string {
  return (process.env.EMAIL_REPLY_TO || '').trim();
}

export function getContactInbox(): string {
  return (process.env.EMAIL_CONTACT_INBOX || '').trim();
}

export function getLeadsInbox(): string {
  return (process.env.EMAIL_LEADS_INBOX || '').trim();
}

function isPublicHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return false;
    if (url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host.endsWith('.local')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Absolute HTTPS logo URL for email clients.
 * EMAIL_LOGO_URL wins. Otherwise APP_BASE_URL or APP_URL plus /logo.png
 * is used only when that base is already a public HTTPS origin.
 * Local paths are never returned.
 */
export function getEmailLogoUrl(): string | null {
  const explicit = (process.env.EMAIL_LOGO_URL || '').trim();
  if (explicit) {
    return isPublicHttpsUrl(explicit) ? explicit : null;
  }

  const base = getAppBaseUrl();
  if (!base || !isPublicHttpsUrl(base)) return null;

  try {
    const url = new URL('/logo.png', `${base}/`);
    return isPublicHttpsUrl(url.toString()) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Builds an absolute link on the configured app origin. Rejects off-origin targets. */
export function safeAppUrl(pathnameAndQuery: string): string | null {
  const base = getAppBaseUrl();
  if (!base) return null;
  if (!pathnameAndQuery.startsWith('/')) return null;
  if (pathnameAndQuery.startsWith('//')) return null;

  try {
    const baseUrl = new URL(base);
    if (baseUrl.protocol !== 'https:' && baseUrl.protocol !== 'http:') return null;
    const url = new URL(pathnameAndQuery, `${baseUrl.origin}/`);
    if (url.origin !== baseUrl.origin) return null;
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function resolveEmailRuntime(): EmailRuntime {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const mode = (process.env.EMAIL_DELIVERY_MODE || '').trim().toLowerCase();
  const hasCredentials = Boolean(process.env.RESEND_API_KEY?.trim() && isSafeFromAddress(getEmailFrom()));

  if (nodeEnv === 'test') {
    return { canSend: false, reason: 'test' };
  }

  if (!hasCredentials) {
    return { canSend: false, reason: 'unconfigured' };
  }

  if (nodeEnv === 'production' && mode === 'log') {
    return { canSend: false, reason: 'production_log_mode' };
  }

  if (nodeEnv !== 'production' && mode !== 'live') {
    return { canSend: false, reason: 'dev_hold' };
  }

  return { canSend: true, reason: 'live' };
}
