# Beyond Financials - Waitlist & Lead Management System

**Document Version:** 1.0.0 (Pre-Launch Milestone)  
**System State:** Pre-Launch User Acquisition & Waitlist Prioritization  
**Regulatory Context:** Pre-operational acquisition under Nigerian Data Protection Act (NDPA) guidelines  

---

## 1. System Scope & Architecture

### Purpose
The **Beyond Financials Waitlist & Lead Management System** transforms the public early access waitlist into an acquisition pipeline for prospective users before launch.

### Important Architectural Boundaries
- **Acquisition Scope Only:** This is a **pre-launch acquisition and waitlist management system**, **not** a banking customer database.
- **No Financial Capabilities:** It does **not** execute banking transactions, financial transfers, KYC verification, credit underwriting, or crypto/investment execution.
- **Data Minimization:** It strictly collects privacy-safe contact information, customer segmentation, explicit consent, and categorized product interest.

```
+-----------------------------------------------------------------------------------+
|                            PUBLIC ACQUISITION CHANNELS                            |
| (Homepage Hero / Services Hub / Banking / Savings / Loans / Payments / Campaigns) |
+----------------------------------------+------------------------------------------+
                                         |
                                         v POST /api/waitlist (Rate Limited: 6/10min)
+-----------------------------------------------------------------------------------+
|                        INPUT VALIDATION & DATA MINIMIZATION                       |
|   - Regex-verified email & Nigerian phone numbers                                 |
|   - Sensitive credential rejection (detects & strips BVN, NIN, card PANs, PINs)   |
|   - Explicit consent check & timestamp                                            |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         LEAD STORE ENGINE (leadStore.ts)                          |
|   - Normalization: lowercases emails, strips phone whitespace                     |
|   - Deduplication: preserves initial signup date, merges new interest tags        |
|   - Multi-field search, multi-attribute filtering, pagination & sorting           |
|   - Status transitions with audit logging                                         |
|   - Safe CSV export with formula injection sanitization                           |
+-----------------------------------+-----------------------------------------------+
                                    |
                                    v Protected by adminAuthMiddleware (x-admin-key)
+-----------------------------------------------------------------------------------+
|                     ADMINISTRATIVE LEAD DESK (/admin/leads)                       |
|   - Real-time Analytics & Interest Demand Distribution                            |
|   - Search & Multi-filter Toolbar (Status, Interest, Source, Date)                |
|   - High-contrast Desktop Table & Mobile Card Views                               |
|   - Full Lead Detail Inspector & Status Management Controller                     |
|   - Real-time Administrative Audit Trail                                          |
+-----------------------------------------------------------------------------------+
```

---

## 2. Data Model

### Lead Record Schema (`WaitlistLead`)

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique reference identifier (e.g., `LEAD-MJ84K2-9A3F`) |
| `firstName` | `string` | Yes | Prospect's first name (min 2 chars) |
| `lastName` | `string` | Yes | Prospect's last name (min 2 chars) |
| `email` | `string` | Yes | Normalized unique email address (`user@domain.com`) |
| `phoneNumber` | `string` | Optional | Normalized phone number (`+234...` or `080...`) |
| `primaryInterest` | `InterestCategory` | Yes | Primary product interest |
| `interests` | `InterestCategory[]` | Yes | Array of all expressed interest categories |
| `customerSegment` | `string` | Yes | Segment classification (`individual`, `sme`, `corporate`, `student`) |
| `status` | `LeadStatus` | Yes | Controlled acquisition lifecycle status |
| `statusNotes` | `string` | Optional | Note explaining the latest status transition |
| `consent` | `boolean` | Yes | Explicit opt-in agreement to pre-launch communications |
| `consentRecordedAt`| `string` (ISO) | Yes | ISO timestamp when consent was granted |
| `notes` | `string` | Optional | Internal administrator notes |
| `source` | `AcquisitionSource` | Yes | Inbound source page or channel |
| `landingPage` | `string` | Optional | URL pathname where conversion occurred |
| `referralCode` | `string` | Optional | Partner or user referral code |
| `utmSource` | `string` | Optional | Campaign source |
| `utmMedium` | `string` | Optional | Campaign medium (e.g. `cpc`, `email`, `social`) |
| `utmCampaign` | `string` | Optional | Specific marketing campaign identifier |
| `utmContent` | `string` | Optional | Ad/link content variant identifier |
| `country` | `string` | Yes | Country code (defaults to `NG`) |
| `createdAt` | `string` (ISO) | Yes | Initial registration timestamp |
| `updatedAt` | `string` (ISO) | Yes | Last modification timestamp |

---

## 3. Controlled Lead Status Lifecycles

Leads progress through a defined set of lifecycle stages:

