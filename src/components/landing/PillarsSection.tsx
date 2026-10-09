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
      'Accounts, wallets, and transfers for everyday money, with a clear history of what comes in and what goes out.',
    icon: <Landmark className="w-6 h-6 text-blue-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Tier 1 to Tier 3 verified accounts',
      'Dedicated virtual account numbers',
      'Instant interbank transfers',
      'Real-time transaction notifications',
    ],
    scopeNote: 'Coming soon. Not available yet.',
  },
  {
    id: 'savings',
    slug: 'savings',
    title: 'Disciplined & Goal Savings',
    category: 'Wealth Accumulation',
    description:
      'Goal savings, flexible savings, and planned set-asides to help you build a steadier habit. Rates are not published.',
    icon: <PiggyBank className="w-6 h-6 text-emerald-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Flexible daily/weekly savings',
      'Target goal-based lock vaults',
      'Automated scheduled auto-save',
      'A clear view of money set aside from everyday spending',
    ],
    scopeNote: 'Coming soon. Not available yet.',
  },
  {
    id: 'loans',
    slug: 'loans',
    title: 'Structured Credit & Loans',
    category: 'Financing',
    description:
      'Responsible financing for salary earners, civil servants, entrepreneurs, and households. Terms will be published only when they are confirmed.',
    icon: <HandCoins className="w-6 h-6 text-amber-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Structured application workflow',
      'Salary advance & SME facilities',
      'Automated repayment schedules',
      'Transparent upfront disclosures',
    ],
    scopeNote: 'Coming soon. Not available yet.',
  },
  {
    id: 'bills',
    slug: 'payments',
    title: 'Utility & Bill Payments',
    category: 'Payments',
    description:
      'Airtime, data, electricity, cable TV, internet, and other everyday bills — when payments open.',
    icon: <ReceiptText className="w-6 h-6 text-indigo-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'MTN, Airtel, Glo, 9mobile top-ups',
      'Electricity and other household bills',
      'DStv, GOtv, StarTimes subscriptions',
      'Automated receipt generation',
    ],
    scopeNote: 'Coming soon. Not available yet.',
  },
  {
    id: 'merchants',
    title: 'Merchant Collections & Settlement',
    category: 'Commerce',
    description:
      'A simpler way for businesses to collect payments and see what they have earned.',
    icon: <Store className="w-6 h-6 text-teal-600" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'A business profile separate from personal spending',
      'Payment collection links',
      'A clear view of money received',
      'Records you can keep for your business',
    ],
    scopeNote: 'Coming soon. Not available yet.',
  },
  {
    id: 'agents',
    title: 'Agency Banking & Cash Flow',
    category: 'Inclusion',
    description:
      'Tools for neighbourhood agents who help people nearby access and move money.',
    icon: <Users2 className="w-6 h-6 text-blue-800" />,
    status: 'AVAILABLE_PHASE1',
    features: [
      'Support for local cash-in and cash-out',
      'A clear view of agent activity',
      'Commission shown in plain language',
      'A simpler day for the people you serve',
    ],
    scopeNote: 'Coming soon. Not available yet.',
  },
  {
    id: 'investments',
    slug: 'investments',
    title: 'Investment Portfolios',
    category: 'Future Capabilities',
    description:
      'A future place to explore wealth-building options and see your holdings. No products or returns are shown today.',
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
    status: 'FUTURE_ROADMAP',
    features: [
      'Regulated asset classes',
      'Risk profile assessments',
      'Automated portfolio tracking',
      'Transparent disclosure standards',
    ],
    scopeNote: 'Planned. Not available yet.',
  },
  {
    id: 'crypto',
    slug: 'crypto',
    title: 'Digital Assets & Crypto Treasury',
    category: 'Future Capabilities',
    description:
      'Future services for buying, selling, and using digital assets alongside everyday money. Not operational.',
    icon: <Coins className="w-6 h-6 text-amber-500" />,
    status: 'FUTURE_ROADMAP',
    features: [
      'Buy and sell digital assets',
      'Fund an account with digital assets',
      'See digital assets next to everyday money',
      'No live prices on this website',
    ],
    scopeNote: 'Planned. Not available yet.',
  },
];

interface PillarsSectionProps {
  onOpenWaitlist: (category?: string) => void;
}

export const PillarsSection: React.FC<PillarsSectionProps> = ({ onOpenWaitlist }) => {
  const [filter, setFilter] = useState<'all' | 'soon' | 'planned'>('all');

  const filteredServices = SERVICES_CATALOG.filter((item) => {
    if (filter === 'soon') return item.status === 'AVAILABLE_PHASE1' || item.status === 'COMING_SOON';
    if (filter === 'planned') return item.status === 'FUTURE_ROADMAP';
    return true;
  });

  return (
    <section id="services" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Services
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Financial services in one relationship
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
              Banking, savings, loans, payments, and later wealth services are designed to sit together. Coming soon means we are preparing them. Planned means they are part of the longer vision. None of them are open for transactions today.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0046AD] text-white text-xs sm:text-sm font-bold hover:bg-[#003B94] transition-colors shadow-2xs self-start md:self-auto"
          >
            <span>Explore Services</span>
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
            onClick={() => setFilter('soon')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'soon'
                ? 'bg-[#001B40] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
            }`}
          >
            Coming Soon (6)
          </button>
          <button
            onClick={() => setFilter('planned')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'planned'
                ? 'bg-[#FBBF24] text-[#001B40] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
            }`}
          >
            Planned (2)
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
                    {isFuture ? 'Join the Waitlist' : 'Register Interest'}
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
