/**
 * Beyond Financials - About Us & Mission Architecture
 * 
 * Route: /about
 * Purpose: Deliver crystal-clear institutional context, vision, and principles
 * without inventing fake metrics, fabricated founders, or unearned awards.
 */

import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Link } from '../router/Router';
import {
  Compass,
  Target,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  Scale,
  HeartHandshake,
  CheckCircle2,
  Clock,
  Landmark,
  PiggyBank,
  HandCoins,
  ReceiptText,
} from 'lucide-react';

interface AboutPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenWaitlist }) => {
  const problemsAndSolutions = [
    {
      problem: 'Fragmented Financial Accounts',
      problemDesc:
        'Nigerians typically manage 3 to 6 disparate apps for bank transfers, goal savings, credit applications, and utility bills—leading to scattered balances and lost visibility.',
      solution: 'One Unified Financial Relationship',
      solutionDesc:
        'A single verified customer profile connected to a unified double-entry ledger that coordinates banking, disciplined savings, loans, and payments effortlessly.',
    },
    {
      problem: 'Predatory & Harassing Lending Practices',
      problemDesc:
        'Unethical quick-loan apps resort to contact list scraping, hidden compounding penalties, and defamatory intimidation when cash flows are misaligned.',
      solution: 'Ethical, Transparent Credit Underwriting',
      solutionDesc:
        'Transparent interest calculations, zero phonebook harvesting, capped fees, and clear repayment schedules tailored to real salary and cash inflow cycles.',
    },
    {
      problem: 'Leaking Balances & Undisciplined Savings',
      problemDesc:
        'When savings sit in standard transactional accounts, impulsive spending and frequent debits erode emergency buffers and long-term financial goals.',
      solution: 'Automated & Locked Goal Vaults',
      solutionDesc:
        'Isolated savings pockets with automated rounding rules, structured deposit schedules, and emergency protection that help build genuine financial resilience.',
    },
    {
      problem: 'Opaque Fees & Unreliable Bill Settlement',
      problemDesc:
        'Hidden maintenance levies and failed utility purchases leave families in the dark without electricity tokens or instant transaction receipts.',
      solution: 'Direct Biller Connectivity & Zero Maintenance Leaks',
      solutionDesc:
        'Reliable payment gateways with instant digital receipts, token generation, and transparent ledger reconciliation across all major Nigerian billers.',
    },
  ];

  const foundationalPrinciples = [
    {
      icon: <Layers className="w-5 h-5 text-[#0046AD]" />,
      title: 'Architectural Simplicity',
      desc: 'We eliminate unnecessary multi-app clutter by consolidating essential personal and business financial capabilities into one cohesive experience.',
    },
    {
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      title: 'Radical Transparency',
      desc: 'No hidden maintenance fees, no surprise debit deductions, and no ambiguous terms. What you see is precisely what is debited or credited.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Security by Design',
      desc: 'From server-side credential isolation to auditable double-entry accounting, customer asset safety is engineered into the system foundation.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-teal-600" />,
      title: 'Ethical Responsibility',
      desc: 'We strictly reject predatory lending, aggressive debt collection tactics, and speculative promises. We treat customer dignity as non-negotiable.',
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: 'Inclusive Accessibility',
      desc: 'Tiered KYC onboarding (Tier 1 through Tier 3) meets users at their current level of documentation while maintaining regulatory compliance.',
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: 'Reliable Settlement',
      desc: 'Engineered for high availability, our payment routing and interbank integrations prioritize fast, verifiable transaction completion.',
    },
  ];

