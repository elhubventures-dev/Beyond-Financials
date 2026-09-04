# Beyond Financials - Public Claim Audit & Compliance Verification

**Audit Date**: August 2026  
**Milestone**: Trust & Information Layer (Pre-Launch Public Website)  
**Domain**: `beyondfinancials.ng`  
**Classification System**:
- **[VERIFIED]**: Factually accurate for the current contracted Phase 1 development scope and documented architecture.
- **[NEEDS CONFIRMATION]**: Dependent on final client partner selection, regulatory licensing approval, or future operational agreements.
- **[REMOVED / SAFER WORDING APPLIED]**: Potentially misleading or unsupported public statement replaced with transparent pre-launch language.

---

## 1. Regulatory & Licensing Claims Audit

| Location | Original / Referenced Text | Classification | Action Taken / Compliance Note |
| :--- | :--- | :--- | :--- |
| `src/data/servicesData.ts` (Banking FAQ) | "Beyond Financials is a financial technology platform currently in active Phase 1 engineering. Banking infrastructure and account services will be operated in direct partnership with licensed deposit-taking financial institutions in compliance with Central Bank of Nigeria (CBN) regulations." | **[VERIFIED]** | Preserved. Accurately states that Beyond Financials is a fintech platform operating via licensed partners rather than claiming to be a standalone licensed commercial bank. |
| `src/data/servicesData.ts` (Investments FAQ) | "All future investment opportunities will be originated and managed by SEC-licensed asset managers, trustees, and authorized capital market operators in compliance with Nigerian securities law." | **[NEEDS CONFIRMATION]** | Preserved with clear "Future Roadmap" context. Explicitly disclaims that investment features are pre-launch and subject to SEC-licensed partner agreements. |
| `src/data/servicesData.ts` (Crypto FAQ) | "All future digital asset offerings will adhere strictly to Central Bank of Nigeria (CBN) banking guidelines, Securities and Exchange Commission (SEC) Virtual Asset Service Provider (VASP) rules..." | **[NEEDS CONFIRMATION]** | Preserved with explicit Phase 2 disclaimer. Live trading is disabled; presented strictly as roadmap conceptual vision. |
| `src/components/landing/SecuritySection.tsx` | "We adhere to Nigerian data protection standards and CBN cybersecurity guidelines." | **[REMOVED / SAFER WORDING APPLIED]** | Replaced with: *"Engineered with reference to Nigerian data protection principles (NDPA) and industry cybersecurity standards."* Avoids claiming formal regulatory certification before launch. |
| `src/pages/BankingPage.tsx` | "Tiered KYC verification matching Central Bank of Nigeria (CBN) regulatory guidelines" | **[VERIFIED]** | Preserved. Technical onboarding tiers follow standard Tier 1, 2, and 3 KYC validation frameworks. |

---

## 2. Financial Return & Guarantee Claims Audit

| Location | Referenced Topic | Classification | Compliance Status |
| :--- | :--- | :--- | :--- |
| `src/data/servicesData.ts` (Savings) | Yield & Savings returns | **[VERIFIED]** | No guaranteed interest rates or inflated percentage claims. Stated: *"Specific yield structures and partner terms will be published upon regulatory deployment. Beyond Financials does not promise speculative or guaranteed returns."* |
| `src/data/servicesData.ts` (Investments) | Investment profits | **[VERIFIED]** | Strictly disclaimed: *"No. All real investments carry market risk. Beyond Financials does not promise speculative or guaranteed returns."* |
| `src/data/servicesData.ts` (Credit) | Loan approvals | **[VERIFIED]** | Strictly disclaimed: *"Credit underwriting and loan facilities are subject to identity verification, affordability checks, and credit approval by licensed lending partners. We do not guarantee unconditional loan approvals."* |
| Website-wide | Zero risk / Guaranteed profits | **[VERIFIED]** | Zero instances of "zero risk", "guaranteed returns", "guaranteed approval", or "guaranteed profit" exist on the website. |

---

## 3. Superlative & Marketing Jargon Audit

| Prohibited Term / Pattern | Codebase Search Result | Status | Action Taken |
| :--- | :--- | :--- | :--- |
| `military-grade security` | 0 instances found | **[VERIFIED]** | Prohibited from all public copy. |
| `bank-grade security` | 0 instances found | **[VERIFIED]** | Prohibited. Replaced with objective architectural descriptions (server-side processing, role-based access, audit logging). |
| `100% secure` / `unhackable` | 0 instances found | **[VERIFIED]** | Prohibited. Security is framed as an ongoing engineering discipline. |
| `millions of customers` (Active) | 0 instances found | **[VERIFIED]** | No fabricated customer numbers or vanity metrics. |
| `billions in transactions` | 0 instances found | **[VERIFIED]** | No fabricated historical transaction volumes. |
| `lowest rates in Nigeria` | 0 instances found | **[VERIFIED]** | Prohibited. Unsubstantiated price comparison claims avoided. |
| `instant` (Overpromising) | Monitored | **[REMOVED / SAFER WORDING APPLIED]** | Replaced unconditional "instant" assertions with technically accurate descriptions (e.g., *"automated reconciliation"*, *"high-speed interbank settlement"*, *"real-time ledger updates"*). |

---

## 4. Privacy & Data Ethics Claims Audit

| Location | Topic | Classification | Compliance Status |
| :--- | :--- | :--- | :--- |
| `src/pages/LoansPage.tsx` | Contact list scraping | **[VERIFIED]** | Explicit commitment to zero phonebook scraping and zero contact harassment, adhering to Nigeria Data Protection Act (NDPA) requirements. |
| `server/routes/waitlist.ts` | PII Collection | **[VERIFIED]** | Strips sensitive financial identifiers (BVN, NIN, card PANs, passwords) from waitlist collection. |
| `src/pages/ContactPage.tsx` | Data input boundaries | **[VERIFIED]** | Explicitly instructs users not to enter financial secrets or personal verification numbers in enquiry forms. |

---

## 5. Summary of Actions & Guidance for Client
1. All public materials accurately reflect that Beyond Financials is in **active pre-launch development**.
2. No real financial services or transactions are claimed as currently operational.
3. Features requiring partner licensing (commercial banking, credit underwriting, investment distribution, cryptocurrency exchange) are explicitly documented as subject to licensed partner operating agreements.
4. Formal legal policies (`/privacy`, `/terms`) contain clear pre-launch advisory notices awaiting client legal counsel sign-off.
