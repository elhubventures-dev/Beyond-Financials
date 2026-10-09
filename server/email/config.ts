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
  | 'production_log_mode'
  | 'invalid_origin';

export interface EmailRuntime {
  canSend: boolean;
  reason: EmailRuntimeReason;
}

const EMAIL_ADDRESS = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface ResolvedAppOrigin {
  origin: string;
  kind: 'local' | 'public';
}

function isLocalHostname(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('.localhost');
}

function isPrivateOrReservedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (isLocalHostname(host) || host === '0.0.0.0' || host.endsWith('.local')) return true;
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  if (a === 10 || a === 127 || a === 0 || a >= 224) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

/**
 * Parses APP_BASE_URL, then APP_URL.
 * Localhost stays available for development and test.
 * Public links require HTTPS and are never rewritten to another host.
 */
export function resolveConfiguredOrigin(): ResolvedAppOrigin | null {
  const raw = (process.env.APP_BASE_URL || process.env.APP_URL || '').trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.username || url.password) return null;
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;

  const hostname = url.hostname.toLowerCase();
  if (!hostname || hostname.includes(' ')) return null;

  if (isLocalHostname(hostname)) {
    return { origin: url.origin, kind: 'local' };
  }

  if (url.protocol !== 'https:' || isPrivateOrReservedHost(hostname)) return null;
  return { origin: url.origin, kind: 'public' };
}

export function getAppBaseUrl(): string {
  return resolveConfiguredOrigin()?.origin || '';
}

export function nodeEnvName(): string {
  return (process.env.NODE_ENV || '').trim();
}

/** Raw helper tokens are returned only for an explicit local development or test process. */
export function allowsDevTokenDisclosure(): boolean {
  const nodeEnv = nodeEnvName();
  if (nodeEnv !== 'development' && nodeEnv !== 'test') return false;
  return resolveConfiguredOrigin()?.kind === 'local';
}

/**
 * Production must name itself and must have a public HTTPS origin.
 * Any other NODE_ENV is not treated as development.
 */
export function assertProcessMode(): void {
  const nodeEnv = nodeEnvName();
  if (nodeEnv === 'production') {
    const origin = resolveConfiguredOrigin();
    if (!origin || origin.kind !== 'public') {
      throw new Error(
        'Refusing to start in production without a public HTTPS APP_BASE_URL or APP_URL. Localhost and non-HTTPS origins are rejected.'
      );
    }
    return;
  }

  if (nodeEnv !== 'development' && nodeEnv !== 'test') {
    throw new Error(
      'Refusing to start with an unspecified NODE_ENV. Set NODE_ENV to production, development, or test. Unspecified mode is not treated as development.'
    );
  }
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

/**
 * Builds an absolute link on the configured origin only.
 * The path is server-controlled. A value that changes the origin is rejected.
 * Production never emits localhost or non-HTTPS links.
 */
export function safeAppUrl(pathnameAndQuery: string): string | null {
  if (!pathnameAndQuery.startsWith('/') || pathnameAndQuery.startsWith('//')) return null;
  if (/[\\\0\r\n]/.test(pathnameAndQuery)) return null;

  const configured = resolveConfiguredOrigin();
  if (!configured) return null;

  const nodeEnv = nodeEnvName();
  if (configured.kind === 'local' && nodeEnv !== 'development' && nodeEnv !== 'test') return null;
  if (nodeEnv === 'production' && configured.kind !== 'public') return null;

  try {
    const url = new URL(pathnameAndQuery, `${configured.origin}/`);
    if (url.origin !== configured.origin) return null;
    if (url.username || url.password) return null;
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function resolveEmailRuntime(): EmailRuntime {
  const nodeEnv = nodeEnvName();
  const mode = (process.env.EMAIL_DELIVERY_MODE || '').trim().toLowerCase();
  const hasCredentials = Boolean(process.env.RESEND_API_KEY?.trim() && isSafeFromAddress(getEmailFrom()));
  const origin = resolveConfiguredOrigin();

  if (nodeEnv === 'test') {
    return { canSend: false, reason: 'test' };
  }

  if (nodeEnv !== 'production' && nodeEnv !== 'development') {
    return { canSend: false, reason: 'dev_hold' };
  }

  if (!hasCredentials) {
    return { canSend: false, reason: 'unconfigured' };
  }

  if (nodeEnv === 'production' && mode === 'log') {
    return { canSend: false, reason: 'production_log_mode' };
  }

  if (!origin || (nodeEnv === 'production' && origin.kind !== 'public')) {
    return { canSend: false, reason: 'invalid_origin' };
  }

  if (nodeEnv !== 'production' && mode !== 'live') {
    return { canSend: false, reason: 'dev_hold' };
  }

  return { canSend: true, reason: 'live' };
}
