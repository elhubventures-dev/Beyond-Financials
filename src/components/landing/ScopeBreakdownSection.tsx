import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Clock,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ScopeBreakdownSectionProps {
  onOpenWaitlist: () => void;
}

export const ScopeBreakdownSection: React.FC<ScopeBreakdownSectionProps> = ({ onOpenWaitlist }) => {
  const phase1Modules = [
    {
      group: 'Identity & Tiered Onboarding',
      items: [
        'Customer Registration & Phone OTP',
        'Tiered KYC (Tier 1, Tier 2, Tier 3)',
        'BVN & NIN Verification Workflows',
        'Facial Selfie Liveness Verification',
        'Proof of Address & Utility Validation',
      ],
    },
    {
      group: 'Accounts, Wallets & Transfers',
      items: [
        'Dedicated NUBAN Virtual Accounts',
        'Multi-Balance Wallet Architecture',
        'Internal Instant P2P Transfers',
        'NIBSS Interbank Transfer Routing',
        'Real-time Transaction History & PDF Receipts',
      ],
    },
    {
      group: 'Savings & Wealth Accumulation',
      items: [
        'Flexible Automated Daily/Weekly Savings',
        'Goal-Based Target Savings Vaults',
        'Strict Locked Fixed Savings Plans',
        'Automated Scheduled Round-Ups & Debits',
      ],
    },
    {
      group: 'Lending & Credit Engine',
      items: [
        'Personal Salary Advance Applications',
        'SME Working Capital Loan Workflows',
        'Automated Repayment Schedule Engine',
        'Default & Delinquency Tracking',
      ],
    },
    {
      group: 'Payments, Bills & Commerce',
      items: [
        'Airtime & Mobile Data Top-ups (MTN, Airtel, Glo, 9mobile)',
        'Prepaid & Postpaid Disco Electricity Tokens',
        'Cable TV (DStv, GOtv, StarTimes)',
        'Merchant Onboarding & Payment Links',
        'Agency Banking Cash-in / Cash-out & Floats',
      ],
    },
    {
      group: 'Operations, AML & Super Admin',
      items: [
        'Role-Based Access Control (RBAC)',
        'AML & Suspicious Transaction Alerts',
        'Immutable Financial Audit Trail Engine',
        'Customer Dispute Resolution & Ticketing',
        'Finance Operations Settlement Dashboard',
      ],
    },
  ];

  return (
    <section id="phase1-scope" className="py-20 bg-[#001B40] text-white border-t border-[#06285A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold uppercase tracking-wider">
              Phase 1 Deliverables Blueprint
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              45 Contracted Phase 1 Capabilities
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Transparent breakdown of the 8–10 week milestone scope with ₦3,500,000 investment baseline. Every module connects to the core ledger.
            </p>
          </div>

          <button
            onClick={onOpenWaitlist}
            className="bg-[#FBBF24] text-[#001B40] px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-sm cursor-pointer self-start md:self-auto flex-shrink-0 flex items-center gap-2"
          >
            <span>Join Early Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phase1Modules.map((module, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold font-display text-[#FBBF24]">
                  {module.group}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#0046AD] text-white text-[11px] font-bold">
                  Phase 1
                </span>
              </div>

              <ul className="space-y-2.5">
                {module.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
