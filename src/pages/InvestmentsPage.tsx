/**
 * Beyond Financials - Curated Investments & Wealth Page (/services/investments)
 * 
 * Strategic roadmap product page introducing the investment marketplace, portfolio tracking,
 * and wealth creation vision without fabricating fake listings or promising profit.
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
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { TrendingUp, ShieldAlert, Sparkles, PieChart, Landmark, Scale } from 'lucide-react';

interface InvestmentsPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ onOpenWaitlist }) => {
  const service = getServiceBySlug('investments')!;

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
        badgeLabel="Planned"
      />

      {/* Concept Architecture Overview */}
      <ServiceOverview
        title="A future place to grow wealth"
        subtitle="Investment services are planned. There are no products, prices, or returns on this page."
        category={service.category}
        narrativeParagraphs={[
          'Investments are a later part of Beyond Financials. The aim is a clear place to explore options and see what you hold, when that service exists.',
          'Nothing here is for sale. We do not show performance, and we do not promise returns. Any future product will explain its risks before you can invest.',
        ]}
        keyHighlights={[
          'A place to explore investment options, when they exist',
          'A clear view of what you hold',
          'Risks explained before you invest',
          'No fabricated performance on this website',
          'Not available today',
        ]}
        ecosystemConnectionText="If investments open later, money from them is intended to return to your Beyond Financials account. That service does not exist yet."
      />

      {/* Strict Regulatory & Risk Commitment Banner */}
      <section className="py-12 bg-slate-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#001B40]">
                Our Commitment to Capital Market Transparency
              </h3>
            </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Investments are planned and are not available. They can lose money. Beyond Financials does not promise returns, and this page does not show products or performance. We will not offer investments until the permissions those services require are in place.
              </p>
          </div>
        </div>
      </section>

      {/* Planned Feature Capabilities Grid */}
      <FeatureGrid
        id="features"
        badge="Future Capabilities"
        title="Vision for Wealth Management"
        subtitle="Explore our planned portfolio management and asset allocation tools."
        features={service.features}
      />

      {/* Audience Segment Benefits */}
      <ServiceBenefits
        badge="Wealth Perspectives"
        title="Designed for Every Stage of Capital"
        subtitle="How our planned investment tools will support beginners, experienced savers, and corporate treasuries."
        benefits={service.benefits}
      />

      {/* How It Operates */}
      <ServiceHowItWorks
        badge="Future Workflow"
        title="How Investing is Envisioned"
        subtitle="A risk-profiled, transparent process to explore and allocate capital."
        steps={service.workflow}
      />

      {/* Service FAQs */}
      <ServiceFAQ
        badge="Market Governance"
        title="Investments Frequently Asked Questions"
        subtitle="Clear answers about licensing, risk management, and launch roadmaps."
        faqs={service.faqs}
      />

      {/* Related Services */}
      <RelatedServices
        currentSlug="investments"
        relatedSlugs={service.relatedServiceSlugs}
        title="Explore Connected Financial Services"
        subtitle="See how investment portfolios will connect with savings vaults and digital assets."
      />

      {/* High-Impact Waitlist CTA */}
      <ServiceWaitlistCTA
        serviceTitle="Beyond Financials Investments"
        interestCategory={service.waitlistInterest}
        buttonText={service.waitlistButtonText}
        headline="Join the Investment Interest List"
        subheadline="Register your interest to receive exclusive research updates and priority invitations as regulated investment products approach launch."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
