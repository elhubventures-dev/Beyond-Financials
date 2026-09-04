/**
 * Beyond Financials - Service Waitlist CTA Strip
 * 
 * High-impact user acquisition component tailored to pre-select the service interest.
 */

import React from 'react';
import { ArrowRight, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { WaitlistInterestCategory } from '../../types/domain';

export interface ServiceWaitlistCTAProps {
  serviceTitle: string;
  interestCategory: WaitlistInterestCategory;
  buttonText?: string;
  headline?: string;
  subheadline?: string;
  onOpenWaitlist: (interest?: string) => void;
}

export const ServiceWaitlistCTA: React.FC<ServiceWaitlistCTAProps> = ({
  serviceTitle,
  interestCategory,
  buttonText = 'Join Early Access Waitlist',
  headline = `Be First in Line for ${serviceTitle}`,
  subheadline = 'Join forward-thinking individuals and businesses across Nigeria. Receive milestone engineering updates and priority onboarding access.',
  onOpenWaitlist,
}) => {
  return (
    <section className="py-20 bg-[#001B40] text-white border-t border-[#06285A] relative overflow-hidden">
      {/* Subtle Geometric Glow */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-[#0046AD] blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-96 h-96 rounded-full bg-[#FBBF24] blur-3xl opacity-25" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Priority User Acquisition</span>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            {headline}
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            {subheadline}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onOpenWaitlist(interestCategory)}
            className="w-full sm:w-auto bg-[#FBBF24] text-[#001B40] px-8 py-4 rounded-full font-bold text-base hover:bg-yellow-400 active:bg-yellow-500 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#FBBF24]" />
            Privacy-safe registration
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            No BVN/NIN required for waitlist
          </span>
          <span>No spam guarantee</span>
        </div>
      </div>
    </section>
  );
};
