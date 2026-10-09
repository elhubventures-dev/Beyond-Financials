/**
 * Beyond Financials - Shared Service Hero Component
 * 
 * High-impact hero section tailored for public service education and user acquisition.
 */

import React from 'react';
import { ServiceDefinition } from '../../types/services';
import { ServiceStatusBadge } from './ServiceStatusBadge';
import { Link } from '../../router/Router';
import { ChevronRight, ArrowRight, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export interface ServiceHeroProps {
  service: ServiceDefinition;
  onOpenWaitlist: (interest?: string) => void;
  badgeLabel?: string;
}

export const ServiceHero: React.FC<ServiceHeroProps> = ({
  service,
  onOpenWaitlist,
  badgeLabel,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#001B40] to-[#00265C] text-white pt-12 pb-20 lg:pt-16 lg:pb-24 border-b border-[#06285A]">
      {/* Geometric background accents */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#0046AD] blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#FBBF24] blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/services" className="hover:text-white transition-colors">
            Services
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#FBBF24] font-semibold">{service.title}</span>
        </nav>

        {/* Hero Content Header */}
        <div className="max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/15 text-xs font-bold uppercase tracking-wider">
              {badgeLabel || service.category}
            </span>
            <ServiceStatusBadge status={service.status} size="md" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
            {service.tagline}
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-3xl font-normal">
            {service.fullDescription}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onOpenWaitlist(service.waitlistInterest)}
              className="bg-[#FBBF24] text-[#001B40] px-8 py-4 rounded-full font-bold text-base hover:bg-yellow-400 active:bg-yellow-500 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{service.waitlistButtonText}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#features"
              className="px-6 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <span>See what is planned</span>
            </a>
          </div>

          {/* Architectural Trust Strip */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
              <span>Not available yet</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Your information stays private</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Join the waitlist for updates</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
