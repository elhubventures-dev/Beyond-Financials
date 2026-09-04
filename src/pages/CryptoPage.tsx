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
      desc: 'View supported stablecoins and major digital assets alongside your standard Nigerian Naira wallet in one clean, unified overview.',
      icon: <Coins className="w-5 h-5 text-amber-500" />,
    },
    {
      title: 'Crypto Account Funding',
      desc: 'Deposit supported digital currencies directly from external wallets and exchange balances to fund your Beyond Financials account.',
      icon: <Globe2 className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'Instant Local Currency Swaps',
      desc: 'Convert digital assets seamlessly into your primary wallet balance to make everyday utility payments and transfers.',
      icon: <ArrowRightLeft className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Institutional Custody & Security',
      desc: 'Multi-signature cold storage vaults and proactive automated transaction monitoring to protect your keys and funds.',
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
        badgeLabel="Strategic Web3 Vision"
      />

      {/* Narrative Overview */}
      <ServiceOverview
        title="Making Digital Assets Practical for Real-World Utility"
        subtitle="Demystifying digital assets and bridging decentralized protocols with everyday Nigerian banking and commerce."
        category={service.category}
        narrativeParagraphs={[
          'Digital currencies are transforming international commerce and cross-border remittances across the African continent. However, managing crypto has historically required navigating complex exchanges, opaque fee structures, and disjointed conversion routes.',
          'Beyond Financials Crypto is envisioned as a secure, beginner-friendly bridge. Rather than treating crypto as a disconnected speculative island, our roadmap integrates digital assets directly into your primary financial profile—enabling you to receive cross-border funds, hold stablecoins, and convert seamlessly to pay bills or fund savings.',
        ]}
        keyHighlights={[
          'Intuitive, jargon-free interface suitable for both beginners and experienced asset holders',
          'Instant deposit addresses to receive payments from international clients and partners',
          'Real-time conversion into primary wallet funds for local transfer settlement',
          'Strict adherence to Central Bank of Nigeria (CBN) and SEC digital asset compliance standards',
          'Zero fabricated prices or volatile speculative tickers in our preview architecture',
        ]}
        ecosystemConnectionText="Digital assets will live side-by-side with your fiat accounts on the same double-entry ledger, providing unified transaction histories and simplified accounting."
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
              Cryptocurrency features are part of our Phase 2 future strategic roadmap and will be deployed in strict compliance with the Central Bank of Nigeria (CBN) operational guidelines and the Securities and Exchange Commission (SEC) Virtual Asset Service Provider (VASP) rules. Live crypto deposits and swaps are not active in this development build.
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
