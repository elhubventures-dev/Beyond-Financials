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
        description="Pre-launch terms for the Beyond Financials website and waitlist. Financial services are not available yet. This is not the final customer agreement."
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
            Status: Pre-launch terms. Not the final customer agreement.
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
              Beyond Financials is preparing to launch. This website explains the brand and lets you join a waitlist or send a message. It does not open accounts, move money, or approve loans. Final customer terms will be published before commercial services open.
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
                Joining the waitlist is voluntary. It does not oblige Beyond Financials to open an account, approve a loan, or provide any financial service.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                3. Regulatory Status & Partner Institutions
              </h2>
              <p>
                Beyond Financials is not a licensed bank. This website does not claim regulatory approvals. Future account, payment, and credit services will be offered only after the approvals those services require are in place.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                4. Future Roadmap Scopes (Investments & Digital Assets)
              </h2>
              <p>
                Investments and digital assets are planned and are not available. Beyond Financials does not promise returns. Those services will not be offered until the permissions they require are in place.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                5. Intellectual Property
              </h2>
              <p>
                All trademarks, logos, and content on beyondfinancials.ng belong to Beyond Financials unless stated otherwise.
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
