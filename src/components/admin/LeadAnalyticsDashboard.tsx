/**
 * Beyond Financials - Acquisition & Waitlist Analytics Dashboard
 * 
 * DESIGN PRINCIPLES:
 * - Geometric Balance styling with high-contrast slate cards
 * - Clearly labeled strictly as PRE-LAUNCH ACQUISITION METRICS (no synthetic financial metrics)
 * - Interest breakdown and acquisition source distribution
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import {
  Users,
  UserPlus,
  UserCheck,
  CheckCircle2,
  UserMinus,
  Sparkles,
  TrendingUp,
  Landmark,
  PiggyBank,
  HandCoins,
  CreditCard,
  LineChart,
  Coins,
  Globe,
  Share2,
} from 'lucide-react';
import { LeadAnalyticsSummary, InterestCategory } from '../../types/domain';

interface LeadAnalyticsDashboardProps {
  summary: LeadAnalyticsSummary | null;
  isLoading: boolean;
  onFilterInterest?: (interest: InterestCategory) => void;
  onFilterStatus?: (status: string) => void;
}

export const LeadAnalyticsDashboard: React.FC<LeadAnalyticsDashboardProps> = ({
  summary,
  isLoading,
  onFilterInterest,
  onFilterStatus,
}) => {
  if (isLoading && !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl" />
        ))}
      </div>
    );
  }

  const total = summary?.totalLeads || 0;
  const newCount = summary?.newLeads || 0;
  const contactedCount = summary?.contactedLeads || 0;
  const qualifiedCount = summary?.qualifiedLeads || 0;
  const convertedCount = summary?.convertedLeads || 0;
  const unsubscribedCount = summary?.unsubscribedLeads || 0;

  const interestConfig: Array<{
    key: InterestCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    { key: 'BANKING', label: 'Digital Banking', icon: Landmark, color: 'text-blue-600' },
    { key: 'SAVINGS', label: 'Smart Savings', icon: PiggyBank, color: 'text-emerald-600' },
    { key: 'LOANS', label: 'Personal & SME Loans', icon: HandCoins, color: 'text-amber-600' },
    { key: 'PAYMENTS', label: 'Bill Payments', icon: CreditCard, color: 'text-indigo-600' },
    { key: 'INVESTMENTS', label: 'Investments (Future)', icon: LineChart, color: 'text-purple-600' },
    { key: 'CRYPTO', label: 'Crypto Assets (Future)', icon: Coins, color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Level Acquisition Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Leads */}
        <div
          id="stat-card-total"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
          onClick={() => onFilterStatus && onFilterStatus('ALL')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-blue-900" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-900">{total}</span>
            <span className="text-[10px] text-slate-500 font-medium">registered</span>
          </div>
        </div>

        {/* New Leads */}
        <div
          id="stat-card-new"
          className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-all cursor-pointer"
          onClick={() => onFilterStatus && onFilterStatus('NEW')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">New Leads</span>
            <UserPlus className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-blue-900">{newCount}</span>
            <Badge variant="blue" size="sm">
              {total > 0 ? `${Math.round((newCount / total) * 100)}%` : '0%'}
            </Badge>
          </div>
        </div>

        {/* Contacted */}
        <div
          id="stat-card-contacted"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-amber-300 transition-all cursor-pointer"
          onClick={() => onFilterStatus && onFilterStatus('CONTACTED')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Contacted</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-900">{contactedCount}</span>
            <Badge variant="warning" size="sm">
              In outreach
            </Badge>
          </div>
        </div>

        {/* Qualified */}
        <div
          id="stat-card-qualified"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
          onClick={() => onFilterStatus && onFilterStatus('QUALIFIED')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Qualified</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-900">{qualifiedCount}</span>
            <Badge variant="info" size="sm">
              High intent
            </Badge>
          </div>
        </div>

        {/* Converted */}
        <div
          id="stat-card-converted"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-emerald-300 transition-all cursor-pointer"
          onClick={() => onFilterStatus && onFilterStatus('CONVERTED')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Converted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-emerald-900">{convertedCount}</span>
            <Badge variant="success" size="sm">
              Early invited
            </Badge>
          </div>
        </div>

        {/* Unsubscribed */}
        <div
          id="stat-card-unsubscribed"
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-all cursor-pointer"
          onClick={() => onFilterStatus && onFilterStatus('UNSUBSCRIBED')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Opt-Outs</span>
            <UserMinus className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-display text-slate-700">{unsubscribedCount}</span>
            <Badge variant="default" size="sm">
              Unsubscribed
            </Badge>
          </div>
        </div>
      </div>

      {/* Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Interest Distribution */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Product Interest Distribution
              </h4>
              <p className="text-xs text-slate-500">
                Categorized demand expressed by prospective waitlist members
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {interestConfig.length} Categories
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {interestConfig.map((item) => {
              const count = summary?.byInterest?.[item.key] || 0;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  onClick={() => onFilterInterest && onFilterInterest(item.key)}
                  className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 truncate">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-lg font-bold font-display text-slate-900">{count}</span>
                    <span className="text-xs text-slate-500 font-medium">{percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Acquisition Source Attribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-600" />
                Acquisition Channels
              </h4>
              <p className="text-xs text-slate-500">
                Inbound source and conversion points
              </p>
            </div>
            <Share2 className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {summary?.bySource && Object.keys(summary.bySource).length > 0 ? (
              Object.entries(summary.bySource)
                .sort(([, a], [, b]) => Number(b) - Number(a))
                .map(([sourceName, countVal]) => {
                  const count = Number(countVal) || 0;
                  const share = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div
                      key={sourceName}
                      className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-semibold text-slate-700 capitalize">
                          {sourceName.toLowerCase().replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{count}</span>
                        <span className="text-slate-400 text-[10px]">({share}%)</span>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No channel data recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
