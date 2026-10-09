# Beyond Financials email system

Internal implementation note. Do not publish this file on the marketing site.

## Architecture

Transactional email is server-only. The browser never receives the Resend API key, and no `VITE_` variable carries it.

- `server/email/config.ts` reads configuration at call time.
- `server/email/html.ts` renders one table-based layout (logo or wordmark, heading, body, panel, button, footer, plain text).
- `server/email/templates.ts` builds the messages that match real product flows.
- `server/services/emailService.ts` sends through the Resend SDK, or through a test transport.
- `server/services/notificationService.ts` is what routes call after a record is saved.

Persistence is still the existing in-memory lead, contact, and user stores. Email does not add a database or a queue.

## What “accepted” means

`accepted` means Resend accepted the API request (or the test transport did). It does not mean the message reached an inbox. The public UI uses that distinction.

`unavailable` means nothing was sent because credentials or delivery mode do not allow it.

`failed` means a send was attempted and the provider or network call did not succeed. The saved form record is kept.

`skipped` means this event intentionally did not send, usually because the waitlist email was already registered.

## Templates

| Template | When it sends |
| --- | --- |
| Waitlist confirmation | A new waitlist row was saved. Not sent for duplicates. |
| Internal new-lead notice | Same new waitlist row, and only if `EMAIL_LEADS_INBOX` is a valid address. |
| Contact acknowledgement | A contact enquiry passed validation and was stored. |
| Internal contact notice | Same enquiry, and only if `EMAIL_CONTACT_INBOX` is a valid address. |
| Email verification | After registration, and when a signed-in user asks to resend it. The account is not marked verified until `POST /api/auth/verify-email` consumes the token. Login is unchanged. |
| Password reset | Forgot-password found an account. The public response is the same when the account does not exist. |
| Password changed | After a successful password change or a successful token reset. |

Verification, reset, and unsubscribe links are built only from `APP_BASE_URL`, or from `APP_URL` when `APP_BASE_URL` is empty. The path cannot change the origin. Malformed values, credentials in the URL, and unsupported protocols are rejected. Production accepts a public `https://` origin only. Localhost remains available when `NODE_ENV` is `development` or `test`. Tokens are 32 random bytes. Only a SHA-256 hash is stored. Links expire (24 hours for verification, 1 hour for reset) and work once. Opening a link does not consume it; the verify and unsubscribe pages require a button, which sends `POST`.

Waitlist confirmation includes a working unsubscribe link. `POST /api/waitlist/unsubscribe` sets that lead to `UNSUBSCRIBED`. Security and contact emails do not include a fake unsubscribe control.

## Form-to-email matrix

| Form | Endpoint | Email |
| --- | --- | --- |
| Homepage email field | None. It opens the waitlist modal. | No |
| Waitlist modal, including service-page and mobile entry points | `POST /api/waitlist` | Confirmation on first save. No repeat on duplicate. Optional internal notice. |
| Contact form | `POST /api/contact` | Acknowledgement, plus optional internal notice. |
| Registration | `POST /api/auth/register` | Verification email. Session is still created. Address stays unverified until the link is used. |
| Login | `POST /api/auth/login` | No |
| Forgot password | `POST /api/auth/forgot-password` | Reset email only when the account exists. Response text does not say which. |
| Reset password | `POST /api/auth/reset-password` | Security notice after a successful reset. |
| Verify email | `POST /api/auth/verify-email` | No additional mail. |
| Profile edit | `PATCH /api/auth/profile` | No. Name and phone edits are not security notices. |
| Profile “Send verification email” | `POST /api/auth/resend-verification` | Verification email when the address is not verified yet. |
| Password change | `POST /api/auth/change-password` | Security notice after success. A wrong current password does not send one. |
| Session revoke controls | `DELETE /api/auth/sessions` | No |
| FAQ search | Local filter | No |
| Admin unlock | `POST /api/admin/auth/verify` | No |
| Admin notes and status | `PATCH /api/admin/leads/:id/notes` and `.../status` | No. Updates must not fan out mail. |
| Unsubscribe confirmation | `POST /api/waitlist/unsubscribe` | No |

## Environment variables

Copy placeholders from `.env.example`. Keep real values in `.env`, which is gitignored.

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Server-only Resend key. |
| `EMAIL_FROM` | Verified sender, for example `Beyond Financials <notifications@your-verified-domain>`. |
| `EMAIL_REPLY_TO` | Optional reply address. |
| `EMAIL_LOGO_URL` | Absolute `https://` URL of the official `public/logo.png` asset. Local paths are ignored. |
| `APP_BASE_URL` | Public site origin used for links. Falls back to existing `APP_URL`. Production must be public HTTPS. |
| `EMAIL_CONTACT_INBOX` | Internal contact notifications. Unset means they are not sent. |
| `EMAIL_LEADS_INBOX` | Internal notice for a new waitlist registration only. |
| `EMAIL_DELIVERY_MODE` | `live` sends outside production when the key and from-address exist. `log` refuses to send, including in production. |

Development does not send unless `EMAIL_DELIVERY_MODE=live` and both the key and `EMAIL_FROM` are set. `NODE_ENV=test` never calls Resend. An unset or unrecognized `NODE_ENV` is not treated as development: the process refuses to start, helper tokens are omitted, and live sending stays off. Production refuses to start unless `APP_BASE_URL` or `APP_URL` is a public HTTPS origin, and it sends only when that origin, the key, and `EMAIL_FROM` are valid, unless mode is `log`. A missing key does not crash the server. The API returns `unavailable` or `failed` and does not describe the provider error to the browser.

