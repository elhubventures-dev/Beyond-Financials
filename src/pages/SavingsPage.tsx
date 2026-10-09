/**
 * Beyond Financials - Disciplined & Goal Savings Page (/services/savings)
 * 
 * Educational product page detailing Flexible Savings, Goal Vaults,
 * Locked Fixed Deposits, and Scheduled Auto-Save.
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

interface SavingsPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const SavingsPage: React.FC<SavingsPageProps> = ({ onOpenWaitlist }) => {
  const service = getServiceBySlug('savings')!;

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
        badgeLabel="Savings"
      />

      {/* Narrative Overview */}
      <ServiceOverview
        title="Save toward the things that matter"
        subtitle="Goal savings, flexible savings, and planned set-asides. Coming soon. No rates are published."
        category={service.category}
        narrativeParagraphs={[
          'Saving is easier when the money you want to keep is separate from the money you spend. Beyond Financials is preparing simple tools for that.',
          'You might set money aside for rent, school fees, or an emergency. Rates, minimums, and withdrawal rules are not invented here — they will be published only when they are real.',
        ]}
        keyHighlights={[
          'Flexible savings you can plan to use when life happens',
          'Goal savings with a target you can see',
          'An option to set money aside for a chosen period',
          'Scheduled saving, daily, weekly, or monthly',
          'A clear view of what you have set aside',
        ]}
        ecosystemConnectionText="Savings are meant to sit next to your account, so money you set aside stays organised. Both services are still coming soon."
      />

      {/* Feature Capabilities Grid */}
      <FeatureGrid
        id="features"
        badge="Savings Modalities"
        title="Engineered for Every Savings Horizon"
        subtitle="Ways to save that we are preparing. None of them are open, and no interest rate is shown."
        features={service.features}
      />

      {/* Target Audience Benefits */}
      <ServiceBenefits
        badge="Tailored Value"
        title="Smart Habits for Every Lifestyle"
        subtitle="Discover how structured savings helps families, salaried professionals, and entrepreneurs stay ahead."
        benefits={service.benefits}
      />

      {/* How Savings Works */}
      <ServiceHowItWorks
        badge="Step-by-Step"
        title="How Saving Works on Beyond Financials"
        subtitle="A straightforward, automated approach to hitting your savings targets consistently."
        steps={service.workflow}
      />

      {/* Service FAQs */}
      <ServiceFAQ
        badge="Clarity & Security"
        title="Savings Frequently Asked Questions"
        subtitle="Transparent answers regarding vault types, lock terms, and automated scheduling."
        faqs={service.faqs}
      />

      {/* Related Services */}
      <RelatedServices
        currentSlug="savings"
        relatedSlugs={service.relatedServiceSlugs}
        title="Connect Savings with Other Services"
        subtitle="See how disciplined savings integrates with your digital wallet and future wealth management."
      />

      {/* Waitlist CTA */}
      <ServiceWaitlistCTA
        serviceTitle="Beyond Financials Savings"
        interestCategory={service.waitlistInterest}
        buttonText={service.waitlistButtonText}
        headline="Start Building Your Goal Vaults"
        subheadline="Join the savings waitlist today to receive early access to flexible, locked, and automated goal vaults."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
