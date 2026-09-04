/**
 * Beyond Financials - Related Services Cross-Linking Component
 * 
 * Enables natural exploration across interconnected financial ecosystem products.
 */

import React from 'react';
import { getServiceBySlug, SERVICES_LIST } from '../../data/servicesData';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { Link } from '../../router/Router';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface RelatedServicesProps {
  currentSlug: string;
  relatedSlugs: string[];
  title?: string;
  subtitle?: string;
}

export const RelatedServices: React.FC<RelatedServicesProps> = ({
  currentSlug,
  relatedSlugs,
  title = 'Explore the Connected Ecosystem',
  subtitle = 'Beyond Financials integrates every module into a single unified account and ledger.',
}) => {
  const related = relatedSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter(Boolean)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="py-20 bg-[#F8FAFC] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <Badge variant="blue" size="md">
              Unified Ecosystem
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#001B40] tracking-tight">
              {title}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-normal">
              {subtitle}
            </p>
          </div>

          <Link
            to="/services"
            className="text-sm font-bold text-[#0046AD] hover:text-[#001B40] flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All 6 Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {related.map((service) => {
            if (!service) return null;
            return (
              <Card
                key={service.id}
                variant="default"
                className="flex flex-col justify-between border border-gray-200/90 bg-white hover:border-[#0046AD]/40 hover:shadow-md transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#0046AD]">
                      {service.category}
                    </span>
                    <ServiceStatusBadge status={service.status} size="sm" />
                  </div>

                  <h3 className="text-lg font-bold font-display text-[#001B40] group-hover:text-[#0046AD] transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    {service.phase}
                  </span>
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0046AD] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
