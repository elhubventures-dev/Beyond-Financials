/**
 * Beyond Financials - Service Benefits Component
 * 
 * Segment-specific audience benefits highlighting transparent value across user profiles.
 */

import React from 'react';
import { ServiceAudienceBenefit } from '../../types/services';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Users } from 'lucide-react';

export interface ServiceBenefitsProps {
  badge?: string;
  title: string;
  subtitle: string;
  benefits: ServiceAudienceBenefit[];
}

export const ServiceBenefits: React.FC<ServiceBenefitsProps> = ({
  badge = 'Tailored for Every Need',
  title,
  subtitle,
  benefits,
}) => {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#F8FAFC] border border-gray-200/90 space-y-6 hover:border-[#0046AD]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0046AD] text-xs font-bold uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5" />
                  <span>{benefit.audience}</span>
                </div>

                <h3 className="text-xl font-bold font-display text-[#001B40]">
                  {benefit.headline}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed font-normal">
                  {benefit.description}
                </p>

                <div className="pt-2 border-t border-gray-200/80 space-y-2.5">
                  {benefit.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#0046AD] flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
