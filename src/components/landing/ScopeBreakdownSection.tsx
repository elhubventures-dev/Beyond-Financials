import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '../../router/Router';

interface ScopeBreakdownSectionProps {
  onOpenWaitlist: () => void;
}

const STEPS = [
  {
    label: 'Now',
    title: 'Join the waitlist',
    description: 'Tell us which services matter to you. We will share launch updates as they are ready.',
  },
  {
    label: 'Next',
    title: 'Digital financial services',
    description: 'Accounts, wallets, and everyday money management are being prepared for a careful launch.',
  },
  {
    label: 'Coming soon',
    title: 'Savings, loans, and payments',
    description: 'Goal savings, responsible financing, and bill payments will follow as each service opens.',
  },
  {
    label: 'Future',
    title: 'Investments and digital assets',
    description: 'Wealth-building tools and digital-asset services are part of the longer vision, not available today.',
  },
];

export const ScopeBreakdownSection: React.FC<ScopeBreakdownSectionProps> = ({ onOpenWaitlist }) => {
  return (
    <section id="roadmap" className="py-20 bg-[#001B40] text-white border-t border-[#06285A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold uppercase tracking-wider">
              What happens next
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              A simple path to launch
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Beyond Financials is preparing to launch. You can register interest now. Financial services will open only when they are genuinely ready.
            </p>
          </div>

          <button
            onClick={onOpenWaitlist}
            className="bg-[#FBBF24] text-[#001B40] px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-sm cursor-pointer self-start md:self-auto flex-shrink-0 flex items-center gap-2"
          >
            <span>Join the Waitlist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.label}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-white/20 transition-colors"
            >
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#FBBF24]">
                {step.label}
              </span>
              <h3 className="text-lg font-bold font-display text-white">{step.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-slate-400">
          Want the detail behind each service?{' '}
          <Link to="/services" className="text-[#FBBF24] font-semibold hover:underline">
            Explore services
          </Link>
          .
        </p>
      </div>
    </section>
  );
};
