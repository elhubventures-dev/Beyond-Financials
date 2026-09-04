import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from '../../router/Router';
import {
  Landmark,
  PiggyBank,
  HandCoins,
  ReceiptText,
  Store,
  Users2,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { ServiceStatus, SERVICE_STATUS_LABELS } from '../../theme/tokens';

interface ServiceItem {
  id: string;
  slug?: string;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  status: ServiceStatus;
  features: string[];
  scopeNote: string;
}

const SERVICES_CATALOG: ServiceItem[] = [
  {
    id: 'banking',
    slug: 'banking',
    title: 'Digital Accounts & Wallets',
    category: 'Core Banking',
    description:
      'Dedicated individual and business virtual accounts with tiered regulatory limits, instant internal transfers, and NIBSS interbank routing.',
    icon: <Landmark className="w-6 h-6 text-blue-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Tier 1 to Tier 3 verified accounts',
      'Dedicated virtual account numbers',
      'Instant interbank transfers',
      'Real-time transaction notifications',
    ],
    scopeNote: 'Active in Phase 1 contracted implementation.',
  },
  {
    id: 'savings',
    slug: 'savings',
    title: 'Disciplined & Goal Savings',
    category: 'Wealth Accumulation',
    description:
      'Flexible, locked, and scheduled target savings plans designed to build sustainable financial reserves with transparent interest mechanics.',
    icon: <PiggyBank className="w-6 h-6 text-emerald-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Flexible daily/weekly savings',
      'Target goal-based lock vaults',
      'Automated scheduled auto-save',
      'Protected double-entry balance isolation',
    ],
    scopeNote: 'Active in Phase 1 contracted implementation.',
  },
  {
    id: 'loans',
    slug: 'loans',
    title: 'Structured Credit & Loans',
    category: 'Financing',
    description:
      'Configurable personal financing and business working-capital loans with auditable application workflows, disbursement, and repayment schedules.',
    icon: <HandCoins className="w-6 h-6 text-amber-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Structured application workflow',
      'Salary advance & SME facilities',
      'Automated repayment schedules',
      'Transparent upfront disclosures',
    ],
    scopeNote: 'Active in Phase 1 contracted implementation.',
  },
  {
    id: 'bills',
    slug: 'payments',
    title: 'Utility & Bill Payments',
    category: 'Payments',
    description:
      'Instant airtime, mobile data, prepaid/postpaid electricity tokens, cable TV, and state government/educational payments.',
    icon: <ReceiptText className="w-6 h-6 text-indigo-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'MTN, Airtel, Glo, 9mobile top-ups',
      'Direct Disco electricity validation',
      'DStv, GOtv, StarTimes subscriptions',
      'Automated receipt generation',
    ],
    scopeNote: 'Active in Phase 1 contracted implementation.',
  },
  {
    id: 'merchants',
    title: 'Merchant Collections & Settlement',
    category: 'Commerce',
    description:
      'Business onboarding, collections via virtual accounts and payment links, automated settlement cycles, and consolidated sales reporting.',
    icon: <Store className="w-6 h-6 text-teal-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Business KYC verification',
      'Custom payment collection links',
      'Automated batch settlement',
      'Comprehensive accounting exports',
    ],
    scopeNote: 'Active in Phase 1 contracted implementation.',
  },
  {
    id: 'agents',
    title: 'Agency Banking & Cash Flow',
    category: 'Inclusion',
    description:
      'Neighborhood agent network tools for over-the-counter cash-in, cash-out, customer verification, and transparent commission accounting.',
    icon: <Users2 className="w-6 h-6 text-blue-800" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Agent float wallet management',
      'Cash-in & cash-out processing',
      'Real-time commission ledger',
      'Agent performance reporting',
    ],
    scopeNote: 'Active in Phase 1 contracted implementation.',
  },
  {
    id: 'investments',
    slug: 'investments',
    title: 'Investment Portfolios',
    category: 'Future Capabilities',
    description:
      'Curated capital market opportunities, treasury bills, and wealth management portfolios in regulated partnership.',
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
    status: 'FUTURE_ROADMAP',
    features: [
      'Regulated asset classes',
      'Risk profile assessments',
      'Automated portfolio tracking',
      'Transparent disclosure standards',
    ],
    scopeNote: 'Future strategic roadmap. Currently on early waitlist.',
  },
  {
    id: 'crypto',
    slug: 'crypto',
    title: 'Digital Assets & Crypto Treasury',
    category: 'Future Capabilities',
    description:
      'Future-ready digital currency liquidity, deposits, withdrawals, and multi-asset wallet funding subject to regulatory framework approval.',
    icon: <Coins className="w-6 h-6 text-amber-500" />,
    status: 'FUTURE_ROADMAP',
    features: [
      'Multi-currency asset treasury',
      'Cryptocurrency account funding',
      'Institutional custody standards',
      'Strict AML/CFT monitoring',
    ],
    scopeNote: 'Future strategic roadmap. Not currently active.',
  },
];

interface PillarsSectionProps {
  onOpenWaitlist: (category?: string) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({ onOpenWaitlist }) => {
  const [filter, setFilter] = useState<'all' | 'phase1' | 'future'>('all');

  const filteredServices = SERVICES_CATALOG.filter((item) => {
    if (filter === 'phase1') return item.status === 'AVAILABLE_PHASE1';
    if (filter === 'future') return item.status === 'FUTURE_ROADMAP' || item.status === 'COMING_SOON';
    return true;
  });

  return (
    <section id="services" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Product Architecture Catalog
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Designed as a Unified Financial Ecosystem
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
              Every product component is engineered to link into our centralized ledger and customer relationship architecture. We clearly distinguish between contracted Phase 1 deliverables and future roadmap capabilities.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0046AD] text-white text-xs sm:text-sm font-bold hover:bg-[#003B94] transition-colors shadow-2xs self-start md:self-auto"
          >
            <span>Explore Services Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#0046AD] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
            }`}
          >
            All Services ({SERVICES_CATALOG.length})
          </button>
          <button
            onClick={() => setFilter('phase1')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'phase1'
                ? 'bg-[#001B40] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
            }`}
          >
            Phase 1 Contracted Scope (6)
          </button>
          <button
            onClick={() => setFilter('future')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'future'
                ? 'bg-[#FBBF24] text-[#001B40] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
            }`}
          >
            Future Strategic Scope (2)
          </button>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredServices.map((service) => {
            const statusConfig = SERVICE_STATUS_LABELS[service.status];
            const isFuture = service.status === 'FUTURE_ROADMAP';

            return (
              <Card
                key={service.id}
                variant="default"
                className="flex flex-col justify-between hover:border-[#0046AD]/40 hover:shadow-md transition-all group border border-gray-200/90 bg-white"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100 text-[#0046AD]">
                      {service.icon}
                    </div>
                    <Badge variant={statusConfig.variant} size="sm" dot>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0046AD]">
                      {service.category}
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#001B40]">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-normal">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0046AD] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Action */}
                <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between gap-2">
                  {service.slug ? (
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-xs font-bold text-[#0046AD] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore Overview</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">
                      {service.scopeNote}
                    </span>
                  )}
                  <Button
                    variant={isFuture ? 'outline' : 'ghost'}
                    size="sm"
                    onClick={() => onOpenWaitlist(service.id)}
                    className="text-xs font-bold text-[#0046AD]"
                  >
                    {isFuture ? 'Join Waitlist' : 'Early Access'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
