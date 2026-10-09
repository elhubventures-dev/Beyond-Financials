/**
 * Beyond Financials - Public Homepage (/ or /home)
 * 
 * Homepage for a pre-launch financial services company.
 * Hero, services, ecosystem, customer roadmap, security principles, and FAQ.
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
        description="Beyond Financials is preparing a connected financial platform for Nigeria — digital banking, savings, loans, payments, investments, and digital assets. Join the waitlist. Services are not live yet."
        canonicalPath="/"
      />

      <HeroSection onOpenWaitlist={onOpenWaitlist} />
      <PillarsSection onOpenWaitlist={onOpenWaitlist} />
      <ArchitecturePreview />
      <ScopeBreakdownSection onOpenWaitlist={() => onOpenWaitlist()} />
      <SecuritySection />
      <FAQSection />
    </div>
  );
};
