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
      desc: 'Prepaid tokens and postpaid bills for electricity, when payments open.',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      name: 'Airtime & Mobile Data',
      desc: 'Airtime and data for major Nigerian networks, when payments open.',
      icon: <Smartphone className="w-5 h-5 text-emerald-600" />,
    },
    {
      name: 'Cable TV & Entertainment',
      desc: 'Renewals for popular cable TV packages, when payments open.',
      icon: <Tv className="w-5 h-5 text-blue-600" />,
    },
    {
      name: 'Broadband & Fiber Internet',
      desc: 'Home and mobile internet renewals, when payments open.',
      icon: <Wifi className="w-5 h-5 text-teal-600" />,
    },
    {
      name: 'Government & State Levies',
      desc: 'Selected government payments, when that category opens.',
      icon: <Landmark className="w-5 h-5 text-indigo-600" />,
    },
    {
      name: 'Education & Exam Pins',
      desc: 'Education payments such as exam pins, when that category opens.',
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
        title="Bills, when you need them paid"
        subtitle="Airtime, data, electricity, cable TV, internet, and other everyday payments. Coming soon."
        category={service.category}
        narrativeParagraphs={[
          'Paying for power, airtime, or television should be easy to understand. Beyond Financials is preparing those payments so they can live next to your account.',
          'These payments are not live. When they open, each payment is intended to show a clear result, so you can see whether it completed.',
        ]}
        keyHighlights={[
          'Airtime and mobile data',
          'Electricity for prepaid and postpaid meters',
          'Cable TV and internet renewals',
          'Selected education and government payments',
          'A receipt you can keep',
        ]}
        ecosystemConnectionText="Pay bills straight out of your primary account balance or dedicate specific savings pockets for upcoming utility dues."
      />

      {/* Feature Capabilities Grid */}
      <FeatureGrid
        id="features"
        badge="Payment Features"
        title="Everyday payments"
        subtitle="Categories we plan to support. None of them can be paid on this website today."
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
        subtitle="How a payment is intended to work, once the service opens."
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
