import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Product & Timeline',
    question: 'What is Beyond Financials and when will it launch?',
    answer:
      'Beyond Financials (beyondfinancials.ng) is a unified digital financial platform engineered for individuals, salary earners, entrepreneurs, and businesses across Nigeria. The platform is currently in active Phase 1 engineering with an estimated 8–10 week delivery milestone. Joining the waitlist gives you priority access upon release.',
  },
  {
    category: 'Phase 1 Scope',
    question: 'What features are included in the Phase 1 release?',
    answer:
      'Phase 1 contracted deliverables include customer registration, tiered KYC verification (BVN, NIN, selfie, address), virtual account allocation, internal & interbank transfers, flexible/locked savings, structured personal and business loan workflows, airtime/data/utility bill payments, merchant settlement, and agency banking float management.',
  },
  {
    category: 'Future Roadmap',
    question: 'Are cryptocurrency exchange and investment portfolios available right now?',
    answer:
      'No. Cryptocurrency services and capital market investments are part of our future strategic roadmap and will be released in subsequent regulatory phases. We strictly do not represent future products as currently operational.',
  },
  {
    category: 'Security & Compliance',
    question: 'How does Beyond Financials secure financial transactions and data?',
    answer:
      'Our architecture is built on an immutable double-entry ledger where transactions are auditable and tamper-evident. All sensitive credentials and provider secrets remain server-side, customer data is safeguarded with strong encryption, and PII is never exposed on client devices or in application logs.',
  },
  {
    category: 'Early Access',
    question: 'What happens after I join the early access waitlist?',
    answer:
      'You will receive your unique waitlist reference ID and milestone updates. When our onboarding gateway opens, you will receive an invitation link to complete your Tier 1 onboarding and receive your dedicated virtual account with zero maintenance fees.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <Badge variant="blue" size="md">
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Transparent Answers to Key Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about Beyond Financials, the Phase 1 development timeline, and our platform architecture.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/70 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 pr-4">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0046AD]">
                      {faq.category}
                    </span>
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
