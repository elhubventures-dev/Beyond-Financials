/**
 * Beyond Financials - Waitlist unsubscribe confirmation
 * Route: /unsubscribe?token=...
 * Opening the link does not unsubscribe. The visitor confirms with a button.
 */

import React, { useState } from 'react';
import { Link } from '../router/Router';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const UnsubscribePage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const token = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('token') || ''
    : '';

  const handleUnsubscribe = async () => {
    if (!token) {
      setStatus('error');
      setMessage('This unsubscribe link is missing a token.');
      return;
    }

    setStatus('submitting');
    setMessage(null);

    try {
      const response = await fetch('/api/waitlist/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setStatus('error');
        setMessage(result.message || 'This unsubscribe link is invalid or has expired.');
        return;
      }
      setStatus('success');
      setMessage(result.message || 'You are unsubscribed from Beyond Financials waitlist updates.');
    } catch {
      setStatus('error');
      setMessage('Unable to reach Beyond Financials. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-extrabold font-display text-[#001B40]">
        Waitlist email preferences
      </h1>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">
        This stops future Beyond Financials waitlist updates for the registration linked to this email. It does not delete a message you already received.
      </p>

      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6">
        {status === 'success' ? (
          <div role="status" className="space-y-3">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            <p className="text-sm text-slate-700">{message}</p>
            <Link to="/" className="inline-block text-sm font-bold text-[#0046AD] hover:underline">
              Return to the website
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {message && (
              <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800 flex gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleUnsubscribe}
              disabled={status === 'submitting' || !token}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#0046AD] text-white text-sm font-bold disabled:opacity-60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0046AD] focus-visible:ring-offset-2"
            >
              {status === 'submitting' ? 'Updating preference...' : 'Unsubscribe from waitlist updates'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
