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
        badgeLabel="Strategic Vision & Wealth"
      />

      {/* Concept Architecture Overview */}
      <ServiceOverview
        title="Democratizing Capital Growth with Institutional Transparency"
        subtitle="Bridging the gap between everyday savers and structured, vetted wealth-building opportunities in partnership with licensed asset managers."
        category={service.category}
        narrativeParagraphs={[
          'True financial independence requires long-term capital compounding. Beyond Financials Investments is being conceptualized to give everyday retail investors and SME treasuries structured access to institutional asset classes that were historically reserved for high-net-worth elites.',
          'In alignment with our strict transparency ethos, all future investment products will be originated by licensed capital market operators, accompanied by full prospectus disclosures, independent trustee oversight, and clear risk parameters. We do not invent fake historical returns or guarantee speculative profits.',
        ]}
        keyHighlights={[
          'Curated marketplace of vetted commercial paper, fixed income, and institutional notes',
          'Consolidated visual portfolio tracker showing asset maturity and historical distributions',
          'Fractional investment thresholds allowing participation with accessible capital',
          'Automated yield and dividend compounding into designated goal vaults',
          'Institutional reporting and audit-ready tax documentation',
        ]}
        ecosystemConnectionText="When active, your investment returns and matured principal will settle seamlessly into your primary wallet balance or roll over into new target portfolios."
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
              Beyond Financials does not promise speculative or guaranteed returns. All real-world investments carry risk, including the possible loss of principal. Future offerings will be strictly conducted in collaboration with SEC-licensed capital market operators under applicable Nigerian securities laws.
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
