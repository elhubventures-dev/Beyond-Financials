/**
 * Beyond Financials - Email verification
 * Route: /verify-email?token=...
 * The link does not verify on GET. Confirmation is an explicit POST.
 */

import React, { useState } from 'react';
import { Link } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { CheckCircle2, AlertCircle, Mail } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const { refreshSession } = useAuth();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const token = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('token') || ''
    : '';

  const handleVerify = async () => {
    if (!token) {
      setStatus('error');
      setMessage('This verification link is missing a token.');
      return;
    }

    setStatus('submitting');
    setMessage(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setStatus('error');
        setMessage(result.message || 'This verification link is invalid or has expired.');
        return;
      }
      setStatus('success');
      setMessage(result.message || 'Your email address has been verified.');
      await refreshSession();
    } catch {
      setStatus('error');
      setMessage('Unable to reach Beyond Financials. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0046AD] rounded-md">
            <BrandLogo size="lg" />
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001B40] tracking-tight">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Confirm the email address on your Beyond Financials account.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10 space-y-4">
          {status === 'success' ? (
            <div role="status" className="text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm text-slate-700">{message}</p>
              <Link to="/app/profile" className="inline-block text-sm font-bold text-[#0046AD] hover:underline">
                Go to your profile
              </Link>
            </div>
          ) : (
            <>
              {message && (
                <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{message}</p>
                </div>
              )}
              <button
                type="button"
                onClick={handleVerify}
                disabled={status === 'submitting' || !token}
                className="w-full py-3 px-4 rounded-xl bg-[#0046AD] hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0046AD] focus-visible:ring-offset-2"
              >
                <Mail className="w-4 h-4" />
                <span>{status === 'submitting' ? 'Verifying...' : 'Verify email address'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
