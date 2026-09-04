/**
 * Beyond Financials - Reusable Feature Card & Grid Components
 * 
 * Clean visual presentation of capabilities without claiming non-operational status.
 */

import React from 'react';
import { ServiceFeatureItem } from '../../types/services';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle, Zap, Shield, Sparkles, Layers, Cpu, ArrowUpRight } from 'lucide-react';

export interface FeatureCardProps {
  feature: ServiceFeatureItem;
  index: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => {
  return (
    <Card
      variant="default"
      className="flex flex-col justify-between border border-gray-200/90 bg-white hover:border-[#0046AD]/40 hover:shadow-md transition-all group"
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0046AD] flex items-center justify-center font-mono font-bold text-xs group-hover:bg-[#0046AD] group-hover:text-white transition-colors">
            {String(index + 1).padStart(2, '0')}
          </div>
          {feature.tag && (
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
              {feature.tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold font-display text-[#001B40] group-hover:text-[#0046AD] transition-colors">
            {feature.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
            {feature.description}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px]">Ledger Sync: Active</span>
        <CheckCircle className="w-4 h-4 text-emerald-500" />
      </div>
    </Card>
  );
};

export interface FeatureGridProps {
  id?: string;
  badge?: string;
  title: string;
  subtitle: string;
  features: ServiceFeatureItem[];
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  id = 'features',
  badge = 'Engineered Capabilities',
  title,
  subtitle,
  features,
}) => {
  return (
    <section id={id} className="py-20 bg-[#F8FAFC] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <Badge variant="blue" size="md">
            {badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#001B40] tracking-tight">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed font-normal">
            {subtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <FeatureCard key={idx} feature={feat} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
