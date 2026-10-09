/**
 * Beyond Financials - Comprehensive FAQ & Knowledge Hub
 * 
 * Route: /faq
 * Purpose: Provide transparent, exhaustive, and categorized answers to visitor questions
 * covering the platform foundation, Phase 1 deliverables, and roadmap scopes.
 */

import React, { useState, useMemo } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Badge } from '../components/ui/Badge';
import { Link } from '../router/Router';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowRight,
  Landmark,
  PiggyBank,
  HandCoins,
  ReceiptText,
  TrendingUp,
  Coins,
  ShieldCheck,
  Users,
  Sparkles,
} from 'lucide-react';

interface FAQPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

interface FAQItem {
  id: string;
  category: string;
  categoryLabel: string;
  question: string;
  answer: string;
  badge?: string;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenWaitlist }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'gen-1': true,
  });

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General & Foundation' },
    { id: 'banking', label: 'Digital Banking' },
    { id: 'savings', label: 'Disciplined Savings' },
    { id: 'loans', label: 'Loans & Credit' },
    { id: 'payments', label: 'Utility Payments' },
    { id: 'investments', label: 'Investments (Roadmap)' },
    { id: 'crypto', label: 'Digital Assets (Roadmap)' },
    { id: 'security', label: 'Security & Privacy' },
    { id: 'waitlist', label: 'Waitlist & Early Access' },
  ];

  const faqItems: FAQItem[] = [
    // General
    {
      id: 'gen-1',
      category: 'general',
      categoryLabel: 'General & Foundation',
      question: 'What is Beyond Financials and what is its core purpose?',
      answer:
        'Beyond Financials (beyondfinancials.ng) is a unified digital financial ecosystem designed to bring personal banking, goal savings, accessible credit, and utility payments into a single, dependable relationship for individuals, salary earners, entrepreneurs, and businesses across Nigeria.',
      badge: 'Core',
    },
    {
      id: 'gen-2',
      category: 'general',
      categoryLabel: 'General & Foundation',
      question: 'Is Beyond Financials currently operational for live transactions?',
      answer:
        'Not yet. You can explore the services we plan to offer and join the waitlist. You cannot deposit, transfer, save, borrow, or trade on this website today.',
      badge: 'Pre-Launch',
    },
    {
      id: 'gen-3',
      category: 'general',
      categoryLabel: 'General & Foundation',
      question: 'Is Beyond Financials a commercial bank?',
      answer:
        'No. Beyond Financials is not a bank and does not claim a banking licence. Future account services will be offered only after the approvals those services require are in place.',
    },
    // Banking
    {
      id: 'bank-1',
      category: 'banking',
      categoryLabel: 'Digital Banking',
      question: 'Will I get an account number?',
      answer:
        'That is the plan. When accounts open, a dedicated account number is intended to help you receive salary and transfers. Accounts are not open yet, and joining the waitlist does not reserve a number.',
      badge: 'Coming Soon',
    },
    {
      id: 'bank-2',
      category: 'banking',
      categoryLabel: 'Digital Banking',
      question: 'What will I need to open an account?',
      answer:
        'Identity checks will be required before an account can be used. The exact documents will be published before accounts open. This website never asks for your BVN, NIN, or password.',
    },
    {
      id: 'bank-3',
      category: 'banking',
      categoryLabel: 'Digital Banking',
      question: 'Are there monthly account maintenance fees?',
      answer:
        'Account fees have not been published. We will not claim that accounts are free until that is confirmed in writing before launch.',
    },
    // Savings
    {
      id: 'sav-1',
      category: 'savings',
      categoryLabel: 'Disciplined Savings',
      question: 'Will I be able to save money?',
      answer:
        'Yes, that is the plan. Flexible savings and goal savings are coming soon. Interest rates, minimum balances, and withdrawal rules are not published.',
      badge: 'Coming Soon',
    },
    {
      id: 'sav-2',
      category: 'savings',
      categoryLabel: 'Disciplined Savings',
      question: 'Does Beyond Financials promise fixed or guaranteed high returns on savings?',
      answer:
        'No. We do not promise returns. Any rate will be published only when it is real, before savings open.',
    },
    // Loans
    {
      id: 'loan-1',
      category: 'loans',
      categoryLabel: 'Loans & Credit',
      question: 'Can I apply for a loan right now on this website?',
      answer:
        'Not yet. Join the loan interest list if you want to hear when applications open. That is not an application and not an approval. Rates, amounts, and eligibility are not published.',
      badge: 'Priority',
    },
    {
      id: 'loan-2',
      category: 'loans',
      categoryLabel: 'Loans & Credit',
      question: 'How does Beyond Financials ensure ethical debt recovery?',
      answer:
        'We will not scrape your contacts or message people you know about a loan. Any future lending will be discussed with you directly, with terms shown before you accept.',
    },
    {
      id: 'loan-3',
      category: 'loans',
      categoryLabel: 'Loans & Credit',
      question: 'What loan products will be supported?',
      answer:
        'We are preparing financing for salary earners, civil servants, entrepreneurs, business owners, and households. Product names, amounts, and rates will be published only when they are confirmed.',
    },
    // Payments
    {
      id: 'pay-1',
      category: 'payments',
      categoryLabel: 'Utility Payments',
      question: 'Which utility billers and providers will be supported?',
      answer:
        'We plan to support airtime, mobile data, electricity, cable TV, internet, and selected government and education payments. The exact list will be confirmed when payments open. You cannot pay a bill on this website today.',
      badge: 'Coming Soon',
    },
    {
      id: 'pay-2',
      category: 'payments',
      categoryLabel: 'Utility Payments',
      question: 'What happens if an electricity meter token generation fails?',
      answer:
        'Payments are not live. When they are, each payment is intended to show whether it completed, so you are not left guessing.',
    },
    // Investments
    {
      id: 'inv-1',
      category: 'investments',
      categoryLabel: 'Investments (Roadmap)',
      question: 'When will investment products be available?',
      answer:
        'Investments are planned for later and are not available. There are no products or returns to view today. We will not offer them until the permissions those services require are in place.',
      badge: 'Planned',
    },
    {
      id: 'inv-2',
      category: 'investments',
      categoryLabel: 'Investments (Roadmap)',
      question: 'Does Beyond Financials guarantee investment returns?',
      answer:
        'No. Investments can lose money. We do not promise returns, and this website does not show performance.',
    },
    // Crypto
    {
      id: 'cry-1',
      category: 'crypto',
      categoryLabel: 'Digital Assets (Roadmap)',
      question: 'Are cryptocurrency swaps or wallets live today?',
      answer:
        'No. Digital-asset services are planned and are not available. We do not show prices, and we do not claim the approvals those services would need.',
      badge: 'Planned',
    },
    // Security & Privacy
    {
      id: 'sec-1',
      category: 'security',
      categoryLabel: 'Security & Privacy',
      question: 'How is my personal information protected?',
      answer:
        'Public forms do not collect identity numbers or passwords. We design privacy around the Nigeria Data Protection Act: collect less, protect what we hold, and explain why. Final legal terms will be published before commercial launch.',
    },
    {
      id: 'sec-2',
      category: 'security',
      categoryLabel: 'Security & Privacy',
      question: 'Will Beyond Financials ever ask for my password or card PIN?',
      answer:
        'Never. Beyond Financials representatives, support agents, and automated forms will never ask for your account password, card PIN, OTP, or recovery secrets. Never share these credentials with anyone.',
    },
    // Waitlist
    {
      id: 'wait-1',
      category: 'waitlist',
      categoryLabel: 'Waitlist & Early Access',
      question: 'Is there a cost or fee to join the waitlist?',
      answer:
        'No. Joining the Beyond Financials early access waitlist is 100% free and requires only basic contact details and your product preferences.',
    },
    {
      id: 'wait-2',
      category: 'waitlist',
      categoryLabel: 'Waitlist & Early Access',
      question: 'What benefits do waitlist members receive?',
      answer:
        'Waitlist members hear from us as launch approaches and can tell us which services they care about. A place on the list is not an account, a fee waiver, or a loan approval.',
    },
  ];

  const filteredItems = useMemo(() => {
    return faqItems.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery, faqItems]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Frequently Asked Questions - Beyond Financials Help Hub"
        description="Answers about Beyond Financials, the waitlist, banking, savings, loans, payments, investments, and digital assets. Services are not live yet."
        canonicalPath="/faq"
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-linear-to-b from-[#001B40] to-[#002866] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="md">
                Knowledge & FAQ Hub
              </Badge>
              <span className="text-xs font-mono text-blue-200">
                Transparent & Honest Answers
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Clear answers to your{' '}
              <span className="text-[#FBBF24]">key questions</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              What Beyond Financials will offer, what you can do today, and how your information will be treated.
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions (e.g. waitlist, loans, savings, crypto)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-3 focus:ring-[#FBBF24] shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0046AD] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredItems.length}</strong>{' '}
              {filteredItems.length === 1 ? 'question' : 'questions'}
            </span>
            {searchQuery && (
              <span>
                Filtered by &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </span>
            )}
          </div>

          {/* FAQ Accordion List */}
          {filteredItems.length > 0 ? (
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const isOpen = Boolean(openItems[item.id]);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/70 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0046AD]">
                            {item.categoryLabel}
                          </span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                item.badge === 'Coming Soon'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.badge === 'Priority'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.badge === 'Pre-Launch'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold font-display text-[#001B40]">
                          {item.question}
                        </h3>
                      </div>
                      <div className="p-1.5 rounded-full bg-blue-50 text-[#0046AD] shrink-0">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-gray-100 bg-[#F8FAFC]/50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-4">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-[#001B40]">
                No questions found matching your search
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try searching for different keywords, or browse questions by category using the filter chips above.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-full bg-[#0046AD] text-white text-xs font-bold hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions? / Contact Route */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-2xl bg-slate-50 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-[#001B40]">
                Still have a specific question?
              </h3>
              <p className="text-sm text-slate-600 max-w-md">
                Our support and partnership representatives are ready to answer your enquiries.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-full bg-[#0046AD] text-white font-bold text-sm hover:bg-blue-800 transition-colors shrink-0 flex items-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Waitlist CTA Banner */}
      <section className="py-20 bg-[#001B40] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Priority Early Access
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
              Ready to Experience Beyond Financials?
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Register your interest now to receive priority onboarding and updates as we progress toward public release.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenWaitlist()}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FBBF24] text-[#001B40] font-bold text-base hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/services"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base transition-colors border border-white/20 flex items-center justify-center gap-2"
            >
              <span>View All Services</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
