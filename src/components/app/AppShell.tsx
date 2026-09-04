/**
 * Beyond Financials - Authenticated Customer Application Shell
 * 
 * Layout Architecture:
 * - Desktop: Sticky Left Sidebar + Top Bar + Responsive Content Canvas
 * - Mobile: Top Navigation Drawer + Bottom Navigation Bar
 * - Future financial modules preserved with clean "Roadmap" / "Coming Soon" badges
 * - Strictly respects non-banking / pre-launch milestone boundaries
 */

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { Link, useRouter } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import { BrandLogo } from '../ui/BrandLogo';
import { Badge } from '../ui/Badge';
import {
  LayoutDashboard,
  User,
  Shield,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  HandCoins,
  ReceiptText,
  TrendingUp,
  Coins,
  Headphones,
  LogOut,
  Bell,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  Lock,
  Layers,
} from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  activeTab?: 'dashboard' | 'profile' | 'security';
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeTab = 'dashboard' }) => {
  const { user, session, logout, isAuthenticated, isLoading } = useAuth();
  const { pathname, navigate } = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Redirect to /login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#0046AD] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-700">Loading Beyond Financials Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.roles.includes('ADMIN' as any) || user.roles.includes('SUPER_ADMIN' as any);

  const navGroups = [
    {
      label: 'Identity & Account',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard Overview',
          path: '/app',
          icon: <LayoutDashboard className="w-4 h-4" />,
          active: pathname === '/app',
        },
        {
          id: 'profile',
          label: 'Customer Profile',
          path: '/app/profile',
          icon: <User className="w-4 h-4" />,
          active: pathname === '/app/profile',
        },
        {
          id: 'security',
          label: 'Security & Sessions',
          path: '/app/security',
          icon: <Shield className="w-4 h-4" />,
          active: pathname === '/app/security',
        },
      ],
    },
    {
      label: 'Financial Services Roadmap',
      items: [
        {
          id: 'wallet',
          label: 'Wallet & Accounts',
          path: '#',
          icon: <Wallet className="w-4 h-4 text-slate-400" />,
          badge: 'Coming Soon',
          isFuture: true,
        },
        {
          id: 'transfers',
          label: 'Transfers & Payouts',
          path: '#',
          icon: <ArrowLeftRight className="w-4 h-4 text-slate-400" />,
          badge: 'Phase 1',
          isFuture: true,
        },
        {
          id: 'savings',
          label: 'Disciplined Savings',
          path: '#',
          icon: <PiggyBank className="w-4 h-4 text-slate-400" />,
          badge: 'Phase 1',
          isFuture: true,
        },
        {
          id: 'loans',
          label: 'Transparent Credit',
          path: '#',
          icon: <HandCoins className="w-4 h-4 text-slate-400" />,
          badge: 'Priority',
          isFuture: true,
        },
        {
          id: 'payments',
          label: 'Everyday Payments',
          path: '#',
          icon: <ReceiptText className="w-4 h-4 text-slate-400" />,
          badge: 'Phase 1',
          isFuture: true,
        },
        {
          id: 'investments',
          label: 'Capital Markets',
          path: '#',
          icon: <TrendingUp className="w-4 h-4 text-slate-400" />,
          badge: 'Roadmap',
          isFuture: true,
        },
        {
          id: 'crypto',
          label: 'Digital Assets',
          path: '#',
          icon: <Coins className="w-4 h-4 text-slate-400" />,
          badge: 'Roadmap',
          isFuture: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row text-slate-900 font-sans">
      {/* ==================================================== */}
      {/* DESKTOP SIDEBAR NAVIGATION */}
      {/* ==================================================== */}
      <aside className="hidden md:flex flex-col w-64 bg-[#001B40] text-white border-r border-slate-800 flex-shrink-0 z-30 sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="focus:outline-none">
            <BrandLogo size="md" variant="white" />
          </Link>
        </div>

        {/* User Identity Chip */}
        <div className="p-4 mx-3 my-3 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0046AD] text-white font-bold flex items-center justify-center text-sm shadow-inner">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {user.status}
            </span>
            <span className="text-slate-400 font-mono">
              {user.roles.includes('ADMIN' as any) ? 'ADMIN' : 'RETAIL'}
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {group.label}
              </div>
              {group.items.map((item) => {
                if (item.isFuture) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 opacity-60 cursor-not-allowed select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-bold">
                        {item.badge}
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      item.active
                        ? 'bg-[#0046AD] text-white shadow-xs'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Admin Lead Desk Link (if admin) */}
          {isAdmin && (
            <div className="space-y-1 pt-2 border-t border-white/10">
              <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                Administrative Tools
              </div>
              <Link
                to="/admin/leads"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/10 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Lead Desk & Acquisition</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                  ADMIN
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar Footer & Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ==================================================== */}
      {/* MOBILE TOP BAR */}
      {/* ==================================================== */}
      <div className="md:hidden sticky top-0 z-40 bg-[#001B40] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <Link to="/" className="focus:outline-none">
          <BrandLogo size="sm" variant="white" />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 rounded-lg bg-white/10 text-white focus:outline-none"
            aria-label="Open Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MOBILE DRAWER */}
      {/* ==================================================== */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative flex flex-col w-4/5 max-w-xs bg-[#001B40] text-white p-4 shadow-xl z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <BrandLogo size="sm" variant="white" />
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xs font-bold text-white">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[10px] text-slate-400">{user.email}</div>
              </div>

              <div className="space-y-1">
                <Link
                  to="/app"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                    pathname === '/app' ? 'bg-[#0046AD] text-white' : 'text-slate-300'
                  }`}
                >
                  Dashboard Overview
                </Link>
                <Link
                  to="/app/profile"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                    pathname === '/app/profile' ? 'bg-[#0046AD] text-white' : 'text-slate-300'
                  }`}
                >
                  Customer Profile
                </Link>
                <Link
                  to="/app/security"
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-bold ${
                    pathname === '/app/security' ? 'bg-[#0046AD] text-white' : 'text-slate-300'
                  }`}
                >
                  Security & Sessions
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/leads"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="block px-3 py-2 rounded-lg text-xs font-bold text-amber-300 bg-amber-500/10"
                  >
                    Lead Management Desk
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  logout();
                }}
                className="w-full py-2 bg-red-500/20 text-red-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ==================================================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 md:pb-0">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-[#001B40]">
              {pathname === '/app'
                ? 'Customer Portal Overview'
                : pathname === '/app/profile'
                ? 'Profile & Identity Details'
                : pathname === '/app/security'
                ? 'Security, Password & Session Management'
                : 'Customer Area'}
            </h2>
            <Badge variant="blue" size="sm">
              Identity Foundation Active
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Icon (Placeholder for future notifications) */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
                aria-label="View Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-slate-400 font-medium">1 new</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs">
                      <div className="font-bold text-[#0046AD]">Identity Foundation Active</div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Your account authentication credentials have been verified securely.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#0046AD] text-white text-xs font-bold flex items-center justify-center">
                  {user.firstName[0]}
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {user.firstName} {user.lastName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                  </div>

                  <Link
                    to="/app/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/app/security"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-slate-400" />
                    <span>Security & Sessions</span>
                  </Link>

                  <Link
                    to="/"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>Public Website</span>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>

      {/* ==================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR */}
      {/* ==================================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex items-center justify-around py-2 shadow-lg">
        <Link
          to="/app"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/app' ? 'text-[#0046AD]' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/app/profile"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/app/profile' ? 'text-[#0046AD]' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </Link>
        <Link
          to="/app/security"
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            pathname === '/app/security' ? 'text-[#0046AD]' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Security</span>
        </Link>
        <Link
          to="/services"
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400"
        >
          <Layers className="w-5 h-5" />
          <span>Services</span>
        </Link>
      </nav>
    </div>
  );
};