```
[ NEW ] --------> [ CONTACTED ] --------> [ QUALIFIED ] --------> [ CONVERTED ]
   |                    |                      |                        |
   +--------------------+----------------------+------------------------+
                                   |
                                   v
                           [ UNSUBSCRIBED ]
```

1. **`NEW`**: Prospect has submitted the waitlist form. No administrative action has been taken.
2. **`CONTACTED`**: Outreach has begun (e.g. preliminary survey, welcome email, research call).
3. **`QUALIFIED`**: Lead has demonstrated high readiness, matching the target demographic for early closed-beta testing.
4. **`CONVERTED`**: Prospect has received and accepted an invitation for initial rollout testing.
5. **`UNSUBSCRIBED`**: Prospect has requested removal from pre-launch communications.

---

## 4. Deduplication & Preference Merging Strategy

When a prospect registers with an email address that is already in the system:
1. **No Duplicate Row Created:** The existing record is located by normalized email.
2. **Preserves Registration Timeline:** The original `createdAt` timestamp is retained to maintain priority queue position.
3. **Merges Expressed Interests:** If the prospect signs up from a different page (e.g. Savings after originally signing up for Banking), the new interest is appended to `lead.interests`.
4. **Updates Attribution if New:** Campaign attribution and notes are refreshed.
5. **Safe User Messaging:** The API responds with:
   > *"You may already be on the list. If so, we'll keep your existing registration and updated preferences."*

---

## 5. Security & Access Control

### Server-Side Admin Authorization
- Admin endpoints (`/api/admin/*`) require server-side verification using `ADMIN_API_KEY`.
- The key is supplied via:
  - `x-admin-key: <ADMIN_API_KEY>` header, OR
  - `Authorization: Bearer <ADMIN_API_KEY>` header.
- The default development passkey is `bf_admin_dev_key_2026` (configurable in `.env`).

### Anti-Abuse & Rate Limiting
- Public endpoint `POST /api/waitlist` enforces in-memory rate limiting capped at **6 requests per 10 minutes** per IP and per normalized email.
- Returns HTTP `429 Too Many Requests` if threshold is breached.

### CSV Formula Injection Neutralization
Exported CSV files sanitize all cells to neutralize CSV spreadsheet injection:
- Any field starting with `=`, `+`, `-`, `@`, `\t`, or `\r` is escaped by prepending a single quote (`'`).

---

## 6. Data Privacy & Minimization (NDPA Compliance)

1. **Strict Data Minimization:** The waitlist captures only what is necessary for outreach: Full Name, Email, Phone (optional), and Interest.
2. **Prohibition of Sensitive Financial Data:** Automated filtering blocks submissions containing BVNs, NINs, payment card PANs, PINs, passwords, or recovery phrases.
3. **Consent Trail:** Every lead retains `consent: true` and an unalterable `consentRecordedAt` timestamp.
4. **Right to Opt-Out:** Leads can be transitioned to `UNSUBSCRIBED` status, stopping all future communications.

---

## 7. API Reference

### Public Endpoints

#### `POST /api/waitlist`
Join the early access waitlist.
- **Request Body:**
  ```json
  {
    "firstName": "Amaka",
    "lastName": "Okafor",
    "email": "amaka.okafor@example.com",
    "phoneNumber": "08031234567",
    "primaryInterest": "smart_savings",
    "customerSegment": "individual",
    "consentAccepted": true,
    "source": "SAVINGS"
  }
  ```
- **Responses:**
  - `201 Created`: Successfully registered new lead.
  - `200 OK`: Lead was already registered; preferences merged.
  - `422 Unprocessable Entity`: Validation failure or sensitive keywords detected.
  - `429 Too Many Requests`: Rate limit exceeded.

#### `GET /api/waitlist/stats`
Returns aggregated, privacy-safe subscriber metrics for public UI indicators.

---

### Protected Administrator Endpoints (`/api/admin/*`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/admin/auth/verify` | Validates admin passkey |
| `GET` | `/api/admin/leads` | Queries leads with full-text search, filters, pagination, and sorting |
| `GET` | `/api/admin/leads/stats` | Acquisition metrics breakdown by status, interest, and source |
| `GET` | `/api/admin/leads/export` | Downloads safe CSV export of filtered leads |
| `GET` | `/api/admin/leads/:id` | Returns full detail of an individual lead |
| `PATCH` | `/api/admin/leads/:id/status` | Updates lead status with audit logging (`{ status, note }`) |
| `PATCH` | `/api/admin/leads/:id/notes` | Updates administrative internal notes (`{ notes }`) |
| `GET` | `/api/admin/audit-logs` | Retrieves recent administrative audit events |

---

*Beyond Financials Engineering — Milestone: Waitlist & Lead Management System*
