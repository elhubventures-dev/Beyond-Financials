/**
 * Beyond Financials - Service How It Works Section
 * 
 * Step-by-step conceptual workflow guiding the prospective customer through user journey.
 */

import React from 'react';
import { ServiceWorkflowStep } from '../../types/services';
import { Badge } from '../ui/Badge';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface ServiceHowItWorksProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  steps: ServiceWorkflowStep[];
}

export const ServiceHowItWorks: React.FC<ServiceHowItWorksProps> = ({
  badge = 'Seamless User Journey',
  title = 'How It Works',
  subtitle = 'Engineered from the ground up to minimize friction while preserving strict regulatory compliance.',
  steps,
}) => {
  return (
    <section className="py-20 bg-[#F8FAFC] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-4">
          <Badge variant="blue" size="md">
            {badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-4 relative flex flex-col justify-between hover:border-[#0046AD]/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold font-mono text-[#0046AD]">
                    {step.step}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

                <h3 className="text-base font-bold font-display text-[#001B40]">
                  {step.title}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 text-[11px] font-mono text-slate-400">
                Step {idx + 1} of {steps.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
