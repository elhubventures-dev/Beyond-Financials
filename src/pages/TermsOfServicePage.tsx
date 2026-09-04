/**
 * Beyond Financials - Terms of Service Placeholder & Governance Statement
 * 
 * Route: /terms
 * Purpose: Pre-launch terms outlining platform relationship, development milestone scope,
 * and notice that formal binding terms will be published prior to public launch.
 */

import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Badge } from '../components/ui/Badge';
import { Link } from '../router/Router';
import { Scale, Clock, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface TermsOfServicePageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onOpenWaitlist }) => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Terms of Service & Platform Governance - Beyond Financials"
        description="Review Beyond Financials' pre-launch terms of service, early access waitlist terms, platform architecture governance, and milestone scope."
        canonicalPath="/terms"
      />

      {/* Header */}
      <section className="py-16 bg-[#001B40] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="warning" size="md">
            Legal & Governance
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Terms of Service & Platform Governance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Status: Pre-Launch Service Terms & Waitlist Agreement (Updated August 2026)
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Pre-launch Advisory */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Pre-Launch Operations Notice</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Beyond Financials is currently in active Phase 1 engineering development. The web application at beyondfinancials.ng functions as a public informational preview and early access waitlist portal. No real financial accounts, money transfers, or loans are being executed on this preview build. Comprehensive statutory customer agreements and partner banking terms will be executed upon official onboarding.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                1. Acceptance of Pre-Launch Terms
              </h2>
              <p>
                By accessing this website, submitting an inquiry, or registering for the Beyond Financials early access waitlist, you agree to these pre-launch terms and our published privacy principles.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                2. Nature of the Early Access Waitlist
              </h2>
              <p>
                Registration on the waitlist is voluntary and does not constitute a binding obligation on Beyond Financials to issue an account, disburse a loan, or guarantee financial services. Waitlist position provides priority invitation access when customer onboarding commences.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                3. Regulatory Status & Partner Institutions
              </h2>
              <p>
                Beyond Financials is a financial technology software platform. Deposit-taking account services, payment switching, and credit facilities will be operated in direct partnership with appropriately licensed financial institutions in compliance with the Central Bank of Nigeria (CBN) and relevant authorities.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                4. Future Roadmap Scopes (Investments & Digital Assets)
              </h2>
              <p>
                References to investment portfolios and digital asset swaps represent future strategic roadmap milestones. These services are not operational in Phase 1 and will deploy in subsequent phases subject to Securities and Exchange Commission (SEC) and CBN compliance. Beyond Financials does not guarantee speculative or fixed investment returns.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                5. Intellectual Property
              </h2>
              <p>
                All trademarks, logos, brand assets, software architecture, designs, and content on beyondfinancials.ng are the property of Beyond Financials and protected under Nigerian and international copyright and trademark laws.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                6. Contact & Inquiries
              </h2>
              <p>
                For questions regarding our terms of service or corporate governance, please reach out via our official portal at{' '}
                <Link to="/contact" className="text-[#0046AD] font-semibold underline">
                  beyondfinancials.ng/contact
                </Link>{' '}
                or email{' '}
                <a href="mailto:hello@beyondfinancials.ng" className="text-[#0046AD] font-semibold underline">
                  hello@beyondfinancials.ng
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
