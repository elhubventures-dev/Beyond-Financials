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
        'Beyond Financials is currently in active Phase 1 engineering under contracted development milestones. The platform is pre-launch, meaning live financial deposits, withdrawals, and loan disbursements are not yet executing. Visitors can join our priority early access waitlist to be onboarded first when the platform opens.',
      badge: 'Pre-Launch',
    },
    {
      id: 'gen-3',
      category: 'general',
      categoryLabel: 'General & Foundation',
      question: 'Is Beyond Financials a commercial bank?',
      answer:
        'Beyond Financials is a financial technology software platform. Banking infrastructure, deposit custody, and virtual account allocation are operated in direct collaboration with licensed deposit-taking financial institutions in compliance with Central Bank of Nigeria (CBN) regulations.',
    },
    // Banking
    {
      id: 'bank-1',
      category: 'banking',
      categoryLabel: 'Digital Banking',
      question: 'How do virtual accounts work on Beyond Financials?',
      answer:
        'Upon completing onboarding, you receive a dedicated Nigerian bank virtual account number. This account acts as an open receiver for transfers from any commercial bank, fintech app, employer payroll system, or client in Nigeria, instantly crediting your Beyond Financials primary wallet.',
      badge: 'Phase 1',
    },
    {
      id: 'bank-2',
      category: 'banking',
      categoryLabel: 'Digital Banking',
      question: 'What KYC verification levels are required to open an account?',
      answer:
        'We follow a tiered KYC verification model: Tier 1 requires basic name, phone, and date of birth with low daily transaction limits; Tier 2 introduces verified BVN and NIN with expanded limits; Tier 3 includes proof of residential address and biometric verification for unlimited transactional flexibility.',
    },
    {
      id: 'bank-3',
      category: 'banking',
      categoryLabel: 'Digital Banking',
      question: 'Are there monthly account maintenance fees?',
      answer:
        'No. Beyond Financials does not charge hidden monthly account maintenance fees or surprise card-keeping charges on your primary digital account.',
    },
    // Savings
    {
      id: 'sav-1',
      category: 'savings',
      categoryLabel: 'Disciplined Savings',
      question: 'What types of savings plans will be available in Phase 1?',
      answer:
        'Phase 1 will introduce two primary savings structures: Flexible Goal Pockets (where you can withdraw emergency funds at any time while organizing money for specific targets) and Locked Target Vaults (where funds are locked for a defined term like 30, 90, or 180 days to prevent impulsive spending).',
      badge: 'Phase 1',
    },
    {
      id: 'sav-2',
      category: 'savings',
      categoryLabel: 'Disciplined Savings',
      question: 'Does Beyond Financials promise fixed or guaranteed high returns on savings?',
      answer:
        'No. Specific yield and interest structures will be published upon regulatory deployment in alignment with partner institutional rates. Beyond Financials does not make speculative or unrealistic yield promises.',
    },
    // Loans
    {
      id: 'loan-1',
      category: 'loans',
      categoryLabel: 'Loans & Credit',
      question: 'Can I apply for a loan right now on this website?',
      answer:
        'Not yet. Loan underwriting and credit facilities will activate upon public platform launch for verified account holders. Joining the waitlist ensures your profile is prioritized for early credit eligibility assessments.',
      badge: 'Priority',
    },
    {
      id: 'loan-2',
      category: 'loans',
      categoryLabel: 'Loans & Credit',
      question: 'How does Beyond Financials ensure ethical debt recovery?',
      answer:
        'We enforce a strict anti-harassment policy: we will never scrape your device contact lists, message your contacts, or engage in public defamation. Underwriting is based on verified income and transparent repayment terms, and recovery is conducted through direct, respectful communication.',
    },
    {
      id: 'loan-3',
      category: 'loans',
      categoryLabel: 'Loans & Credit',
      question: 'What loan products will be supported?',
      answer:
        'We are building two core credit facilities: Salary Advance Overdrafts (short-term cash flow buffers for verified salary earners) and Structured SME Working Capital (inventory and equipment financing for small businesses with verifiable cash flow records).',
    },
    // Payments
    {
      id: 'pay-1',
      category: 'payments',
      categoryLabel: 'Utility Payments',
      question: 'Which utility billers and providers will be supported?',
      answer:
        'The Phase 1 payments engine connects with major Nigerian telecommunications providers (MTN, Airtel, Glo, 9mobile), electricity distribution companies (IKEDC, EKEDC, AEDC, IBEDC, PHED, etc.), cable television platforms (DStv, GOtv, StarTimes), and educational exam pin portals (WAEC, JAMB).',
      badge: 'Phase 1',
    },
    {
      id: 'pay-2',
      category: 'payments',
      categoryLabel: 'Utility Payments',
      question: 'What happens if an electricity meter token generation fails?',
      answer:
        'Our system uses automated retry logic and state-machine verification. If an upstream DISCO gateway delays a token, the transaction remains tracked and automatically updates with the token as soon as confirmed, preventing double debits or lost payments.',
    },
    // Investments
    {
      id: 'inv-1',
      category: 'investments',
      categoryLabel: 'Investments (Roadmap)',
      question: 'When will investment products be available?',
      answer:
        'Investment portfolios represent our Phase 2 strategic roadmap. These will be deployed in collaboration with SEC-licensed capital market operators and asset managers, providing curated access to fixed income funds, commercial papers, and treasury assets.',
      badge: 'Roadmap',
    },
    {
      id: 'inv-2',
      category: 'investments',
      categoryLabel: 'Investments (Roadmap)',
      question: 'Does Beyond Financials guarantee investment returns?',
      answer:
        'No. All real-world investments carry financial risk. Beyond Financials does not promise speculative or guaranteed profits. All future investment products will be accompanied by full prospectuses and clear risk parameters.',
    },
    // Crypto
    {
      id: 'cry-1',
      category: 'crypto',
      categoryLabel: 'Digital Assets (Roadmap)',
      question: 'Are cryptocurrency swaps or wallets live today?',
      answer:
        'No. Digital asset capabilities are part of our Phase 2 roadmap and will launch in full compliance with Central Bank of Nigeria (CBN) guidelines and Securities and Exchange Commission (SEC) Virtual Asset Service Provider (VASP) rules.',
      badge: 'Roadmap',
    },
    // Security & Privacy
    {
      id: 'sec-1',
      category: 'security',
      categoryLabel: 'Security & Privacy',
      question: 'How is my personal information protected?',
      answer:
        'We follow the Nigeria Data Protection Act (NDPA). All sensitive credentials and partner API keys remain strictly on secure servers, logs are automatically sanitized of personal identifiers (BVN, NIN, passwords), and all communications are encrypted.',
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
        'Waitlist members receive priority invitation codes before public launch, early access to Tier 1 virtual accounts with zero maintenance fees, and exclusive product milestone updates.',
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
        description="Find answers to all your questions about Beyond Financials, Phase 1 banking and savings features, ethical credit, utility payments, and roadmap milestones."
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
              Learn how Beyond Financials operates, what is included in our Phase 1 development scope, and how we protect your data and funds.
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions (e.g. virtual accounts, loans, KYC, waitlist)..."
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
                                item.badge === 'Phase 1'
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
