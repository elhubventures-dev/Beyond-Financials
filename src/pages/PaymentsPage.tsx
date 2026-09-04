/**
 * Beyond Financials - Everyday Utility & Bill Payments Page (/services/payments)
 * 
 * Educational product page detailing Airtime, Data, Electricity DISCOs,
 * Cable TV, Broadband, Government, and Education bill payments.
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
import { Zap, Smartphone, Tv, Wifi, Landmark, GraduationCap } from 'lucide-react';

interface PaymentsPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ onOpenWaitlist }) => {
  const service = getServiceBySlug('payments')!;

  const billCategories = [
    {
      name: 'Electricity DISCOs',
      desc: 'Instant prepaid token generation and postpaid bill settlement across all major Nigerian electricity distribution companies.',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      name: 'Airtime & Mobile Data',
      desc: 'Instant top-ups for MTN, Airtel, Glo, and 9mobile with saved beneficiaries and automated top-up schedules.',
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
    },
    {
      name: 'Cable TV & Entertainment',
      desc: 'Seamless renewals for DStv, GOtv, and StarTimes packages with instant decoder reconnection verification.',
      icon: <Tv className="w-5 h-5 text-blue-600" />,
    },
    {
      name: 'Broadband & Fiber Internet',
      desc: 'Keep Spectranet, Smile, Swift, and home fiber connections active with one-click subscription renewals.',
      icon: <Wifi className="w-5 h-5 text-teal-600" />,
    },
    {
      name: 'Government & State Levies',
      desc: 'Settle state and federal revenue charges, business registrations, and municipal permits with verifiable digital receipts.',
      icon: <Landmark className="w-5 h-5 text-indigo-600" />,
    },
    {
      name: 'Education & Exam Pins',
      desc: 'Purchase WAEC, NECO, and JAMB registration pins securely and instantly from your mobile interface.',
      icon: <GraduationCap className="w-5 h-5 text-rose-600" />,
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
        badgeLabel="Everyday Utility & Bills"
      />

      {/* Bill Categories Visual Breakdown */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="blue" size="md">
              Supported Bill Categories
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Essential Utilities, Sourced in Real Time
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
              Beyond Financials is integrating directly with major utility, telecom, and revenue billers across Nigeria so you never experience interrupted power, dropped calls, or disconnected entertainment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billCategories.map((bill, idx) => (
              <Card
                key={idx}
                variant="default"
                className="p-6 rounded-2xl border border-gray-200/90 bg-[#F8FAFC] space-y-3 hover:border-[#0046AD]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
                    {bill.icon}
                  </div>
                  <h3 className="text-base font-bold font-display text-[#001B40]">
                    {bill.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                  {bill.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Overview */}
      <ServiceOverview
        title="Dependable Payments Without Network Headaches"
        subtitle="Built on robust aggregator integrations and state-machine ledger protection to ensure zero missing tokens or uncredited debits."
        category={service.category}
        narrativeParagraphs={[
          'We have all experienced the frustration of paying for electricity only for the meter token to stall indefinitely, or buying airtime that fails while debiting your account. Beyond Financials Payments addresses this with strict transaction reconciliation.',
          'Every utility payment is backed by our double-entry ledger state machine. If an external aggregator fails to deliver a token, our system automatically tracks the status, prevents double-debiting, and provides transparent digital receipts for every successful charge.',
        ]}
        keyHighlights={[
          'Instant meter token delivery directly on screen and backed up via SMS',
          'Beneficiary management for one-tap family and office recurring recharges',
          'Official downloadable PDF receipts for tax and corporate accounting',
          'Automated recurring payment schedules for monthly broadband and utilities',
          'Integrated accounting into your central Beyond Financials statement',
        ]}
        ecosystemConnectionText="Pay bills straight out of your primary account balance or dedicate specific savings pockets for upcoming utility dues."
      />

      {/* Feature Capabilities Grid */}
      <FeatureGrid
        id="features"
        badge="Payment Features"
        title="Engineered for Everyday Utility"
        subtitle="Explore our Phase 1 utility bill payment capabilities."
        features={service.features}
      />

      {/* Target Benefits */}
      <ServiceBenefits
        badge="Practical Utility"
        title="Zero Hassle for Homes and Businesses"
        subtitle="Designed to keep households powered, teams connected, and agents productive."
        benefits={service.benefits}
      />

      {/* How It Works */}
      <ServiceHowItWorks
        badge="Payment Steps"
        title="How Paying Bills Works"
        subtitle="A four-step flow delivering instant tokens and digital confirmation."
        steps={service.workflow}
      />

      {/* Service FAQs */}
      <ServiceFAQ
        badge="Reliability & Support"
        title="Payments Frequently Asked Questions"
        subtitle="Answers regarding supported billers, failed transaction resolution, and receipts."
        faqs={service.faqs}
      />

      {/* Related Services */}
      <RelatedServices
        currentSlug="payments"
        relatedSlugs={service.relatedServiceSlugs}
        title="Explore Connected Financial Services"
        subtitle="See how everyday payments link with your digital wallet and savings pools."
      />

      {/* Waitlist CTA */}
      <ServiceWaitlistCTA
        serviceTitle="Beyond Financials Payments"
        interestCategory={service.waitlistInterest}
        buttonText={service.waitlistButtonText}
        headline="Join the Payments Early Access List"
        subheadline="Be among the first to experience lightning-fast, zero-headache utility payments with automatic receipt archiving."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
