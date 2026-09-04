/**
 * Beyond Financials - Privacy Policy Placeholder & Principles
 * 
 * Route: /privacy
 * Purpose: Pre-launch privacy statement outlining data collection principles,
 * NDPA compliance commitments, and notice that final policy terms will be published prior to public launch.
 */

import React from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Badge } from '../components/ui/Badge';
import { Link } from '../router/Router';
import { ShieldCheck, Lock, FileText, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onOpenWaitlist }) => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Privacy Policy & Data Protection - Beyond Financials"
        description="Review Beyond Financials' privacy framework, Nigeria Data Protection Act (NDPA) alignment, data minimization principles, and pre-launch policy status."
        canonicalPath="/privacy"
      />

      {/* Header */}
      <section className="py-16 bg-[#001B40] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Badge variant="warning" size="md">
            Legal & Governance
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Status: Pre-Launch Policy Draft & Architectural Principles (Updated August 2026)
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Pre-launch Advisory */}
          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-[#0046AD] font-bold text-sm">
              <Clock className="w-4 h-4" />
              <span>Pre-Launch Legal Notice</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Beyond Financials is currently in active Phase 1 engineering. Full statutory legal policies, data processor disclosures, and partner financial institution agreements will be formally published prior to public commercial launch in strict compliance with the Nigeria Data Protection Act (NDPA) and relevant regulatory frameworks.
            </p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200 shadow-2xs space-y-8 text-slate-700 text-sm leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                1. Our Commitment to Data Privacy
              </h2>
              <p>
                At Beyond Financials (operated under beyondfinancials.ng), we believe personal financial data belongs to you. We are committed to processing your information transparently, securely, and strictly for legitimate service delivery.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                2. Information We Collect in Pre-Launch
              </h2>
              <p>
                During our waitlist and early access registration phase, we collect only minimal information necessary to reserve your position and deliver project updates:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Full Name (First name and last name)</li>
                <li>Email Address</li>
                <li>Phone Number (Optional, for priority SMS onboarding notifications)</li>
                <li>Primary Financial Areas of Interest</li>
                <li>Customer Segmentation Profile (Individual, SME, Agent)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                3. What We Will NEVER Collect or Request in Public Forms
              </h2>
              <p>
                To safeguard your security, our public web portals and contact forms will never request:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Your Bank Verification Number (BVN) or National Identity Number (NIN)</li>
                <li>Your payment card PIN, CVV, or full card numbers</li>
                <li>Your account login passwords or authentication OTPs</li>
                <li>Access to your device contact lists, phonebooks, or personal social media credentials</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                4. Anti-Harassment & Zero Contact Scraping Policy
              </h2>
              <p>
                Beyond Financials expressly rejects unethical contact harvesting. We will never scrape your device contact lists or contact third parties regarding your financial standing.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                5. Data Security & Storage Standards
              </h2>
              <p>
                All data in transit is protected using modern cryptographic encryption protocols. Server infrastructure enforces PII-sanitized logging, strict role-based access control, and complete isolation of API credentials from client browsers.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-[#001B40]">
                6. Contacting the Privacy Team
              </h2>
              <p>
                If you have questions regarding our privacy practices or wish to request removal of your early access waitlist record, please contact us at{' '}
                <a href="mailto:security@beyondfinancials.ng" className="text-[#0046AD] font-semibold underline">
                  security@beyondfinancials.ng
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