If `EMAIL_LOGO_URL` is empty and `APP_BASE_URL` is public HTTPS, the logo URL is `{APP_BASE_URL}/logo.png`. That file is `public/logo.png`. It only works in an inbox after that URL is publicly reachable. Otherwise the email uses the text wordmark “Beyond Financials”.

Published contact addresses in the footer are `hello@beyondfinancials.ng` and `security@beyondfinancials.ng`, the same addresses already shown on the website. They are not used as the Resend sender. Confirm those mailboxes are monitored before relying on replies.

## Resend domain and DNS

The SDK is constructed with the server-side `RESEND_API_KEY` and uses Resend’s default API origin, `https://api.resend.com`. A send is refused if that origin is not the one the SDK reports. Authentication failures, including HTTP 401 and `invalid_api_key`, are not retried. HTTP 401 does not prove whether the sender domain is verified.

A previous domains lookup with the configured key returned HTTP 401. Treat the key as unauthenticated until the dashboard shows otherwise. Do not paste the key into chat, source, or a prompt.

Operator steps, in the Resend dashboard:

1. Open the account that should own Beyond Financials mail and confirm you are in that account, not a different workspace.
2. Open API Keys. Confirm the server key exists, is not revoked, and has permission to send email and read domains. Create a replacement key there if the current one is rejected. Put the new value only in the server environment.
3. Open Domains. Add the domain used in `EMAIL_FROM`.
4. Copy the DNS records Resend shows (typically SPF/TXT and DKIM) into the domain’s DNS, then wait until that domain’s status is Verified. A 401 from the API is not verification.
5. Set `EMAIL_FROM` to an address on that verified domain.
6. Set `APP_BASE_URL` to the public HTTPS site origin, and `EMAIL_LOGO_URL` to the public logo URL.
7. Set `NODE_ENV=production` on the production host. Production does not send while the origin is localhost or not HTTPS.
8. For a local send test only, set `EMAIL_DELIVERY_MODE=live` after the domain is verified. Leave it unset until then. Production does not need `live` once the key, from-address, and public HTTPS origin are valid.

Do not put the API key in source, chat, or a `VITE_` variable.

## Local testing

```bash
npm test
npm run lint
npm run build
```

Automated tests mock the provider. They do not send real email.

Safe live test, only after DNS verification, and only to an inbox you control:

1. Put the variables above in `.env`.
2. Set `EMAIL_DELIVERY_MODE=live`.
3. Start the server with `npm run dev`.
4. Submit the waitlist or contact form using your own address.
5. In Resend, confirm the API request was accepted.
6. Confirm the message in the inbox separately. Acceptance and inbox delivery are different.

## Failure handling and retries

The form is saved before email is attempted. A provider failure does not delete the waitlist row, contact enquiry, or account.

Inside one request, a transient provider or network error is tried once more (two attempts total). Authentication, permission, domain-verification, and quota failures are not retried. There is no durable queue. Restarting the process drops the in-memory delivery log and any unsent retry. Duplicate waitlist submissions do not send another confirmation, including when the first confirmation failed. Operators can see masked delivery lines in the server log (`[EMAIL] ...`). Logs omit API keys, raw tokens, reset URLs, passwords, and message bodies. Provider error text stays in those server logs and is not returned to the browser.

Resend’s `idempotencyKey` is passed on each send. That key is local to the process as well. It is not a durable guarantee across restarts.

## Privacy

Customer subjects do not include the person’s name or email. User-written text is HTML-escaped. Internal mail goes only to the configured inbox and contains the fields needed to handle that one enquiry. Password reset and verification tokens are stored as hashes and are not logged. An expired reset token returns the same public error as an invalid token. Session identifiers in request paths are redacted before logging. A signed-in user can revoke only their own session. `devResetToken` and `devVerificationToken` are returned only when `NODE_ENV` is `development` or `test` and the configured origin is localhost. A public HTTPS origin does not receive them, including when `NODE_ENV` is `development`. Production responses do not include them.

Waitlist mail is sent only after a consented, validated registration. This system does not send marketing campaigns.

## Live website

`beyondfinancials.ng` is a static Vercel site. The browser posts forms to `/api/contact` and `/api/waitlist` on that same host. `api/[...path].ts` serves the existing Express API there, and `vercel.json` sends other routes to the single-page app. A local `.env` file is not uploaded with the static site.

The Vercel project that owns the domain needs `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `EMAIL_LOGO_URL`, `EMAIL_CONTACT_INBOX`, `EMAIL_LEADS_INBOX`, and `APP_BASE_URL=https://beyondfinancials.ng`. Production sends only when `NODE_ENV=production` and that origin is public HTTPS. Do not put the API key in source or chat.

## Remaining manual work

- In the Resend dashboard, confirm the API key’s account and send permission, then verify the sender domain and DNS. The last domains request returned HTTP 401, so verification is still unconfirmed.
- Set `NODE_ENV=production` and a public HTTPS `APP_BASE_URL` on the production host. Set `ADMIN_API_KEY` there as well. Admin routes deny access when that key is missing.
- Confirm `hello@` and `security@` mailboxes are operational.
- Host `logo.png` on the public HTTPS origin and set `EMAIL_LOGO_URL`.
- Send one live message to an inbox you control, then check the inbox itself.
- Browser checks of focus, mobile layout, and keyboard use were not run in this environment. API tests covered submission, validation, duplicates, authorization, and email outcomes.
