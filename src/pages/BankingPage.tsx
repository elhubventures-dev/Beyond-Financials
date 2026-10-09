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
        badgeLabel="Digital banking"
      />

      {/* Narrative Overview */}
      <ServiceOverview
        title="Everyday money, in one place"
        subtitle="Accounts, wallets, transfers, and a clear history — coming soon, not open today."
        category={service.category}
        narrativeParagraphs={[
          'Managing everyday money should feel straightforward. Beyond Financials is preparing digital accounts so you can see what you have, receive money, and look back at what you spent.',
          'When accounts open, a dedicated account number is intended to help you receive salary, transfers, and payments from clients. That service is not available yet.',
        ]}
        keyHighlights={[
          'A dedicated account number linked to your profile, when accounts open',
          'Transfers to other banks and wallets, when transfers become available',
          'A clear history of money in and money out',
          'Identity checks before higher-value features are opened',
          'Savings and spending kept visually separate',
        ]}
        ecosystemConnectionText="Your account is meant to be the centre. Money you receive can later fund savings, bills, or a loan repayment — once those services are open."
      />

      {/* Capabilities & Feature Grid */}
      <FeatureGrid
        id="features"
        badge="What to expect"
        title="What digital banking will include"
        subtitle="These capabilities are coming soon. They are not available today."
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
        subtitle="What people ask before accounts open."
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
        headline="Join the banking waitlist"
        subheadline="Register your interest. We will tell you when account opening begins. This does not reserve an account number."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
