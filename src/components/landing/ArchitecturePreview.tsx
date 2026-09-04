import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Layers,
  Database,
  Lock,
  Workflow,
  Server,
  ShieldCheck,
  Code2,
  Calendar,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const ArchitecturePreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'ledger' | 'adapters' | 'phase1'>('layers');

  return (
    <section id="architecture" className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Badge variant="blue" size="md">
            Architectural Blueprint
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Built on Rigorous Financial Engineering Principles
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
            Fintech applications demand strict auditability, security boundaries, and modular separation. We do not take shortcuts with financial state or provider coupling.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('layers')}
            className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'layers'
                ? 'bg-[#0046AD] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 border border-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Full-Stack Layering</span>
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-[#001B40] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 border border-gray-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Financial Ledger Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('adapters')}
            className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'adapters'
                ? 'bg-[#F59E0B] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 border border-gray-200'
            }`}
          >
            <Workflow className="w-4 h-4" />
            <span>Pluggable Provider Adapters</span>
          </button>
          <button
            onClick={() => setActiveTab('phase1')}
            className={`px-4 py-2.5 text-sm font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'phase1'
                ? 'bg-[#0046AD] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-slate-700 hover:bg-slate-100 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Phase 1 Scope & Timeline</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Visual Presentation */}
          <div className="lg:col-span-8">
            {activeTab === 'layers' && (
              <Card variant="muted" className="space-y-6 bg-[#F8FAFC] border border-gray-200/90">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-[#001B40]">
                    Clean 8-Tier Separation of Concerns
                  </h3>
                  <Badge variant="blue" size="sm">Strict Separation</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Business logic and secrets are strictly isolated on the backend. Client code handles presentation and user interactions without sensitive credential exposure.
                </p>

                <div className="space-y-3">
                  {[
                    { tier: '1. Presentation / UI', desc: 'React 19, Tailwind CSS, accessible components, and responsive mobile-first views.', color: 'border-l-4 border-l-[#0046AD]' },
                    { tier: '2. Frontend Logic', desc: 'State orchestration, client-side input validation, and asynchronous API communication.', color: 'border-l-4 border-l-sky-500' },
                    { tier: '3. Backend Server / Gateway', desc: 'Express Node.js runtime, sanitized request logging, CORS, and centralized error handling.', color: 'border-l-4 border-l-[#001B40]' },
                    { tier: '4. Domain & Business Rules', desc: 'Tiered KYC enforcement, transfer limits, loan workflows, savings calculations.', color: 'border-l-4 border-l-[#F59E0B]' },
                    { tier: '5. Financial Ledger Engine', desc: 'Double-entry immutable accounting, balance resolution, and transactional integrity.', color: 'border-l-4 border-l-emerald-600' },
                    { tier: '6. External Provider Adapters', desc: 'Vendor-agnostic interfaces for banking, KYC, payments, bills, and notifications.', color: 'border-l-4 border-l-indigo-600' },
                    { tier: '7. Security & Authentication', desc: 'Role-based access control (Super Admin, Ops, Merchant, Agent, Customer), token verification.', color: 'border-l-4 border-l-rose-600' },
                    { tier: '8. Audit & Compliance Logging', desc: 'Immutable audit trails, suspicious activity monitoring, and regulatory reporting exports.', color: 'border-l-4 border-l-purple-600' },
                  ].map((item, idx) => (
                    <div key={idx} className={`p-3.5 bg-white rounded-lg border border-gray-200 shadow-2xs ${item.color}`}>
                      <h4 className="text-sm font-bold text-[#001B40]">{item.tier}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'ledger' && (
              <Card variant="muted" className="space-y-6 bg-[#F8FAFC] border border-gray-200/90">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-[#001B40]">
                    Double-Entry Immutable Accounting
                  </h3>
                  <Badge variant="emerald" size="sm">Auditable & Non-Destructive</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  In a real financial platform, account balances are NEVER simply updated with raw SQL `balance = balance + X` statements. Balances are derived from immutable, signed credit and debit ledger entries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-xs font-bold uppercase text-gray-500">Supported Balance Types</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#0046AD]" /> Fiat Wallet Balances</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Flexible & Locked Savings</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]" /> Loan Principal & Liabilities</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Merchant Settlement Float</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Agent Commission Accounts</li>
                      <li className="flex items-center gap-1.5 text-gray-400"><CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Future Crypto & Investments</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2">
                    <span className="text-xs font-bold uppercase text-gray-500">Ledger Invariants</span>
                    <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Sum(Debits) === Sum(Credits)</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Append-only audit records</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Universal unique idempotency keys</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Automated reconciliation jobs</li>
                      <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Multi-currency precision arithmetic</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#001B40] text-slate-200 font-mono text-xs overflow-x-auto border border-white/10">
                  <p className="text-[#FBBF24] font-bold mb-1">// Conceptual Ledger Entry Representation</p>
                  <pre>{`interface LedgerEntry {
  id: string;              // Universally unique entry ID
  transactionId: string;   // Grouped double-entry reference
  accountId: string;       // User or system settlement account
  balanceType: BalanceType;// FIAT_WALLET | SAVINGS | LOAN
  direction: 'DEBIT' | 'CREDIT';
  amount: number;          // In smallest sub-unit (Kobo)
  currency: 'NGN';
  auditTrailId: string;    // Tamper-evident trace
}`}</pre>
                </div>
              </Card>
            )}

            {activeTab === 'adapters' && (
              <Card variant="muted" className="space-y-6 bg-[#F8FAFC] border border-gray-200/90">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-[#001B40]">
                    Vendor-Agnostic Adapter Pattern
                  </h3>
                  <Badge variant="amber" size="sm">Zero Lock-In</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  External fintech vendors (commercial banks, payment gateways, telco aggregators, identity verification providers) are not yet finalized. Our interfaces shield core business logic from third-party API changes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: 'BankingProvider', desc: 'Virtual account generation, NIBSS name inquiries, and interbank transfers.', status: 'Mock Active' },
                    { name: 'KYCProvider', desc: 'BVN validation, NIN verification, and facial selfie liveness scoring.', status: 'Mock Active' },
                    { name: 'PaymentProvider', desc: 'Card acquiring, direct debit authorization, and webhook settlement.', status: 'Mock Active' },
                    { name: 'BillPaymentProvider', desc: 'Telco airtime/data topups, Disco electricity tokens, and cable TV.', status: 'Mock Active' },
                    { name: 'NotificationProvider', desc: 'SMS OTP dispatch, email transaction receipts, and WhatsApp alerts.', status: 'Mock Active' },
                    { name: 'Crypto & Investment Providers', desc: 'Future liquidity and treasury interfaces (draft phase).', status: 'Future Scope' },
                  ].map((adapter, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-[#0046AD]">{adapter.name}</span>
                        <Badge variant="slate" size="sm">{adapter.status}</Badge>
                      </div>
                      <p className="text-xs text-gray-500">{adapter.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'phase1' && (
              <Card variant="muted" className="space-y-6 bg-[#F8FAFC] border border-gray-200/90">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display text-[#001B40]">
                    Contracted Phase 1 Implementation Context
                  </h3>
                  <Badge variant="emerald" size="sm">Agreed Scope</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-200 text-center space-y-1">
                    <span className="text-xs text-gray-500 font-semibold uppercase">Agreed Investment</span>
                    <p className="text-2xl font-extrabold font-display text-[#001B40]">₦3,500,000</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 text-center space-y-1">
                    <span className="text-xs text-gray-500 font-semibold uppercase">Estimated Delivery</span>
                    <p className="text-2xl font-extrabold font-display text-[#001B40]">8–10 Weeks</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 text-center space-y-1">
                    <span className="text-xs text-gray-500 font-semibold uppercase">Contracted Deliverables</span>
                    <p className="text-2xl font-extrabold font-display text-[#001B40]">45 Modules</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                  <h4 className="text-sm font-bold text-[#001B40]">Core Phase 1 Functional Modules</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    <div>&bull; Customer Registration & Tiered KYC</div>
                    <div>&bull; BVN, NIN, Selfie & Address Validation</div>
                    <div>&bull; Virtual Account Assignment & Wallets</div>
                    <div>&bull; Internal & Interbank Transfers</div>
                    <div>&bull; Flexible, Goal & Locked Savings</div>
                    <div>&bull; Loan Application & Repayment Tracking</div>
                    <div>&bull; Airtime, Data & Electricity Bills</div>
                    <div>&bull; Merchant Onboarding & Settlements</div>
                    <div>&bull; Agency Banking Cash-in / Cash-out</div>
                    <div>&bull; AML Monitoring & Super Admin RBAC</div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Architectural Highlights */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#001B40] border border-[#06285A] text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-[#FBBF24]">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="text-base font-bold font-display">Security by Architecture</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Client Secrets:</strong> All provider tokens, keys, and credentials remain strictly server-side.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span><strong>Sanitized Logging:</strong> Sensitive PII (BVN, NIN, passwords) is automatically redacted from server logs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span><strong>Double Validation:</strong> Every form input is validated on both client and Express backend before processing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                  <span><strong>No Mock Confusion:</strong> All simulated test adapters are explicitly labeled MOCK/DEV ONLY.</span>
                </li>
              </ul>
            </div>

            <Card variant="default" className="space-y-3 border border-gray-200/90 bg-white">
              <div className="flex items-center gap-2 text-[#001B40]">
                <FileText className="w-5 h-5 text-[#0046AD]" />
                <h4 className="text-base font-bold font-display">Incremental Development</h4>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                This initial foundation establishes the project structure, design system tokens, Express full-stack boundary, and early waitlist acquisition shell.
              </p>
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-gray-200 text-xs text-slate-700 font-mono">
                beyondfinancials.ng &bull; Foundation v1.0
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
