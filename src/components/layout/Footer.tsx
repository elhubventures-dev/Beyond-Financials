/**
 * Beyond Financials - Primary Footer Component
 * 
 * Public footer. Customer links only. Admin tools are not linked from here.
 */

import React from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { Link } from '../../router/Router';
import { ShieldCheck, Lock, Landmark, Globe2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#001B40] text-slate-300 border-t border-[#06285A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block focus:outline-none">
              <BrandLogo variant="monochrome-white" size="lg" />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              One place for your financial journey. Beyond Financials is preparing digital banking, savings, loans, payments, and future wealth services for people and businesses in Nigeria.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-white font-mono text-xs border border-white/15">
                beyondfinancials.ng
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[#0046AD] text-white font-semibold text-xs border border-blue-400/30">
                Nigeria Nationwide
              </span>
            </div>
          </div>

          {/* Services Hub & Product Information Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Services Hub
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/services" className="hover:text-white font-semibold text-slate-300 transition-colors flex items-center gap-1.5">
                  <span>All Services Hub</span>
                  <ArrowRight className="w-3 h-3 text-[#FBBF24]" />
                </Link>
              </li>
              <li>
                <Link to="/services/banking" className="hover:text-white transition-colors">
                  Digital Banking
                </Link>
              </li>
              <li>
                <Link to="/services/savings" className="hover:text-white transition-colors">
                  Disciplined Savings
                </Link>
              </li>
              <li>
                <Link to="/services/loans" className="hover:text-white transition-colors">
                  Transparent Loans
                </Link>
              </li>
              <li>
                <Link to="/services/payments" className="hover:text-white transition-colors">
                  Everyday Payments
                </Link>
              </li>
              <li>
                <Link to="/services/investments" className="hover:text-white transition-colors">
                  Investments (Future)
                </Link>
              </li>
              <li>
                <Link to="/services/crypto" className="hover:text-white transition-colors">
                  Digital Assets (Future)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Trust & Information
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Beyond Financials
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy (Pre-Launch)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service (Pre-Launch)
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Our promise
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Clear service status</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#FBBF24]" />
                <span>Careful with your information</span>
              </li>
              <li className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-blue-400" />
                <span>No live services yet</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-indigo-400" />
                <span>Nigeria, internationally minded</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Project Disclaimer */}
        <div className="pt-8 space-y-4 text-xs text-slate-400 leading-relaxed">
          <div className="p-4 rounded-xl bg-black/30 border border-white/10">
            <p className="font-semibold text-slate-200 mb-1">
              Pre-launch notice
            </p>
            <p className="text-slate-400">
              Beyond Financials is preparing to launch. Services described on this website are not operational unless a page explicitly says they are available. Investments, digital assets, and international services are planned. Joining the waitlist registers your interest. It does not open an account, approve a loan, or reserve a product. Beyond Financials is not a licensed bank, and this website does not claim regulatory approvals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-400 text-xs">
            <p>&copy; {new Date().getFullYear()} Beyond Financials. All rights reserved.</p>
            <span>Pre-launch · beyondfinancials.ng</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
