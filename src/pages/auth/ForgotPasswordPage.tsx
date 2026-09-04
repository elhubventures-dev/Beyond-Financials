/**
 * Beyond Financials - Forgot Password Page
 * Route: /forgot-password
 */

import React, { useState } from 'react';
import { Link, useRouter } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowLeft,
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devResetToken, setDevResetToken] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(email.trim());
      setIsSubmitted(true);
      if (res.devResetToken) {
        setDevResetToken(res.devResetToken);
      }
    } catch {
      setErrorMessage('Unable to process password reset request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-block focus:outline-none">
            <BrandLogo size="lg" />
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001B40] tracking-tight">
            Account Password Recovery
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {isSubmitted ? (
            <div className="text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-[#001B40]">
                Recovery Instructions Issued
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                If an active account is registered with <strong className="text-slate-900">{email}</strong>, password reset instructions have been safely recorded.
              </p>

              {devResetToken && (
                <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-left space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                    <span>Development Verification Helper</span>
                  </div>
                  <p className="text-xs text-blue-800">
                    A test recovery token was generated for local inspection.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/reset-password?token=${devResetToken}`)}
                    className="w-full py-2 bg-[#0046AD] hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Proceed to Reset Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0046AD] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{errorMessage}</p>
                  </div>
                </div>
              )}

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
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#0046AD] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Instructions...</span>
                    </div>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0046AD]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Enumeration-safe identity verification</span>
        </div>
      </div>
    </div>
  );
};
