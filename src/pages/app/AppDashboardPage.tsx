/**
 * Beyond Financials - Customer Portal Dashboard Overview
 * Route: /app
 * 
 * Demonstrates identity status, account tier, security posture, and upcoming service roadmap
 * while maintaining non-banking boundaries (no mock ledgers or financial balances).
 */

import React from 'react';
import { AppShell } from '../../components/app/AppShell';
import { useAuth } from '../../providers/AuthProvider';
import { Link } from '../../router/Router';
import { Badge } from '../../components/ui/Badge';
import {
  ShieldCheck,
  User,
  KeyRound,
  ArrowRight,
  Clock,
  Landmark,
  PiggyBank,
  HandCoins,
  ReceiptText,
  TrendingUp,
  Coins,
  ExternalLink,
  Lock,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

export const AppDashboardPage: React.FC = () => {
  const { user, session } = useAuth();

  if (!user) return null;

  const formatDate = (isoDate: string | null) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (isoDate: string | null) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const roadmapModules = [
    {
      title: 'Digital Banking Accounts',
      desc: 'Accounts, wallets, and transfers for everyday money.',
      badge: 'Coming Soon',
      icon: <Landmark className="w-5 h-5 text-[#0046AD]" />,
    },
    {
      title: 'Disciplined Savings Vaults',
      desc: 'Goal savings and flexible ways to set money aside. Rates are not published.',
      badge: 'Coming Soon',
      icon: <PiggyBank className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: 'Transparent Credit & Loans',
      desc: 'Automated credit assessment, salary advances, and structured SME financing.',
      badge: 'Coming Soon',
      icon: <HandCoins className="w-5 h-5 text-amber-600" />,
    },
    {
      title: 'Everyday Utility Payments',
      desc: 'Airtime, data, electricity, and other everyday bills.',
      badge: 'Coming Soon',
      icon: <ReceiptText className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Capital Market Investments',
      desc: 'A future place to explore investments. Nothing is for sale today.',
      badge: 'Planned',
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Digital Assets & Multi-Currency',
      desc: 'Future digital-asset services. No prices are shown.',
      badge: 'Planned',
      icon: <Coins className="w-5 h-5 text-amber-500" />,
    },
  ];

  return (
    <AppShell activeTab="dashboard">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#001B40] to-[#0046AD] rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold tracking-wider uppercase mb-3 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your profile is ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user.firstName} {user.lastName}
            </h1>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              Your profile is created. Financial services are not open yet. You can review your details and sign-in security here.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/app/profile"
                className="px-4 py-2 bg-white text-[#001B40] text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#0046AD]" />
                <span>Manage Profile</span>
              </Link>
              <Link
                to="/app/security"
                className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Security & Sessions</span>
              </Link>
            </div>
          </div>

          <div className="absolute right-[-20px] bottom-[-30px] opacity-10 pointer-events-none hidden lg:block">
            <ShieldCheck className="w-72 h-72 text-white" />
          </div>
        </div>

        {/* Identity & Account Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Identity Tier */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Identity Tier
              </span>
              <Badge variant="blue" size="sm">
                Tier 0 Registered
              </Badge>
            </div>
            <div className="text-lg font-black text-[#001B40]">
              Account Active
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Identity is saved. Verification for financial services will be explained before it is required.
            </p>
          </div>

          {/* Security Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Security Posture
              </span>
              <Badge variant="emerald" size="sm" dot>
                Encrypted
              </Badge>
            </div>
            <div className="text-lg font-black text-[#001B40]">
              Sign-in protected
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your password is stored in a protected form. We will never ask you to share it.
            </p>
          </div>

          {/* Account Attributes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Member Since
              </span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-lg font-black text-[#001B40]">
              {formatDate(user.createdAt)}
            </div>
            <p className="text-xs text-slate-500 mt-1 truncate">
              Last Login: {formatDateTime(user.lastLoginAt)}
            </p>
          </div>
        </div>

        {/* Pre-launch Financial Architecture Notice */}
        <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong className="font-bold">Services are not open yet.</strong> You can use this area to manage your profile and sign-in. Accounts, savings, loans, payments, investments, and digital assets will appear here only when they are actually available.
          </div>
        </div>

        {/* Financial Services Roadmap Directory */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#001B40]">
                Upcoming services
              </h2>
              <p className="text-xs text-slate-500">
                What we are preparing. Nothing here can be used yet.
              </p>
            </div>
            <Link
              to="/services"
              className="text-xs font-bold text-[#0046AD] hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Public Services Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadmapModules.map((item) => (
              <div
                key={item.title}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {item.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                      item.badge.includes('Priority')
                        ? 'bg-amber-100 text-amber-800'
                        : item.badge.includes('Coming Soon')
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#001B40] mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
};
