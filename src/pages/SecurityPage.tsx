/**
 * Beyond Financials - Security, Architecture & Data Protection
 * 
 * Route: /security
 * Purpose: Provide deep, technically honest, and grounded insight into how
 * Beyond Financials safeguards customer funds, personal data, and ledger integrity.
 */

import React, { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Link } from '../router/Router';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck,
  EyeOff,
  Server,
  Layers,
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
} from 'lucide-react';

interface SecurityPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onOpenWaitlist }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const securityPillars = [
    {
      icon: <Database className="w-6 h-6 text-[#0046AD]" />,
      title: 'Double-Entry Immutable Ledger',
      subtitle: 'Transactional Integrity',
      description:
        'Every financial event produces paired, balanced debit and credit ledger entries. Balances are derived mathematically from an immutable event trail, preventing ghost balances and balance drifting.',
      bullets: [
        'Strict debits = credits invariant',
        'Append-only event log',
        'State-machine reconciliation prevents double-spending',
      ],
    },
    {
      icon: <EyeOff className="w-6 h-6 text-amber-600" />,
      title: 'Zero Secrets in Client Memory',
      subtitle: 'Key Isolation',
      description:
        'All partner API keys, signing certificates, payment provider tokens, and webhook secrets reside strictly within server-side environment boundaries. No secret material is ever sent to browser memory.',
      bullets: [
        'Backend proxy for all third-party integrations',
        'Encapsulated runtime environment variables',
        'Zero API keys in web or mobile client builds',
      ],
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
      title: 'Tiered KYC & Identity Verification',
      subtitle: 'Fraud Prevention',
      description:
        'User onboarding is structured into progressive regulatory tiers (Tier 1 through Tier 3) that validate identity against official government registries while preventing synthetic identity fraud.',
      bullets: [
        'Real-time BVN & NIN verification via secure provider gateways',
        'Liveness biometric checks for elevated tiers',
        'Automated sanctions & AML/CFT screening',
      ],
    },
    {
      icon: <FileCheck className="w-6 h-6 text-teal-600" />,
      title: 'PII Sanitization & Data Minimization',
      subtitle: 'Privacy Protection',
      description:
        'We adhere to Nigeria Data Protection Act (NDPA) requirements. Sensitive identifiers like BVN, NIN, card PANs, and passwords are automatically redacted before logs are written to disk.',
      bullets: [
        'Automatic regex redaction in application loggers',
        'Strictly purpose-limited data collection',
        'Zero phonebook scraping or contact list harvesting',
      ],
    },
    {
      icon: <KeyRound className="w-6 h-6 text-indigo-600" />,
      title: 'Granular Role-Based Access (RBAC)',
      subtitle: 'Internal Controls',
      description:
        'Internal administrative systems enforce strict separation of duties. Customer support agents cannot execute manual balance adjustments or view unmasked confidential credentials.',
      bullets: [
        'Separation of Super Admin, Operations, and Support roles',
        'Dual-approval requirement for high-value administrative actions',
        'Immutable audit logs tracking all staff interactions',
      ],
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-blue-600" />,
      title: 'Pluggable Provider Resilience',
      subtitle: 'Fault Tolerance',
      description:
        'Our service adapter architecture insulates customer transactions from third-party outages. If a primary interbank switch experiences latency, transactions gracefully fail over or queue safely.',
      bullets: [
        'Automated retry mechanisms with exponential backoff',
        'Idempotency keys prevent duplicate bill settlements',
        'Circuit-breaker protection during upstream downtime',
      ],
    },
  ];

  const securityFaqs = [
    {
      q: 'Does Beyond Financials store my BVN, NIN, or card PIN in plain text?',
      a: 'No. Beyond Financials does not store unencrypted BVN, NIN, or card PINs. Identity numbers are verified against official regulatory registries via licensed partners, and sensitive identifiers are masked and protected using industry standard encryption algorithms.',
    },
    {
      q: 'Does Beyond Financials access or harvest my mobile contact list?',
      a: 'Strictly no. Unlike predatory loan apps, Beyond Financials will NEVER request access to your phone contacts, scrape your call logs, or contact your friends and family. We believe privacy is a fundamental human right.',
    },
    {
      q: 'How does Beyond Financials prevent duplicate charges or failed transfers?',
      a: 'Every payment, transfer, and utility purchase is assigned a cryptographically unique idempotency key. If a network interruption occurs during transmission, the server recognizes the retry and prevents duplicate debits while completing reconciliation.',
    },
    {
      q: 'What should I do if I discover a potential security vulnerability?',
      a: 'We welcome responsible security research. If you discover a suspected vulnerability, please report it directly to our security engineering team at security@beyondfinancials.ng. We ask that you allow reasonable time for remediation before public disclosure.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Security & Data Protection Architecture - Beyond Financials"
        description="Explore the security engineering behind Beyond Financials: immutable double-entry ledger, zero client secrets, PII-sanitized logging, and ethical data privacy."
        canonicalPath="/security"
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-linear-to-b from-[#001B40] to-[#002866] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="md">
                Security Architecture
              </Badge>
              <span className="text-xs font-mono text-blue-200">
                Continuous Protection
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Security engineered into{' '}
              <span className="text-[#FBBF24]">every layer</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Trust in digital finance is earned through rigorous architectural design, complete transparency, and relentless data hygiene—never through marketing slogans or unearned claims.
            </p>
          </div>

          {/* Key Standards Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Data Privacy</div>
              <div className="text-lg font-bold text-white mt-1">NDPA Alignment</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Client Secrets</div>
              <div className="text-lg font-bold text-white mt-1">Zero in Browser</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Ledger Accounting</div>
              <div className="text-lg font-bold text-white mt-1">Double-Entry Core</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Contact Policy</div>
              <div className="text-lg font-bold text-white mt-1">Zero Harvesting</div>
            </div>
          </div>
        </div>
      </section>

      {/* Deep Architecture Grid */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Core Safeguards
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Six Structural Pillars of Platform Protection
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              We design our financial infrastructure around the assumption that security must be verifiable, auditable, and resilient to failure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityPillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-5 hover:border-[#0046AD]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-gray-200 w-fit">
                    {pillar.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0046AD]">
                      {pillar.subtitle}
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#001B40] mt-1">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  {pillar.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Anti-Harassment Commitment */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#001B40] text-white space-y-8">
            <div className="max-w-3xl space-y-4">
              <Badge variant="warning" size="md">
                Our Ethical Guarantee
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                Zero Contact List Scraping. Zero Defamation.
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Many unregulated digital lenders in Nigeria engage in aggressive contact scraping to intimidate borrowers during debt recovery. Beyond Financials completely rejects this abusive model.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-base font-bold text-white">No Phonebook Permission</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our application will never request access to your device contact lists or address book. Your personal social circle is private.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-base font-bold text-white">No Third-Party Harassment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We will never call, message, or broadcast notices to your family, employers, or friends under any circumstances.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-base font-bold text-white">Transparent Recovery</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Credit management is conducted respectfully with flexible restructuring plans and clear notices directly with the borrower.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security FAQs */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="blue" size="md">
              Security FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40]">
              Frequently Asked Security Questions
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Straightforward answers about how we manage data protection and account safety.
            </p>
          </div>

          <div className="space-y-4">
            {securityFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-[#001B40] pr-4">
                      {faq.q}
                    </h3>
                    <div className="p-1.5 rounded-full bg-blue-50 text-[#0046AD] shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-gray-100 bg-[#F8FAFC]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Responsible Disclosure & Security Contact */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#0046AD]" />
                <h3 className="text-lg font-bold text-[#001B40]">
                  Responsible Vulnerability Disclosure
                </h3>
              </div>
              <p className="text-sm text-slate-600 max-w-xl">
                We take all security reports seriously. If you have identified a vulnerability or security issue, please contact our security team at{' '}
                <span className="font-mono font-semibold text-[#0046AD]">security@beyondfinancials.ng</span>.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-[#0046AD] text-white font-bold text-sm hover:bg-blue-800 transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Contact Security Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Waitlist CTA Banner */}
      <section className="py-20 bg-[#001B40] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Priority Early Access
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
              Join a Platform Built on Real Security
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Experience modern digital banking, disciplined savings, and transparent credit built on an immutable ledger foundation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenWaitlist()}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FBBF24] text-[#001B40] font-bold text-base hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/about"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base transition-colors border border-white/20 flex items-center justify-center gap-2"
            >
              <span>Learn About Our Vision</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
