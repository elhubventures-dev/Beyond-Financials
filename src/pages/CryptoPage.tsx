/**
 * Beyond Financials - Digital Assets & Cryptocurrency Page (/services/crypto)
 * 
 * Strategic roadmap product page explaining multi-asset wallet integration,
 * crypto-funded accounts, and digital asset exchange vision without live tickers or fabricated rates.
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
import { Coins, ShieldCheck, Globe2, ArrowRightLeft, Lock, Info } from 'lucide-react';

interface CryptoPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const CryptoPage: React.FC<CryptoPageProps> = ({ onOpenWaitlist }) => {
  const service = getServiceBySlug('crypto')!;

  const cryptoCapabilities = [
    {
      title: 'Multi-Asset Account Balances',
      desc: 'See digital assets next to your naira balance, when this service exists.',
      icon: <Coins className="w-5 h-5 text-amber-500" />,
    },
    {
      title: 'Crypto Account Funding',
      desc: 'A planned way to add money to your account using supported digital assets.',
      icon: <Globe2 className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Move between digital assets and naira',
      desc: 'A planned way to convert digital assets into money you can spend locally. Not available today.',
      icon: <ArrowRightLeft className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Careful safekeeping',
      desc: 'Digital-asset features are being designed so holdings stay protected. No live balances are shown here.',
      icon: <Lock className="w-5 h-5 text-indigo-600" />,
    },
  ];

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

      {/* Narrative Overview */}
      <ServiceOverview
        title="Digital assets, when the time is right"
        subtitle="Buying, selling, and using digital assets is part of the longer vision. It is not operational."
        category={service.category}
        narrativeParagraphs={[
          'Some people already use digital assets to get paid or to hold value. Beyond Financials wants that to sit beside everyday money, later.',
          'This page does not show prices, rates, or trading activity. You cannot buy, sell, or store digital assets here today.',
        ]}
        keyHighlights={[
          'A simple way to buy and sell digital assets, when the service exists',
          'A planned way to fund an account with digital assets',
          'Digital assets shown next to everyday money',
          'No prices or made-up trading data on this website',
          'Not available today',
        ]}
        ecosystemConnectionText="Digital assets are meant to sit beside your naira balance, so money and digital value can be understood together. That experience is planned, not live."
      />

      {/* Capabilities Spotlight Grid */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Planned Digital Asset Pillars
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              A Practical Approach to Digital Currency
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
              Designed around real-world utility: receiving global client payments, preserving value, and spending locally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptoCapabilities.map((item, idx) => (
              <Card
                key={idx}
                variant="default"
                className="p-6 rounded-2xl border border-gray-200/90 bg-[#F8FAFC] space-y-3 hover:border-[#0046AD]/40 hover:shadow-md transition-all"
              >
                <div className="p-3 rounded-xl bg-white border border-gray-200 w-fit shadow-2xs">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold font-display text-[#001B40]">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Notice Banner */}
      <section className="py-12 bg-slate-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#001B40]">
                Digital Asset Regulatory Status & Transparency
              </h3>
            </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Cryptocurrency features are planned and are not available. This website does not show prices or trading activity, and it does not claim the approvals those services would need. Digital assets can lose money.
              </p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <FeatureGrid
        id="features"
        badge="Digital Asset Scope"
        title="Engineered for Practical Utility"
        subtitle="Explore our conceptual multi-asset integration features."
        features={service.features}
      />

      {/* Benefits Breakdown */}
      <ServiceBenefits
        badge="Real-World Use Cases"
        title="Who Benefits from Digital Asset Integration"
        subtitle="From cross-border freelancers to forward-thinking merchants and crypto beginners."
        benefits={service.benefits}
      />

      {/* How It Operates */}
      <ServiceHowItWorks
        badge="Workflow Vision"
        title="How Crypto Integration Will Work"
        subtitle="A secure, compliant workflow linking digital assets to your fiat wallet."
        steps={service.workflow}
      />

      {/* Service FAQs */}
      <ServiceFAQ
        badge="Security & Compliance"
        title="Crypto Frequently Asked Questions"
        subtitle="Answers regarding regulations, custody safety, and roadmap launch timelines."
        faqs={service.faqs}
      />

      {/* Related Services */}
      <RelatedServices
        currentSlug="crypto"
        relatedSlugs={service.relatedServiceSlugs}
        title="Explore Connected Financial Services"
        subtitle="See how digital assets will link seamlessly with digital banking and investment portfolios."
      />

      {/* High-Converting Waitlist Strip */}
      <ServiceWaitlistCTA
        serviceTitle="Beyond Financials Crypto"
        interestCategory={service.waitlistInterest}
        buttonText={service.waitlistButtonText}
        headline="Join the Crypto Interest List"
        subheadline="Register now for early access, beta testing invitations, and regulatory rollout milestones for our digital asset services."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