  const targetAudiences = [
    {
      title: 'Everyday Consumers & Savers',
      desc: 'Individuals seeking a reliable primary digital wallet with automated goal vaults and dependable utility bill payments.',
      badge: 'Retail',
    },
    {
      title: 'Salary Earners & Civil Servants',
      desc: 'Working professionals needing seamless salary allocation, emergency overdraft buffers, and disciplined monthly savings.',
      badge: 'Employed',
    },
    {
      title: 'Entrepreneurs & Small Businesses',
      desc: 'Sole proprietors and growing ventures requiring dedicated commercial virtual accounts, transparent working capital, and fast settlement.',
      badge: 'Business',
    },
    {
      title: 'Agency Banking Operators',
      desc: 'Neighborhood financial agents managing liquidity float, POS settlements, and cash-in/cash-out services for their communities.',
      badge: 'Agency',
    },
    {
      title: 'Students & Young Adults',
      desc: 'First-time account holders building foundational financial discipline with zero monthly account maintenance fees.',
      badge: 'Next Gen',
    },
    {
      title: 'Future Global Earners',
      desc: 'Remote professionals and cross-border freelancers preparing for upcoming digital asset liquidation and international remittance channels.',
      badge: 'Roadmap',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="About Beyond Financials - One Financial Ecosystem for Nigeria"
        description="Learn about Beyond Financials: our vision, ethical principles, and architectural commitment to unifying banking, savings, loans, and payments across Nigeria."
        canonicalPath="/about"
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-linear-to-b from-[#001B40] to-[#002866] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="md">
                About Beyond Financials
              </Badge>
              <span className="text-xs font-mono text-blue-200">
                Phase 1 Pre-Launch Foundation
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Financial services designed around{' '}
              <span className="text-[#FBBF24]">real financial lives</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              We are building a unified, transparent, and disciplined financial ecosystem for Nigeria—bringing digital banking, smart savings, ethical credit, and everyday payments into one single, dependable relationship.
            </p>
          </div>

          {/* Quick Metrics / Focus Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Ecosystem Model</div>
              <div className="text-lg font-bold text-white mt-1">Unified Multi-Service</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Ledger Standard</div>
              <div className="text-lg font-bold text-white mt-1">Double-Entry Immutable</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Credit Ethos</div>
              <div className="text-lg font-bold text-white mt-1">Zero Contact Scraping</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Current Milestone</div>
              <div className="text-lg font-bold text-white mt-1">Phase 1 Engineering</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="py-20 bg-[#F8FAFC] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Vision Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0046AD]">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0046AD]">
                  Our Long-Term Vision
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#001B40]">
                  One Account. Every Financial Need.
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  We envision a financial landscape where everyday Nigerians and growing businesses no longer have to navigate fragmented apps, unpredictable fee structures, or opaque lending terms. By engineering a unified platform anchored by an auditable ledger, Beyond Financials provides the foundational infrastructure for lifelong financial health and business stability.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-gray-200 shadow-xs space-y-6">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                  Our Engineering Mission
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#001B40]">
                  Bridging Gaps with Ethical Technology
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  Our mission is to engineer modern, highly accessible financial tools that respect customer dignity. We build software that simplifies daily transactions, encourages disciplined capital accumulation, provides transparent working credit, and bridges the gap to future digital asset and investment opportunities under compliant partner frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Our Solution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              The Need for Beyond Financials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Why We Are Building Beyond Financials
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Nigeria’s financial technology sector has expanded rapidly, yet significant structural pain points remain for consumers and business owners. Here is how we address them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problemsAndSolutions.map((item, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl border border-gray-200/90 bg-white hover:border-[#0046AD]/30 transition-all space-y-6 shadow-2xs"
              >
                {/* Problem Box */}
                <div className="space-y-2 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      The Current Friction
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#001B40]">
                    {item.problem}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.problemDesc}
                  </p>
                </div>

                {/* Solution Box */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      The Beyond Financials Approach
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#001B40]">
                    {item.solution}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.solutionDesc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundational Principles */}
      <section className="py-20 bg-[#F8FAFC] border-t border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="blue" size="md">
              Our Core Operating Tenets
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Principles That Guide Every Feature
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Technology choices, product rules, and partner selections are governed by six foundational commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundationalPrinciples.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4 hover:border-[#0046AD]/30 transition-colors"
              >
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-gray-200 w-fit">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#001B40]">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Building For */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Ecosystem Reach
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Who We Serve Across Nigeria
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Beyond Financials is engineered for the diverse economic landscape of Nigerian households, workers, and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudiences.map((aud, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-gray-200 bg-white space-y-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {aud.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">Segment {idx + 1}</span>
                </div>
                <h3 className="text-base font-bold text-[#001B40]">
                  {aud.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {aud.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap & Regulatory Transparency Notice */}
      <section className="py-16 bg-[#F8FAFC] border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-blue-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-[#0046AD]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#001B40]">
                  Pre-Launch Roadmap & Regulatory Transparency
                </h3>
                <p className="text-xs text-slate-500">
                  Documented development milestones and partner integration standards
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0046AD]">
                    Milestone 1 (Active)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    In Progress
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#001B40]">Phase 1 Core Banking & Payments</h4>
                <p className="text-xs text-slate-500">
                  Virtual accounts, tiered KYC, interbank transfers, disciplined savings vaults, structured loans, and everyday utility bill settlement.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Milestone 2
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Roadmap
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#001B40]">Investments & Capital Markets</h4>
                <p className="text-xs text-slate-500">
                  Curated investment portfolios in partnership with SEC-licensed asset managers, commercial paper, and fixed income funds with zero speculative promises.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Milestone 3
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Roadmap
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#001B40]">Digital Assets & Remittance</h4>
                <p className="text-xs text-slate-500">
                  Compliant stablecoin settlement, merchant cross-border liquidation, and global remittance under CBN and SEC digital asset regulatory frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="py-20 bg-[#001B40] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Join the Movement
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
              Be Part of Nigeria’s Unified Financial Future
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join the priority early access list today to receive your dedicated virtual account with zero maintenance fees upon launch.
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
              to="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base transition-colors border border-white/20 flex items-center justify-center gap-2"
            >
              <span>Explore Services Hub</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
