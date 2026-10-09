import React, { useState } from 'react';
import { Link } from '../../router/Router';
import { ArrowRight, Landmark, PiggyBank, HandCoins, Coins } from 'lucide-react';

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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0046AD] text-xs font-semibold tracking-wider uppercase w-max">
              Preparing to launch in Nigeria
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display leading-[1.1] text-[#001B40] tracking-tight">
              One platform for your<br />
              <span className="text-[#0046AD]">financial journey.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed font-normal">
              Beyond Financials is building a connected place for everyday money — accounts, savings, loans, payments, and future wealth services — for people and businesses across Nigeria.
            </p>

            <div className="flex flex-col gap-4 max-w-md mt-2">
              <form onSubmit={handleQuickSubmit} className="flex gap-2 p-1.5 bg-white border border-gray-200 rounded-xl shadow-xs focus-within:border-[#0046AD] focus-within:ring-2 focus-within:ring-[#0046AD]/10 transition-all">
                <label htmlFor="hero-email" className="sr-only">Email address</label>
                <input
                  id="hero-email"
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
                  Join the Waitlist
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-3 px-1">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0046AD] hover:underline"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-gray-500">Services are not live yet. Join to hear when they open.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full min-h-[380px] sm:min-h-[420px]">
            <div className="absolute inset-0 bg-[#0046AD] rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between p-7 sm:p-8 text-white">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#FBBF24] rounded-full opacity-20 pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white/10 rounded-xl rotate-12 pointer-events-none" />

              <div className="relative z-10 border-l-4 border-[#FBBF24] pl-4">
                <p className="text-xs uppercase tracking-widest text-blue-200 font-semibold">Coming soon</p>
                <p className="text-2xl font-bold font-display mt-0.5 text-white">Your money, in one place</p>
              </div>

              <div className="relative z-10 space-y-3.5 my-6">
                {[
                  { icon: <Landmark className="w-4 h-4" />, title: 'Digital banking', note: 'Accounts, wallets, and transfers' },
                  { icon: <PiggyBank className="w-4 h-4" />, title: 'Savings & loans', note: 'Goals, discipline, and fair credit' },
                  { icon: <HandCoins className="w-4 h-4" />, title: 'Everyday payments', note: 'Airtime, power, and bills' },
                  { icon: <Coins className="w-4 h-4" />, title: 'Wealth, later', note: 'Investments and digital assets' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/15">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#FBBF24] flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-white">{item.title}</p>
                      <p className="text-blue-100 text-xs opacity-85">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex items-center justify-between text-xs text-blue-200 pt-3 border-t border-white/15">
                <span>Nigeria, with an international outlook</span>
                <span className="text-[#FBBF24] font-semibold">Pre-launch</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-xs">
          <div className="lg:border-r lg:border-gray-100 lg:pr-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#F59E0B] mb-1">Coming soon</p>
            <p className="text-sm font-bold text-[#001B40]">Digital banking</p>
            <p className="text-xs text-gray-500 leading-relaxed">Accounts, wallets, transfers, and a clear view of your money.</p>
          </div>
          <div className="lg:border-r lg:border-gray-100 lg:pr-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#F59E0B] mb-1">Coming soon</p>
            <p className="text-sm font-bold text-[#001B40]">Savings</p>
            <p className="text-xs text-gray-500 leading-relaxed">Goal savings and flexible tools to build a steadier habit.</p>
          </div>
          <div className="lg:border-r lg:border-gray-100 lg:pr-4 space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#F59E0B] mb-1">Coming soon</p>
            <p className="text-sm font-bold text-[#001B40]">Loans</p>
            <p className="text-xs text-gray-500 leading-relaxed">Responsible financing for salary earners, civil servants, and businesses.</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Planned</p>
            <p className="text-sm font-bold text-gray-500">Investments & digital assets</p>
            <p className="text-xs text-gray-400 leading-relaxed">Wealth tools and digital-asset services, when they are ready.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
