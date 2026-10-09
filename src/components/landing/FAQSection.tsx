import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Link } from '../../router/Router';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'About',
    question: 'What is Beyond Financials?',
    answer:
      'Beyond Financials is a financial services company preparing to launch a connected platform for everyday money. The vision brings digital banking, savings, loans, payments, and later investments and digital assets into one experience for people and businesses in Nigeria.',
  },
  {
    category: 'Availability',
    question: 'Is Beyond Financials currently available?',
    answer:
      'Not yet. You can join the waitlist and explore the services we plan to offer. You cannot open an account, transfer money, save, borrow, or trade on this website today.',
  },
  {
    category: 'Waitlist',
    question: 'Can I join the waitlist?',
    answer:
      'Yes. Joining is free. Tell us your name, email, and the services you care about. We will use that to share launch updates. It does not open an account or approve a loan.',
  },
  {
    category: 'Services',
    question: 'What services will Beyond Financials offer?',
    answer:
      'We are preparing digital banking, savings, loans, and everyday payments. Investments, digital assets, merchant services, agent services, and future international services are part of the wider vision and will be marked as planned until they are ready.',
  },
  {
    category: 'Loans',
    question: 'Will loans be available?',
    answer:
      'Loans are an important part of the plan, especially for salary earners, civil servants, entrepreneurs, and households. They are not available yet. Rates, amounts, and eligibility will be published only when they are confirmed. You can join the loan interest list.',
  },
  {
    category: 'Security',
    question: 'How will my information be protected?',
    answer:
      'We are designing the service around secure sign-in, identity checks, privacy, and careful handling of personal information. Public forms never ask for your BVN, NIN, card PIN, or password. Final privacy terms will be published before commercial launch.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#F8FAFC] border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <Badge variant="blue" size="md">
            Frequently asked questions
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            Questions people ask before launch
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
            A short guide to what Beyond Financials is, what you can do today, and what is still coming.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
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

        <p className="text-center text-sm text-gray-500">
          <Link to="/faq" className="font-bold text-[#0046AD] hover:underline">
            See all questions
          </Link>
        </p>
      </div>
    </section>
  );
};
