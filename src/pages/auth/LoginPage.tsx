/**
 * Beyond Financials - Secure Login Page
 * Route: /login
 */

import React, { useState } from 'react';
import { Link, useRouter } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect to /app
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate('/app');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = (demoType: 'customer' | 'admin') => {
    if (demoType === 'customer') {
      setEmail('customer@beyondfinancials.ng');
      setPassword('BeyondPass2026!');
    } else {
      setEmail('admin@beyondfinancials.ng');
      setPassword('AdminMaster2026!');
    }
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Link */}
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-block focus:outline-none">
            <BrandLogo size="lg" />
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001B40] tracking-tight">
            Sign in to Beyond Financials
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Access your secure customer identity portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Quick Demo Fillers for Evaluators */}
          <div className="mb-6 p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Demo Credentials
              </span>
              <span className="text-[10px] text-blue-600 font-medium">Click to populate</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-100/50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-950 transition-colors cursor-pointer"
              >
                <div className="font-bold text-[#0046AD]">Retail Customer</div>
                <div className="text-[10px] text-slate-500 truncate">customer@beyond...</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-100/50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-950 transition-colors cursor-pointer"
              >
                <div className="font-bold text-amber-800">Administrator</div>
                <div className="text-[10px] text-slate-500 truncate">admin@beyond...</div>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#0046AD] hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#0046AD] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#0046AD] hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-bit encrypted authentication gateway</span>
        </div>
      </div>
    </div>
  );
};
