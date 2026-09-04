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
        badgeLabel="Disciplined Capital Growth"
      />

      {/* Narrative Overview */}
      <ServiceOverview
        title="Cultivating Discipline Through Thoughtful Architecture"
        subtitle="Automated savings tools engineered to help you accumulate reserves, budget for life events, and lock funds away from impulsive spending."
        category={service.category}
        narrativeParagraphs={[
          'Building lasting financial security starts with consistency. Beyond Financials Savings removes the willpower burden from saving money by providing flexible and locked savings vaults tailored to your exact timeline and goals.',
          'Whether you are setting aside small amounts daily from business revenue, scheduling automated payday debits, or locking away capital for major annual expenses like rent or school fees, our multi-vault structure keeps your money organized and protected within our double-entry ledger.',
        ]}
        keyHighlights={[
          'Flexible Savings pocket accessible anytime for unexpected emergencies',
          'Goal-Based Target Vaults with visual percentage trackers and target deadlines',
          'Locked Fixed Deposits designed to enforce strict capital preservation',
          'Automated recurring auto-save schedules (daily, weekly, or monthly)',
          'Independent ledger balance isolation keeping saved funds safe from daily spend',
        ]}
        ecosystemConnectionText="Your savings pockets are directly linked to your primary digital wallet. Top up instantly or configure automated rules that quietly sweep spare cash into your goal vaults."
      />

      {/* Feature Capabilities Grid */}
      <FeatureGrid
        id="features"
        badge="Savings Modalities"
        title="Engineered for Every Savings Horizon"
        subtitle="Explore the four core savings modes built into our contracted Phase 1 deliverable scope."
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
