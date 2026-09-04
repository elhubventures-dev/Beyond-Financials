# Beyond Financials — Digital Financial Services Platform
**Domain:** `beyondfinancials.ng`  
**Product Category:** Digital Financial Services Platform / Fintech  
**Primary Market:** Nigeria Nationwide (Future International)  
**Philosophy:** *"One financial relationship, multiple financial services."*

---

## 1. Project Overview & Context

Beyond Financials is engineered as a unified digital financial services ecosystem connecting retail consumers, salary earners, civil servants, entrepreneurs, merchants, and agent operators across Nigeria.

### Contracted Phase 1 Context
- **Agreed Milestone Investment:** ₦3,500,000
- **Estimated Delivery Timeline:** 8–10 Weeks
- **Core Scope:** 45 Deliverables across registration, tiered KYC (BVN, NIN, selfie, address), virtual account allocation, wallet management, internal & interbank transfers, flexible/locked savings, loan workflows, airtime/data/utility bills, merchant settlement, agency banking, and super admin operations.
- **Future Strategic Scope (Explicitly NOT active in Phase 1):** Cryptocurrency exchange, open capital investments, cross-border remittances, and open banking APIs.

---

## 2. Architectural Principles

This application is built on a strict **8-tier full-stack architecture**:

```
┌────────────────────────────────────────────────────────┐
│ 1. Presentation Layer (React 19 + Tailwind CSS)        │
├────────────────────────────────────────────────────────┤
│ 2. Frontend Application Logic (Hooks, State)           │
├────────────────────────────────────────────────────────┤
│ 3. Backend Gateway (Express Node.js on port 3000)      │
├────────────────────────────────────────────────────────┤
│ 4. Domain & Business Rules (Tiered KYC, Limits, Logic) │
├────────────────────────────────────────────────────────┤
│ 5. Financial Ledger Engine (Immutable Double-Entry)   │
├────────────────────────────────────────────────────────┤
│ 6. External Provider Adapters (Pluggable Interfaces)   │
├────────────────────────────────────────────────────────┤
│ 7. Security & Authentication (RBAC, Token Isolation)   │
├────────────────────────────────────────────────────────┤
│ 8. Audit & Compliance Logging (Sanitized Trails)       │
└────────────────────────────────────────────────────────┘
```

### Key Architectural Invariants:
1. **Zero Client Secrets:** No provider credentials, API keys, or webhooks in browser code.
2. **Double-Entry Financial Ledger:** Balances are strictly derived from signed, immutable credit/debit entries — never modified with direct raw SQL increments.
3. **Pluggable Adapter Interfaces:** All third-party providers (Banking, KYC, Payments, Bills, Notifications) are decoupled behind standard interfaces (`BankingProvider`, `KYCProvider`, `PaymentProvider`, `BillPaymentProvider`, `NotificationProvider`).
4. **Mock Isolation:** In the foundation stage, all mock providers are explicitly labeled `[MOCK / DEVELOPMENT ONLY]`. No real transactions or external API calls are executed.
5. **Sanitized Audit Logging:** PII and sensitive credentials (BVN, NIN, passwords, card details) are automatically stripped before logging.

---

## 3. Brand Identity & Design System

The Beyond Financials design system is structured around the authentic brand identity:
- **Navy Blue (`#0A2540`, `#0D3B66`):** Institutional trust and primary brand canvas.
- **Accent Gold / Yellow (`#F59E0B`, `#FBBF24`):** Momentum, financial vitality, and key action highlights.
- **Neutral Slate (`#F8FAFC` to `#0F172A`):** Mathematical padding, high-contrast typography, and accessible UI hierarchy.
- **White (`#FFFFFF`):** Crisp, readable background and component cards.

Typography pairing: **Outfit** (Display / Headlines) + **Plus Jakarta Sans** (Body & Forms).

---

## 4. API Endpoints (Foundation Gateway)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health, active phase info, and capability diagnostics. |
| `GET` | `/api/system/status` | Active adapter status and ledger architecture state. |
| `POST` | `/api/waitlist` | Secure, privacy-safe waitlist registration with validation & audit logs. |
| `GET` | `/api/waitlist/stats` | Aggregate waitlist subscriber counts and interest distributions. |

---

## 5. Directory Structure

```
├── .env.example              # Server environment variable documentation
├── index.html                # SEO meta tags, Open Graph, fonts
├── metadata.json             # AI Studio app metadata
├── package.json              # Express + Vite scripts and dependencies
├── server.ts                 # Express full-stack entry point & Vite middleware
├── server/
│   ├── middleware/
│   │   ├── errorHandler.ts   # Centralized error handler
│   │   └── logger.ts         # Sanitized request logger
│   ├── routes/
│   │   ├── health.ts         # Health and status routes
│   │   └── waitlist.ts       # Waitlist submission API
│   └── types.ts              # Server-side shared contracts
└── src/
    ├── App.tsx               # Main application shell
    ├── main.tsx              # React mounting root
    ├── index.css             # Tailwind CSS entry
    ├── theme/
    │   └── tokens.ts         # Brand colors, typography, spacing tokens
    ├── types/
    │   └── domain.ts         # Financial ledger, KYC, waitlist models
    ├── providers/
    │   ├── contracts.ts      # Vendor-agnostic adapter interfaces
    │   └── mock/
    │       └── mockProviders.ts # [MOCK / DEV ONLY] test implementations
    └── components/
        ├── ui/               # Reusable design system primitives
        │   ├── BrandLogo.tsx
        │   ├── Button.tsx
        │   ├── Badge.tsx
        │   ├── Card.tsx
        │   ├── Input.tsx
        │   ├── Select.tsx
        │   └── Modal.tsx
        ├── layout/           # Header, Navigation, Footer
        │   ├── Header.tsx
        │   └── Footer.tsx
        └── landing/          # Public acquisition & landing sections
            ├── HeroSection.tsx
            ├── ScopeBreakdownSection.tsx
            ├── PillarsSection.tsx
            ├── ArchitecturePreview.tsx
            ├── SecuritySection.tsx
            ├── FAQSection.tsx
            ├── WaitlistModal.tsx
            └── SystemStatusBanner.tsx
```

---

## 6. Incremental Development Rules

Future prompts must adhere to the established foundation:
1. **Preserve Architectural Invariants:** Do not flatten backend routes or introduce direct balance mutations.
2. **Feature Status Integrity:** Always clearly distinguish between Phase 1 active modules and future capabilities.
3. **Provider Plug-In:** Implement real providers by creating concrete classes that implement the contracts in `src/providers/contracts.ts`.
4. **Data Privacy:** Never collect BVN, NIN, passwords, or cards on public marketing pages.
