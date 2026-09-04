/**
 * Beyond Financials - Reset Password Page
 * Route: /reset-password
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Link, useRouter } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { resetPasswordWithToken } = useAuth();
  const { navigate } = useRouter();

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extract token from URL search query on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        setToken(urlToken);
      }
    }
  }, []);

  const passwordCriteria = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(newPassword),
    };
  }, [newPassword]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.length) score += 1;
    if (passwordCriteria.uppercase && passwordCriteria.lowercase) score += 1;
    if (passwordCriteria.number) score += 1;
    if (passwordCriteria.special) score += 1;
    return score;
  }, [passwordCriteria]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim()) {
      setErrorMessage('A valid password reset token is required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('The passwords entered do not match.');
      return;
    }

    if (passwordScore < 4) {
      setErrorMessage('Please satisfy all password security requirements before proceeding.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPasswordWithToken(token.trim(), newPassword, confirmPassword);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to reset password. The recovery link may be expired or invalid.');
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
            Set New Password
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Create a secure new password for your Beyond Financials account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {isSuccess ? (
            <div className="text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-[#001B40]">Password Reset Complete</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your account password has been updated. All previous sessions have been revoked for your security.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-[#0046AD] hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Sign In with New Password</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="token" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Reset Token
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="token"
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="reset_..."
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    New Password
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {newPassword.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordScore === 1
                              ? 'w-1/4 bg-red-500'
                              : passwordScore === 2
                              ? 'w-2/4 bg-amber-500'
                              : passwordScore === 3
                              ? 'w-3/4 bg-yellow-500'
                              : passwordScore >= 4
                              ? 'w-full bg-emerald-500'
                              : 'w-0'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-500">
                        <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? 'text-emerald-700 font-semibold' : ''}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${passwordCriteria.length ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>8+ characters</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCriteria.uppercase && passwordCriteria.lowercase ? 'text-emerald-700 font-semibold' : ''}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${passwordCriteria.uppercase && passwordCriteria.lowercase ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>Upper & lower</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCriteria.number ? 'text-emerald-700 font-semibold' : ''}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${passwordCriteria.number ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 number</span>
                        </div>
                        <div className={`flex items-center gap-1.5 ${passwordCriteria.special ? 'text-emerald-700 font-semibold' : ''}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${passwordCriteria.special ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 special symbol</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                    />
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
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted cryptographic session validation</span>
        </div>
      </div>
    </div>
  );
};
