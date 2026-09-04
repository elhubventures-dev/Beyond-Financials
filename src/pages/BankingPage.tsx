/**
 * Beyond Financials - Digital Banking & Accounts Page (/services/banking)
 * 
 * Educational product page for customer accounts, virtual accounts, digital wallets,
 * money transfers, and transaction ledger history.
 */

import React from 'react';
import { getServiceBySlug } from '../data/servicesData';
import { SEOHead } from '../components/seo/SEOHead';
import { ServiceHero } from '../components/services/ServiceHero';
import { ServiceOverview } from '../components/services/ServiceOverview';
import { FeatureGrid } from '../components/services/FeatureGrid';
import { ServiceBenefits } from '../components/services/ServiceBenefits';
import { ServiceHowItWorks } from '../components/services/ServiceHowItWorks';
import { ServiceFAQ } from '../components/services/ServiceFAQ';
import { RelatedServices } from '../components/services/RelatedServices';
import { ServiceWaitlistCTA } from '../components/services/ServiceWaitlistCTA';

interface BankingPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const BankingPage: React.FC<BankingPageProps> = ({ onOpenWaitlist }) => {
  const service = getServiceBySlug('banking')!;

  return (
    <div className="bg-[#F8FAFC]">
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonicalPath={service.canonicalPath}
      />

      {/* Hero Section */}
      <ServiceHero
        service={service}
        onOpenWaitlist={onOpenWaitlist}
        badgeLabel="Core Banking Infrastructure"
      />

      {/* Narrative Overview */}
      <ServiceOverview
        title="Reinventing Your Daily Financial Experience"
        subtitle="A high-performance digital wallet and dedicated virtual account system designed to eliminate banking friction."
        category={service.category}
        narrativeParagraphs={[
          'Managing everyday money shouldn’t require waiting in physical bank branches, dealing with unexpected transaction failures, or navigating confusing multi-screen apps. Beyond Financials Banking is engineered to provide high-speed, transparent digital accounts where every inflow, debit, and transfer is updated in real time.',
          'Your dedicated virtual account acts as an open receiver for commercial bank deposits, payroll transfers, and client invoices. Built on a strict double-entry ledger foundation, our architecture ensures absolute transactional precision and instant downloadable statements for your personal and commercial records.',
        ]}
        keyHighlights={[
          'Dedicated virtual account identifier mapped to your verified profile',
          'Instant interbank transfers across all commercial banks and mobile wallets in Nigeria',
          'Clean, categorized transaction history with instant digital receipt generation',
          'Tiered KYC verification matching Central Bank of Nigeria (CBN) regulatory guidelines',
          'Strict segregation of spending balances, savings reserves, and float balances',
        ]}
        ecosystemConnectionText="Your banking account serves as the central hub. Funds deposited into your virtual account instantly become available to fund goal savings, disburse into bill payments, or service credit facilities."
      />

      {/* Capabilities & Feature Grid */}
      <FeatureGrid
        id="features"
        badge="Engineered Capabilities"
        title="Modern Features for Frictionless Money"
        subtitle="Explore the contracted Phase 1 digital banking capabilities currently under active development."
        features={service.features}
      />

      {/* Segment Benefits */}
      <ServiceBenefits
        badge="Targeted Benefits"
        title="Built for How Nigerians Live and Work"
        subtitle="Whether managing household cash or running a growing business, our account structure adapts to your flow."
        benefits={service.benefits}
      />

      {/* How It Works */}
      <ServiceHowItWorks
        badge="Onboarding Flow"
        title="How Account Setup Works"
        subtitle="A streamlined digital journey from initial registration to your first transaction."
        steps={service.workflow}
      />

      {/* Service FAQs */}
      <ServiceFAQ
        badge="Regulatory & Usage"
        title="Banking Frequently Asked Questions"
        subtitle="Honest, transparent answers regarding account operations, security, and our partner architecture."
        faqs={service.faqs}
      />

      {/* Internal Ecosystem Cross-Linking */}
      <RelatedServices
        currentSlug="banking"
        relatedSlugs={service.relatedServiceSlugs}
        title="Connect Banking with Other Services"
        subtitle="Discover how your account seamlessly powers automated savings, credit access, and bill payments."
      />

      {/* High-Converting Waitlist Strip */}
      <ServiceWaitlistCTA
        serviceTitle="Beyond Financials Banking"
        interestCategory={service.waitlistInterest}
        buttonText={service.waitlistButtonText}
        headline="Claim Your Virtual Account Early"
        subheadline="Join the priority waitlist to secure early access and your personalized account number when Phase 1 onboarding opens."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
