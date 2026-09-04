import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Landmark,
  Sparkles,
  CheckCircle,
  Database,
  Lock,
  Activity,
  Server,
} from 'lucide-react';

interface HeroSectionProps {
  onOpenWaitlist: (email?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWaitlist }) => {
  const [quickEmail, setQuickEmail] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenWaitlist(quickEmail.trim() || undefined);
  };

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] text-[#1E293B] pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-gray-100">
      {/* Background Subtle Geometric Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Geometric Balance Split Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Core Value Proposition & Acquisition */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            {/* Geometric Pill Badge */}
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0046AD] text-xs font-semibold tracking-wider uppercase w-max">
              Market: Nigeria Nationwide
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] text-[#001B40] tracking-tight">
              One financial relationship,<br />
              <span className="text-[#0046AD]">multiple services.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed font-normal">
              Beyond Financials is the digital ecosystem for Nigerian entrepreneurs, students, and salary earners. Secure, unified, and engineered for growth.
            </p>

            {/* Quick Email Acquisition Form */}
            <div className="flex flex-col gap-4 max-w-md mt-2">
              <form onSubmit={handleQuickSubmit} className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-xl shadow-xs focus-within:border-[#0046AD] focus-within:ring-2 focus-within:ring-[#0046AD]/10 transition-all">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="flex-grow px-4 outline-none text-sm text-slate-900 placeholder:text-gray-400 bg-transparent min-w-0"
                />
                <button
                  type="submit"
                  className="bg-[#0046AD] text-white px-5 sm:px-6 py-3 rounded-lg font-bold text-sm whitespace-nowrap hover:bg-[#00388A] active:bg-[#002B6B] transition-colors cursor-pointer"
                >
                  Secure My Spot
                </button>
              </form>

              {/* Social Proof Stack */}
              <div className="flex items-center gap-3 text-xs text-gray-500 px-1">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-700">T</div>
                  <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">A</div>
                  <div className="w-6 h-6 rounded-full bg-[#0046AD] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">B</div>
                </div>
                <span>Join 2,400+ people on the waitlist</span>
              </div>
            </div>
          </div>

          {/* Right Column: Geometric Interactive Blueprint Card */}
          <div className="lg:col-span-5 relative w-full h-[380px] sm:h-[420px]">
            <div className="absolute inset-0 bg-[#0046AD] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between p-7 sm:p-8 text-white">
              {/* Geometric Accents */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FBBF24] rounded-full opacity-20 pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white/10 rounded-xl rotate-12 pointer-events-none" />

              {/* Top Accent Header */}
              <div className="relative z-10 border-l-4 border-[#FBBF24] pl-4">
                <p className="text-xs uppercase tracking-widest text-blue-200 font-semibold">Foundation Phase</p>
                <p className="text-2xl font-bold font-display mt-0.5 text-white">Architecting Trust</p>
              </div>

              {/* Middle Dynamic Telemetry Blocks */}
              <div className="relative z-10 space-y-3.5 my-auto">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/15">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold text-white">System Health</p>
                    <p className="text-blue-100 text-xs opacity-85">Foundation Core: Active</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/15">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-bold text-white">API Architecture</p>
                    <p className="text-blue-100 text-xs opacity-85">Provider Adapters: Ready</p>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata */}
              <div className="relative z-10 flex items-center justify-between text-xs text-blue-200 pt-3 border-t border-white/15 font-mono">
                <span>Domain: beyondfinancials.ng</span>
                <span className="text-[#FBBF24] font-semibold">₦3.5M / 8–10 Wks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Geometric Balance Strip: Feature Cadence */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-xs">
          <div className="lg:border-r lg:border-gray-100 lg:pr-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#F59E0B] mb-1">Coming Phase 1</p>
            <p className="text-sm font-bold text-[#001B40]">Digital Banking</p>
            <p className="text-xs text-gray-500 leading-relaxed">Tiered wallets, BVN/NIN verification, & interbank transfers.</p>
          </div>

          <div className="lg:border-r lg:border-gray-100 lg:pr-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#F59E0B] mb-1">Coming Phase 1</p>
            <p className="text-sm font-bold text-[#001B40]">Smart Savings</p>
            <p className="text-xs text-gray-500 leading-relaxed">Goal-based, flexible, and locked savings designed for Nigerians.</p>
          </div>

          <div className="lg:border-r lg:border-gray-100 lg:pr-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#F59E0B] mb-1">Coming Phase 1</p>
            <p className="text-sm font-bold text-[#001B40]">Business Loans</p>
            <p className="text-xs text-gray-500 leading-relaxed">Flexible repayment tracking for entrepreneurs and salary earners.</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Future Strategy</p>
            <p className="text-sm font-bold text-gray-500">Global Ecosystem</p>
            <p className="text-xs text-gray-400 leading-relaxed">Crypto exchange, international transfers, and investment products.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

