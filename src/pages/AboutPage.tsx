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
        'A single profile for banking, savings, loans, and payments, so your money is easier to understand.',
    },
    {
      problem: 'Predatory & Harassing Lending Practices',
      problemDesc:
        'Unethical quick-loan apps resort to contact list scraping, hidden compounding penalties, and defamatory intimidation when cash flows are misaligned.',
      solution: 'Ethical, Transparent Credit Underwriting',
      solutionDesc:
        'Clear terms before you accept a loan, and a commitment not to contact your friends or family about your finances.',
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
      solution: 'Payments you can follow',
      solutionDesc:
        'Airtime, power, television, and other bills in the same place as your money, with a result you can see. Payments are not live yet.',
    },
  ];

  const foundationalPrinciples = [
    {
      icon: <Layers className="w-5 h-5 text-[#0046AD]" />,
      title: 'Simplicity',
      desc: 'Essential money services in one experience, instead of a pile of separate apps.',
    },
    {
      icon: <Scale className="w-5 h-5 text-amber-600" />,
      title: 'Radical Transparency',
      desc: 'No hidden maintenance fees, no surprise debit deductions, and no ambiguous terms. What you see is precisely what is debited or credited.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Security-conscious design',
      desc: 'Secure access, identity checks, and careful handling of personal information are part of how the service is being shaped.',
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-teal-600" />,
      title: 'Ethical Responsibility',
      desc: 'We strictly reject predatory lending, aggressive debt collection tactics, and speculative promises. We treat customer dignity as non-negotiable.',
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: 'Inclusive Accessibility',
      desc: 'We will explain identity checks before they are required, and we will not ask for more than a service needs.',
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      title: 'Dependable service',
      desc: 'Transfers and payments are being designed so you can tell whether they completed.',
    },
  ];

  const targetAudiences = [
    {
      title: 'Everyday Consumers & Savers',
      desc: 'People who want a digital account, goal savings, and everyday bill payments when those services open.',
      badge: 'Retail',
    },
    {
      title: 'Salary Earners & Civil Servants',
      desc: 'Working professionals who want salary, savings, and future financing to live in one relationship.',
      badge: 'Employed',
    },
    {
      title: 'Entrepreneurs & Small Businesses',
      desc: 'Owners who want business collections and a clearer view of money coming in.',
      badge: 'Business',
    },
    {
      title: 'Agency Banking Operators',
      desc: 'Neighbourhood agents who help people nearby access and move money.',
      badge: 'Agency',
    },
    {
      title: 'Students & Young Adults',
      desc: 'People opening their first serious financial relationship and learning to set money aside. Fees, if any, will be published before launch.',
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
        description="Beyond Financials is preparing a connected financial platform for people and businesses in Nigeria. Read our vision, who we serve, and the values behind the company."
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
              <span className="text-xs font-semibold text-blue-200">
                Pre-launch
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
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Who it is for</div>
              <div className="text-lg font-bold text-white mt-1">People & businesses</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Experience</div>
              <div className="text-lg font-bold text-white mt-1">One relationship</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Credit ethos</div>
              <div className="text-lg font-bold text-white mt-1">No contact scraping</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Today</div>
              <div className="text-lg font-bold text-white mt-1">Preparing to launch</div>
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
                  We want people and businesses in Nigeria to manage more of their financial life in one place, without guessing at terms or jumping between disconnected apps. Beyond Financials is that experience, and it is still preparing to launch.
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
                  Our mission
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#001B40]">
                  Financial tools that respect people
                </h2>
                <p className="text-slate-600 leading-relaxed text-base">
                  We are building services that make everyday money clearer, encourage saving, and treat credit with dignity. Investments and digital assets are part of the longer vision, and they are not available yet.
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
              Technology, product choices, and partnerships are guided by these commitments.
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
              Beyond Financials is for households, workers, and businesses across Nigeria, with room to serve people whose lives reach beyond the country.
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
                  What you can expect
                </h3>
                <p className="text-xs text-slate-500">
                  A customer view of what is happening now, and what comes later
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0046AD]">
                    Now
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Open
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#001B40]">Join the waitlist</h4>
                <p className="text-xs text-slate-500">
                  Tell us which services matter to you. We will share launch updates. This does not open an account.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Coming soon
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Preparing
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#001B40]">Banking, savings, loans, and payments</h4>
                <p className="text-xs text-slate-500">
                  Everyday money services are being prepared. They are not available to use yet.
                </p>
              </div>

              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Later
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Planned
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#001B40]">Investments and digital assets</h4>
                <p className="text-xs text-slate-500">
                  Wealth tools and digital-asset services are part of the longer vision. We do not show products, prices, or returns.
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
              Join the waitlist to hear when Beyond Financials opens. A place on the list is not an account and not a loan approval.
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
