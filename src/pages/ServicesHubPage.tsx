/**
 * Beyond Financials - Services Hub Page (/services)
 * 
 * Central gateway introducing the entire financial ecosystem, product statuses,
 * architecture connections, and user acquisition pathways.
 */

import React, { useState } from 'react';
import { SERVICES_LIST } from '../data/servicesData';
import { ServiceStatusBadge } from '../components/services/ServiceStatusBadge';
import { SEOHead } from '../components/seo/SEOHead';
import { Link } from '../router/Router';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Landmark,
  PiggyBank,
  HandCoins,
  CreditCard,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldCheck,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ServicesHubPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const ServicesHubPage: React.FC<ServicesHubPageProps> = ({ onOpenWaitlist }) => {
  const [filter, setFilter] = useState<'all' | 'soon' | 'planned'>('all');

  const filteredServices = SERVICES_LIST.filter((s) => {
    if (filter === 'soon') return s.status === 'COMING_SOON' || s.status === 'JOIN_WAITLIST' || s.status === 'AVAILABLE';
    if (filter === 'planned') return s.status === 'FUTURE';
    return true;
  });

  const getServiceIcon = (slug: string) => {
    switch (slug) {
      case 'banking':
        return <Landmark className="w-6 h-6 text-[#0046AD]" />;
      case 'savings':
        return <PiggyBank className="w-6 h-6 text-emerald-600" />;
      case 'loans':
        return <HandCoins className="w-6 h-6 text-[#F59E0B]" />;
      case 'payments':
        return <CreditCard className="w-6 h-6 text-teal-600" />;
      case 'investments':
        return <TrendingUp className="w-6 h-6 text-indigo-600" />;
      case 'crypto':
        return <Coins className="w-6 h-6 text-amber-500" />;
      default:
        return <Layers className="w-6 h-6 text-[#0046AD]" />;
    }
  };

  const hubFaqs = [
    {
      question: 'How do the services fit together?',
      answer:
        'They are designed to belong to one relationship. When they open, money you receive could fund savings, bills, or a loan repayment without jumping between separate apps. None of that is available today.',
    },
    {
      question: 'Which services are coming soon, and which are only planned?',
      answer:
        'Digital banking, savings, loans, and everyday payments are coming soon. Investments and digital assets are planned for later. Merchant and agent services are also part of the wider vision. Nothing on this website is open for transactions yet.',
    },
    {
      question: 'Will I need a separate profile for each service?',
      answer:
        'No. The aim is one Beyond Financials relationship that can unlock each service as it becomes available.',
    },
    {
      question: 'How does the waitlist work?',
      answer:
        'You tell us which services interest you. We will share updates as launch approaches. Joining does not open an account or approve a loan.',
    },
  ];

  return (
    <div className="bg-[#F8FAFC]">
      <SEOHead
        title="Beyond Financials Services | Unified Digital Financial Ecosystem"
        description="Explore the Beyond Financials ecosystem: digital banking, disciplined savings, fair financing, utility payments, investments, and digital assets."
        canonicalPath="/services"
      />

      {/* Services Hub Hero */}
      <section className="bg-gradient-to-b from-[#001B40] to-[#00265C] text-white pt-16 pb-20 lg:pt-20 lg:pb-24 border-b border-[#06285A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#0046AD] blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-[#FBBF24] blur-3xl opacity-25" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Public Product Directory</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              One Financial Relationship, Multiple Services
            </h1>

            <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-normal">
              Beyond Financials is preparing one place for accounts, savings, loans, payments, and later wealth services. None of these services are open yet.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenWaitlist()}
                className="bg-[#FBBF24] text-[#001B40] px-8 py-4 rounded-full font-bold text-sm hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#catalog"
                className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                Browse All Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <Badge variant="blue" size="md">
              Complete Product Directory
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Explore our services
            </h2>
            <p className="text-base text-gray-500 font-normal">
              Each service explains what it is, why it matters, and whether it is coming soon or planned.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 border-b md:border-b-0 border-gray-200 pb-2 md:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#0046AD] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
              }`}
            >
              All Services ({SERVICES_LIST.length})
            </button>
            <button
              onClick={() => setFilter('soon')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'soon'
                  ? 'bg-[#001B40] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
              }`}
            >
              Coming Soon
            </button>
            <button
              onClick={() => setFilter('planned')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                filter === 'planned'
                  ? 'bg-[#FBBF24] text-[#001B40] shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-gray-200'
              }`}
            >
              Planned
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              variant="default"
              className="flex flex-col justify-between border border-gray-200/90 bg-white hover:border-[#0046AD]/40 hover:shadow-lg transition-all group p-7"
            >
              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    {getServiceIcon(service.slug)}
                  </div>
                  <ServiceStatusBadge status={service.status} size="sm" />
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0046AD]">
                    {service.category}
                  </span>
                  <h3 className="text-xl font-bold font-display text-[#001B40] group-hover:text-[#0046AD] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Key Features Preview */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  {service.features.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0046AD] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between gap-3">
                <Link
                  to={`/services/${service.slug}`}
                  className="text-xs font-bold text-[#0046AD] hover:text-[#001B40] inline-flex items-center gap-1.5"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => onOpenWaitlist(service.waitlistInterest)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-[#FBBF24] hover:text-[#001B40] text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Join Waitlist
                </button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Why Beyond Financials: The Unified Ecosystem */}
      <section className="py-20 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Why one place
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Why a connected experience matters
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
              People often use different apps for transfers, savings, loans, and bills. Beyond Financials is being designed so those parts of your financial life can sit together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-gray-200/90 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#0046AD] flex items-center justify-center font-bold">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#001B40]">
                One view of your money
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                Salary, savings, bills, and repayments are meant to be understandable in one place, once those services open.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-gray-200/90 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#0046AD] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#001B40]">
                One profile
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                You should not have to introduce yourself again for every service. Identity checks will be explained before they are required.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-gray-200/90 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-[#0046AD] flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#001B40]">
                Room to grow
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                Investments, digital assets, merchant services, and agent services can join the same relationship when they are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Hub FAQs */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="blue" size="md">
            Common Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-normal">
            Everything you need to know about navigating the Beyond Financials product catalog.
          </p>
        </div>

        <div className="space-y-4">
          {hubFaqs.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-gray-200/90 space-y-2">
              <h3 className="text-base sm:text-lg font-bold font-display text-[#001B40]">
                {faq.question}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Waitlist Strip */}
      <section className="py-20 bg-[#001B40] text-white border-t border-[#06285A] text-center space-y-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Badge variant="amber" size="md">
            Priority Access
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Ready to Experience the Unified Ecosystem?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Register your interest in the services you care about. We will share updates as launch approaches.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onOpenWaitlist()}
              className="bg-[#FBBF24] text-[#001B40] px-8 py-4 rounded-full font-bold text-base hover:bg-yellow-400 transition-colors shadow-lg cursor-pointer inline-flex items-center gap-2"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
