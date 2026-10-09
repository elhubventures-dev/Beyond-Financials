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

Verification and reset links are built only from `APP_BASE_URL` or `APP_URL`. Off-origin paths are rejected. Tokens are 32 random bytes. Only a SHA-256 hash is stored. Links expire (24 hours for verification, 1 hour for reset) and work once. Opening a link does not consume it; the verify and unsubscribe pages require a button, which sends `POST`.

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
| `APP_BASE_URL` | Public site origin used for links. Falls back to existing `APP_URL`. |
| `EMAIL_CONTACT_INBOX` | Internal contact notifications. Unset means they are not sent. |
| `EMAIL_LEADS_INBOX` | Internal notice for a new waitlist registration only. |
| `EMAIL_DELIVERY_MODE` | `live` sends outside production when the key and from-address exist. `log` refuses to send, including in production. |

Development does not send unless `EMAIL_DELIVERY_MODE=live` and both the key and `EMAIL_FROM` are set. `NODE_ENV=test` never calls Resend. Production sends when the key and from-address are valid, unless mode is `log`. A missing key does not crash the server. The API returns `unavailable` and does not describe the provider error to the browser.

If `EMAIL_LOGO_URL` is empty and `APP_BASE_URL` is public HTTPS, the logo URL is `{APP_BASE_URL}/logo.png`. That file is `public/logo.png`. It only works in an inbox after that URL is publicly reachable. Otherwise the email uses the text wordmark “Beyond Financials”.

Published contact addresses in the footer are `hello@beyondfinancials.ng` and `security@beyondfinancials.ng`, the same addresses already shown on the website. They are not used as the Resend sender. Confirm those mailboxes are monitored before relying on replies.

## Resend domain and DNS

1. Create a Resend account and add the sending domain you control.
2. Add the DNS records Resend shows for that domain (typically SPF/TXT and DKIM). Wait until Resend marks the domain verified.
3. Set `EMAIL_FROM` to an address on that verified domain.
4. Set `RESEND_API_KEY` in the server environment only.
5. Set `APP_BASE_URL` to the public HTTPS origin, and `EMAIL_LOGO_URL` to the public logo URL.
6. Set `EMAIL_DELIVERY_MODE=live` for a local send test. Production does not need `live` once the key and from-address are present.

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

Inside one request, a transient provider or network error is tried once more (two attempts total). There is no durable queue. Restarting the process drops the in-memory delivery log and any unsent retry. Duplicate waitlist submissions do not send another confirmation, including when the first confirmation failed. Operators can see masked delivery lines in the server log (`[EMAIL] ...`). Logs omit API keys, raw tokens, reset URLs, passwords, and message bodies.

Resend’s `idempotencyKey` is passed on each send. That key is local to the process as well. It is not a durable guarantee across restarts.

## Privacy

Customer subjects do not include the person’s name or email. User-written text is HTML-escaped. Internal mail goes only to the configured inbox and contains the fields needed to handle that one enquiry. Password reset and verification tokens are stored as hashes and are not logged. An expired reset token returns the same public error as an invalid token. Session identifiers in request paths are redacted before logging. A signed-in user can revoke only their own session. Non-production responses may include `devResetToken` or `devVerificationToken` for local testing. Production responses do not.

Waitlist mail is sent only after a consented, validated registration. This system does not send marketing campaigns.

## Remaining manual work

- Verify the sending domain in Resend and set the environment variables.
- Confirm `hello@` and `security@` mailboxes are operational.
- Host `logo.png` on the public HTTPS origin and set `EMAIL_LOGO_URL`.
- Send one live message to an inbox you control, then check the inbox itself.
- Browser checks of focus, mobile layout, and keyboard use were not run in this environment. API tests covered submission, validation, duplicates, authorization, and email outcomes.
