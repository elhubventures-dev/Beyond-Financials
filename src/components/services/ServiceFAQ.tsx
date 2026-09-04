/**
 * Beyond Financials - Service FAQ Accordion Component
 * 
 * Transparent Q&A answering key user questions about timelines, compliance, and features.
 */

import React, { useState } from 'react';
import { ServiceFAQItem } from '../../types/services';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export interface ServiceFAQProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  faqs: ServiceFAQItem[];
}

export const ServiceFAQ: React.FC<ServiceFAQProps> = ({
  badge = 'Transparent Answers',
  title = 'Frequently Asked Questions',
  subtitle = 'Clear, honest information regarding development milestones, compliance, and waitlist timelines.',
  faqs,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="blue" size="md">
            {badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-normal">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-4">
                    {faq.category && (
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#0046AD]">
                        {faq.category}
                      </span>
                    )}
                    <h3 className="text-base sm:text-lg font-bold font-display text-[#001B40]">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="p-1.5 rounded-full bg-blue-50 text-[#0046AD] flex-shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-[#F8FAFC]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
