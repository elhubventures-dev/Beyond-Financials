/**
 * Beyond Financials - Transparent Credit & Financing Page (/services/loans)
 * 
 * HIGH-PRIORITY ACQUISITION PAGE
 * Educates prospective borrowers across salary earners, civil servants, entrepreneurs,
 * and consumers while routing interest into the waitlist.
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
import { ShieldCheck, UserCheck, Briefcase, GraduationCap, HeartHandshake, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoansPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

export const LoansPage: React.FC<LoansPageProps> = ({ onOpenWaitlist }) => {
  const service = getServiceBySlug('loans')!;

  const financingCategories = [
    {
      title: 'Salary Advance & Payroll Financing',
      audience: 'Salary Earners & Civil Servants',
      icon: <UserCheck className="w-5 h-5 text-[#0046AD]" />,
      description:
        'Bridge temporary cash gaps between paychecks. Verified employees and civil servants can access advance credit aligned with their monthly salary inflow.',
    },
    {
      title: 'SME & Business Working Capital',
      audience: 'Entrepreneurs & Merchants',
      icon: <Briefcase className="w-5 h-5 text-emerald-600" />,
      description:
        'Fund fast-moving inventory purchases, fulfill supplier purchase orders, and scale commercial turnover with tailored business financing facilities.',
    },
    {
      title: 'Personal Cash Flow Financing',
      audience: 'General Consumers & Families',
      icon: <HeartHandshake className="w-5 h-5 text-indigo-600" />,
      description:
        'Manage major planned life milestones, home improvements, or annual school fee payments with predictable, transparent instalment structures.',
    },
    {
      title: 'Emergency Safety Net Credit',
      audience: 'Urgent Unplanned Needs',
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
      description:
        'Handle unexpected medical situations or urgent repairs with rapid evaluation and respectful, confidential service without predatory terms.',
    },
    {
      title: 'Education & Skill Development Credit',
      audience: 'Students & Young Adults',
      icon: <GraduationCap className="w-5 h-5 text-amber-600" />,
      description:
        'Finance tuition fees, professional certifications, and technical equipment with structured student-friendly repayment arrangements.',
    },
    {
      title: 'Future Specialized Financing',
      audience: 'Expanding Product Vision',
      icon: <Lock className="w-5 h-5 text-slate-600" />,
      description:
        'Specialized agricultural input credit, asset lease financing, and device financing planned for subsequent platform rollout phases.',
    },
  ];

  return (
    <div className="bg-[#F8FAFC]">
      <SEOHead
        title={service.metaTitle}
        description={service.metaDescription}
        canonicalPath={service.canonicalPath}
      />

      {/* High-Impact Hero */}
      <ServiceHero
        service={service}
        onOpenWaitlist={onOpenWaitlist}
        badgeLabel="High-Priority Credit Acquisition"
      />

      {/* Product Categories Section (Crucial for High-Priority Acquisition) */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <Badge variant="amber" size="md">
              Planned Financing Solutions
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              Financing Designed for Every Real-World Need
            </h2>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
              Beyond Financials is developing ethical, transparent credit products tailored to the diverse financial realities of salary earners, business owners, students, and families across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financingCategories.map((cat, idx) => (
              <Card
                key={idx}
                variant="default"
                className="p-6 rounded-2xl border border-gray-200/90 bg-[#F8FAFC] space-y-4 flex flex-col justify-between hover:border-[#0046AD]/40 hover:shadow-md transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-2xs">
                      {cat.icon}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {cat.audience}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-[#001B40]">
                    {cat.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200/80 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-700">Coming soon</span>
                  <button
                    onClick={() => onOpenWaitlist('personal_loans')}
                    className="text-xs font-bold text-[#0046AD] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Pre-Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Overview */}
      <ServiceOverview
        title="Dignified, Transparent Credit Without Predatory Traps"
        subtitle="We believe credit should be a springboard for financial progress—not an endless cycle of anxiety, opaque charges, or privacy invasion."
        category={service.category}
        narrativeParagraphs={[
          'Access to credit should be understandable. Beyond Financials is preparing loans for salary earners, civil servants, entrepreneurs, business owners, and households.',
          'We will not publish amounts, rates, or approval times until they are confirmed. Any future offer will show its terms before you accept it. We will not contact your friends or family about your finances.',
        ]}
        keyHighlights={[
          'Designed for salary earners, civil servants, entrepreneurs, and households',
          'Terms shown before you accept anything',
          'No contact with your phone book',
          'Applications are not open yet',
          'Joining the interest list is not an approval',
        ]}
        ecosystemConnectionText="When lending opens, an approved amount is intended to arrive in your Beyond Financials account so you can use it for the reason you borrowed."
      />

      {/* Engineered Features Grid */}
      <FeatureGrid
        id="features"
        badge="What loans will cover"
        title="Financing with clear terms"
        subtitle="Loans are coming soon. Rates, amounts, and eligibility are not published."
        features={service.features}
      />

      {/* Target Audience Benefits */}
      <ServiceBenefits
        badge="Audience Breakdown"
        title="Tailored Solutions for Real Financial Profiles"
        subtitle="Engineered to serve salary earners, business builders, students, and households."
        benefits={service.benefits}
      />

      {/* How It Works */}
      <ServiceHowItWorks
        badge="Application Journey"
        title="How the Lending Workflow Operates"
        subtitle="A secure, digital process designed for speed, privacy, and transparent underwriting."
        steps={service.workflow}
      />

      {/* Service FAQs */}
      <ServiceFAQ
        badge="Ethical Standards"
        title="Financing Frequently Asked Questions"
        subtitle="Clear answers about eligibility, data privacy, and early access pre-qualification."
        faqs={service.faqs}
      />

      {/* Cross-Linking */}
      <RelatedServices
        currentSlug="loans"
        relatedSlugs={service.relatedServiceSlugs}
        title="Explore Connected Financial Services"
        subtitle="See how credit links seamlessly with your digital wallet and savings pools."
      />

      {/* High-Priority Waitlist CTA */}
      <ServiceWaitlistCTA
        serviceTitle="Beyond Financials Financing"
        interestCategory="personal_loans"
        buttonText="Join the Loan Interest List"
        headline="Join the loan interest list"
        subheadline="Tell us you want to hear about loans. This is not an application, and it is not an approval."
        onOpenWaitlist={onOpenWaitlist}
      />
    </div>
  );
};
