/**
 * Beyond Financials - Service Overview Section
 * 
 * Deep-dive educational narrative explaining the problem context and user empowerment.
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, Sparkles, Layers, ShieldCheck } from 'lucide-react';

export interface ServiceOverviewProps {
  title: string;
  subtitle: string;
  narrativeParagraphs: string[];
  keyHighlights: string[];
  category: string;
  ecosystemConnectionText?: string;
}

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({
  title,
  subtitle,
  narrativeParagraphs,
  keyHighlights,
  category,
  ecosystemConnectionText,
}) => {
  return (
    <section className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-6">
            <Badge variant="blue" size="md">
              Ecosystem Overview &bull; {category}
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
              {title}
            </h2>

            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              {subtitle}
            </p>

            <div className="space-y-4 text-base text-gray-500 leading-relaxed">
              {narrativeParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {ecosystemConnectionText && (
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-[#001B40] flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#0046AD] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Unified Ecosystem Integration</p>
                  <p className="text-slate-600 mt-0.5">{ecosystemConnectionText}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Highlights Card */}
          <div className="lg:col-span-5">
            <Card variant="muted" className="bg-[#F8FAFC] border border-gray-200/90 space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0046AD] text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-display text-[#001B40]">
                  What this includes
                </h3>
              </div>

              <p className="text-xs text-gray-500">
                A plain-language look at what this service is meant to do. It is not open yet.
              </p>

              <ul className="space-y-3.5">
                {keyHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#0046AD] flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-gray-200 text-center">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  beyondfinancials.ng · Pre-launch
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
