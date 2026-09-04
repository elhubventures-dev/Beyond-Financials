/**
 * Beyond Financials - Primary Header Navigation
 * 
 * Includes desktop mega-menu/dropdown for all 6 service pages,
 * direct link to Services Hub (/services), cross-page anchor routing,
 * and simplified responsive mobile menu.
 */

import React, { useState, useRef, useEffect } from 'react';
import { BrandLogo } from '../ui/BrandLogo';
import { Badge } from '../ui/Badge';
import { Link, useRouter } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Landmark,
  PiggyBank,
  HandCoins,
  ReceiptText,
  TrendingUp,
  Coins,
  Layers,
  Sparkles,
  User,
  LayoutDashboard,
} from 'lucide-react';

interface HeaderProps {
  onOpenWaitlist: (interest?: string) => void;
  serverHealthy: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({ onOpenWaitlist, serverHealthy }) => {
  const { pathname, navigate } = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const servicesList = [
    {
      slug: 'banking',
      title: 'Digital Banking',
      desc: 'Accounts, virtual accounts & transfers',
      icon: <Landmark className="w-4 h-4 text-[#0046AD]" />,
      badge: 'Phase 1',
    },
    {
      slug: 'savings',
      title: 'Disciplined Savings',
      desc: 'Goal vaults & locked deposits',
      icon: <PiggyBank className="w-4 h-4 text-emerald-600" />,
      badge: 'Phase 1',
    },
    {
      slug: 'loans',
      title: 'Transparent Credit',
      desc: 'Salary advance & business loans',
      icon: <HandCoins className="w-4 h-4 text-amber-600" />,
      badge: 'Priority',
    },
    {
      slug: 'payments',
      title: 'Everyday Payments',
      desc: 'Airtime, power DISCOs & bills',
      icon: <ReceiptText className="w-4 h-4 text-teal-600" />,
      badge: 'Phase 1',
    },
    {
      slug: 'investments',
      title: 'Investments',
      desc: 'Portfolios & capital markets',
      icon: <TrendingUp className="w-4 h-4 text-indigo-600" />,
      badge: 'Roadmap',
    },
    {
      slug: 'crypto',
      title: 'Digital Assets',
      desc: 'Crypto & multi-asset wallets',
      icon: <Coins className="w-4 h-4 text-amber-500" />,
      badge: 'Roadmap',
    },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnchorClick = (anchor: string) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      const elem = document.getElementById(anchor);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${anchor}`);
    }
  };

  const isServicesActive = pathname.startsWith('/services');

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo Link */}
          <Link
            to="/"
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0046AD] rounded-lg"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600" aria-label="Main Navigation">
            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1.5 py-2 hover:text-[#0046AD] transition-colors cursor-pointer ${
                  isServicesActive ? 'text-[#0046AD] font-bold' : ''
                }`}
                aria-expanded={servicesDropdownOpen}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-[#0046AD]' : 'text-slate-400'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/90 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Financial Ecosystem
                    </span>
                    <Link
                      to="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="text-xs font-bold text-[#0046AD] hover:underline"
                    >
                      View All Hub
                    </Link>
                  </div>

                  <div className="space-y-1">
                    {servicesList.map((svc) => (
                      <Link
                        key={svc.slug}
                        to={`/services/${svc.slug}`}
                        onClick={() => setServicesDropdownOpen(false)}
                        className={`flex items-start gap-3 p-2.5 rounded-xl transition-colors hover:bg-slate-50 ${
                          pathname === `/services/${svc.slug}` ? 'bg-blue-50/70' : ''
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 mt-0.5 flex-shrink-0">
                          {svc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#001B40] leading-snug">
                              {svc.title}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                svc.badge === 'Priority'
                                  ? 'bg-amber-100 text-amber-800'
                                  : svc.badge === 'Phase 1'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {svc.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 truncate mt-0.5">
                            {svc.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 px-2">
                    <Link
                      to="/services"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-[#0046AD] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Explore Complete Directory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Page Links */}
            <Link
              to="/about"
              className={`hover:text-[#0046AD] transition-colors ${
                pathname === '/about' ? 'text-[#0046AD] font-bold' : ''
              }`}
            >
              About
            </Link>

            <Link
              to="/security"
              className={`hover:text-[#0046AD] transition-colors ${
                pathname === '/security' ? 'text-[#0046AD] font-bold' : ''
              }`}
            >
              Security
            </Link>

            <Link
              to="/faq"
              className={`hover:text-[#0046AD] transition-colors ${
                pathname === '/faq' ? 'text-[#0046AD] font-bold' : ''
              }`}
            >
              FAQ
            </Link>

            <Link
              to="/contact"
              className={`hover:text-[#0046AD] transition-colors ${
                pathname === '/contact' ? 'text-[#0046AD] font-bold' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Status Chip & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Badge variant={serverHealthy ? 'emerald' : serverHealthy === false ? 'danger' : 'blue'} dot>
              {serverHealthy ? 'System Active' : serverHealthy === false ? 'Connecting...' : 'Foundation Active'}
            </Badge>

            {isAuthenticated && user ? (
              <Link
                to="/app"
                className="px-4 py-2 rounded-full bg-[#001B40] text-white hover:bg-slate-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Portal ({user.firstName})</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:text-[#0046AD] hover:border-[#0046AD] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={() => onOpenWaitlist()}
              className="bg-[#FBBF24] text-[#001B40] px-5 py-2.5 rounded-full font-bold text-xs hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Join Waitlist</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="bg-[#001B40] text-white px-3 py-1.5 rounded-full font-bold text-xs"
              >
                Portal
              </Link>
            ) : (
              <Link
                to="/login"
                className="border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full font-bold text-xs"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={() => onOpenWaitlist()}
              className="bg-[#FBBF24] text-[#001B40] px-3 py-1.5 rounded-full font-bold text-xs hover:bg-yellow-400 transition-colors shadow-2xs"
            >
              Waitlist
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</span>
            <Badge variant="blue" size="sm">Phase 1 Dev Shell</Badge>
          </div>

          {/* Services Section with Expandable Sub-items */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-[#001B40]"
              >
                Services Hub
              </Link>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="p-1 text-slate-500 hover:text-[#0046AD]"
                aria-label="Expand Services"
              >
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </div>

            {mobileServicesOpen && (
              <div className="pl-4 pr-2 py-2 space-y-1 border-l-2 border-blue-200 ml-3">
                {servicesList.map((svc) => (
                  <Link
                    key={svc.slug}
                    to={`/services/${svc.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-2 text-sm font-semibold text-slate-700 hover:text-[#0046AD]"
                  >
                    <span>{svc.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {svc.badge}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Page Links */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0046AD] rounded-lg transition-colors"
          >
            About Beyond Financials
          </Link>

          <Link
            to="/security"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0046AD] rounded-lg transition-colors"
          >
            Security & Architecture
          </Link>

          <Link
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0046AD] rounded-lg transition-colors"
          >
            Frequently Asked Questions
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#0046AD] rounded-lg transition-colors"
          >
            Contact & Inquiries
          </Link>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWaitlist();
              }}
              className="w-full bg-[#FBBF24] text-[#001B40] py-3 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join Early Access Waitlist</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
