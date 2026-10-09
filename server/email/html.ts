/**
 * Conservative, table-based email markup.
 * Fonts match the website (Outfit, Plus Jakarta Sans) with system fallbacks.
 */

export const EMAIL_COLORS = {
  navy: '#001B40',
  royal: '#0046AD',
  royalHover: '#00388A',
  gold: '#FBBF24',
  canvas: '#F8FAFC',
  white: '#FFFFFF',
  text: '#1E293B',
  muted: '#475569',
  line: '#E2E8F0',
  panel: '#F8FAFC',
} as const;

const BODY_FONT = "'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const DISPLAY_FONT = "Outfit, 'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeText(value: unknown): string {
  return String(value ?? '').replace(/\r/g, '').slice(0, 4000);
}

export interface EmailDocumentInput {
  preheader: string;
  heading: string;
  paragraphs: string[];
  panel?: { title: string; lines: string[] };
  cta?: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
  footerNote?: string;
  siteUrl?: string | null;
  footerLinks?: { label: string; href: string }[];
  unsubscribeUrl?: string;
  logoUrl?: string | null;
}

function paragraphHtml(text: string): string {
  return `<p style="margin:0 0 16px 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.text};">${text}</p>`;
}

function logoBlock(logoUrl?: string | null): string {
  const wordmark = `
    <p style="margin:0;font-family:${DISPLAY_FONT};font-size:18px;line-height:1.2;font-weight:700;letter-spacing:0.04em;color:${EMAIL_COLORS.navy};">
      BEYOND FINANCIALS
    </p>
    <p style="margin:4px 0 0 0;font-family:${BODY_FONT};font-size:12px;line-height:1.4;color:${EMAIL_COLORS.muted};">
      beyondfinancials.ng
    </p>`;

  if (!logoUrl) {
    return wordmark;
  }

  return `
    <img src="${escapeHtml(logoUrl)}" alt="Beyond Financials" width="168" height="46" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:168px;margin:0 0 10px 0;" />
    ${wordmark}`;
}

export function renderEmailDocument(input: EmailDocumentInput): { html: string; text: string } {
  const preheader = escapeHtml(input.preheader);
  const heading = escapeHtml(input.heading);
  const body = input.paragraphs.map(paragraphHtml).join('');

  const panel = input.panel
    ? `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 20px 0;">
        <tr>
          <td style="background:${EMAIL_COLORS.panel};border:1px solid ${EMAIL_COLORS.line};border-left:4px solid ${EMAIL_COLORS.gold};border-radius:8px;padding:16px 18px;">
            <p style="margin:0 0 8px 0;font-family:${DISPLAY_FONT};font-size:13px;line-height:1.4;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${EMAIL_COLORS.navy};">${escapeHtml(input.panel.title)}</p>
            ${input.panel.lines
              .map(
                (line) =>
                  `<p style="margin:0 0 6px 0;font-family:${BODY_FONT};font-size:14px;line-height:1.5;color:${EMAIL_COLORS.text};">${line}</p>`
              )
              .join('')}
          </td>
        </tr>
      </table>`
    : '';

  const cta = input.cta
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 12px 0;">
        <tr>
          <td align="center" bgcolor="${EMAIL_COLORS.royal}" style="border-radius:8px;">
            <a href="${escapeHtml(input.cta.href)}" style="display:inline-block;padding:14px 28px;font-family:${BODY_FONT};font-size:16px;line-height:1.2;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(input.cta.label)}</a>
          </td>
        </tr>
      </table>`
    : '';

  const secondary = input.secondaryLink
    ? `<p style="margin:0 0 8px 0;font-family:${BODY_FONT};font-size:14px;line-height:1.5;"><a href="${escapeHtml(input.secondaryLink.href)}" style="color:${EMAIL_COLORS.royal};font-weight:600;text-decoration:underline;">${escapeHtml(input.secondaryLink.label)}</a></p>`
    : '';

  const unsubscribe = input.unsubscribeUrl
    ? `<p style="margin:12px 0 0 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">To stop waitlist updates, <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">unsubscribe</a>.</p>`
    : '';

  const footerNote = input.footerNote
    ? `<p style="margin:0 0 12px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">${escapeHtml(input.footerNote)}</p>`
    : '';

  const siteLink = input.siteUrl
    ? ` · <a href="${escapeHtml(input.siteUrl)}" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">beyondfinancials.ng</a>`
    : ' · beyondfinancials.ng';

  const footerLinks = (input.footerLinks || [])
    .map(
      (link, index) =>
        `${index > 0 ? ' · ' : ''}<a href="${escapeHtml(link.href)}" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">${escapeHtml(link.label)}</a>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${heading}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&amp;family=Plus+Jakarta+Sans:wght@400;600;700&amp;display=swap" />
</head>
<body style="margin:0;padding:0;background:${EMAIL_COLORS.canvas};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${EMAIL_COLORS.canvas};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 16px 0;">
              ${logoBlock(input.logoUrl)}
            </td>
          </tr>
          <tr>
            <td style="background:${EMAIL_COLORS.white};border:1px solid ${EMAIL_COLORS.line};border-radius:12px;padding:32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:0 0 18px 0;border-bottom:3px solid ${EMAIL_COLORS.gold};">
                    <h1 style="margin:0;font-family:${DISPLAY_FONT};font-size:26px;line-height:1.25;font-weight:700;color:${EMAIL_COLORS.navy};">${heading}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px 0 0 0;">
                    ${body}
                    ${panel}
                    ${cta}
                    ${secondary}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 0 8px;">
              ${footerNote}
              <p style="margin:0 0 8px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">
                Beyond Financials${siteLink}
              </p>
              <p style="margin:0 0 8px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">
                Questions: <a href="mailto:hello@beyondfinancials.ng" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">hello@beyondfinancials.ng</a>
                · Security: <a href="mailto:security@beyondfinancials.ng" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">security@beyondfinancials.ng</a>
              </p>
              ${footerLinks ? `<p style="margin:0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">${footerLinks}</p>` : ''}
              ${unsubscribe}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textLines = [
    'BEYOND FINANCIALS',
    'beyondfinancials.ng',
    '',
    input.heading,
    '',
    ...input.paragraphs.map((paragraph) => paragraph.replace(/<[^>]+>/g, '')),
    '',
  ];

  if (input.panel) {
    textLines.push(input.panel.title);
    textLines.push(...input.panel.lines.map((line) => line.replace(/<[^>]+>/g, '')));
    textLines.push('');
  }

  if (input.cta) {
    textLines.push(`${input.cta.label}: ${input.cta.href}`);
    textLines.push('');
  }

  if (input.secondaryLink) {
    textLines.push(`${input.secondaryLink.label}: ${input.secondaryLink.href}`);
    textLines.push('');
  }

  if (input.footerNote) {
    textLines.push(input.footerNote);
    textLines.push('');
  }

  textLines.push('Questions: hello@beyondfinancials.ng');
  textLines.push('Security: security@beyondfinancials.ng');
  for (const link of input.footerLinks || []) {
    textLines.push(`${link.label}: ${link.href}`);
  }

  if (input.unsubscribeUrl) {
    textLines.push(`Unsubscribe from waitlist updates: ${input.unsubscribeUrl}`);
  }

  return { html, text: textLines.join('\n') };
}
