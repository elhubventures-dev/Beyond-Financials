/**
 * Beyond Financials - Public Homepage (/ or /home)
 * 
 * Preserves the working homepage foundation:
 * - Split Hero with email prefill
 * - Contracted 45-Deliverables Phase 1 Scope breakdown
 * - Strategic Pillars & Service Catalog preview
 * - 8-Tier Architecture Explorer & Double-Entry Ledger preview
 * - Security Pillars
 * - Public Platform FAQ
 */

import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { PillarsSection } from '../components/landing/PillarsSection';
import { ArchitecturePreview } from '../components/landing/ArchitecturePreview';
import { ScopeBreakdownSection } from '../components/landing/ScopeBreakdownSection';
import { SecuritySection } from '../components/landing/SecuritySection';
import { FAQSection } from '../components/landing/FAQSection';
import { SEOHead } from '../components/seo/SEOHead';

interface HomePageProps {
  onOpenWaitlist: (param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenWaitlist }) => {
  return (
    <div>
      <SEOHead
        title="Beyond Financials | Unified Digital Financial Services"
        description="Beyond Financials (beyondfinancials.ng) - One financial relationship, multiple financial services. Digital banking, savings, loans, payments, and wealth management built for Nigeria."
        canonicalPath="/"
      />

      <HeroSection onOpenWaitlist={onOpenWaitlist} />
      <ScopeBreakdownSection onOpenWaitlist={() => onOpenWaitlist()} />
      <PillarsSection onOpenWaitlist={onOpenWaitlist} />
      <ArchitecturePreview />
      <SecuritySection />
      <FAQSection />
    </div>
  );
};
