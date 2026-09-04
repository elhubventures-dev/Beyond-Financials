import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, ShieldAlert, Sparkles, ArrowRight, Lock } from 'lucide-react';
import { WaitlistInterestCategory, WaitlistSubmission } from '../../types/domain';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterest?: string;
  defaultEmail?: string;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  defaultInterest,
  defaultEmail,
}) => {
  const [formData, setFormData] = useState<WaitlistSubmission>({
    firstName: '',
    lastName: '',
    email: defaultEmail || '',
    phoneNumber: '',
    primaryInterest: 'digital_banking',
    customerSegment: 'individual',
    notes: '',
    consentAccepted: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverSuccess, setServerSuccess] = useState<{
    referenceId: string;
    message: string;
    alreadyRegistered?: boolean;
  } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: defaultEmail }));
    }
  }, [defaultEmail]);

  useEffect(() => {
    if (defaultInterest) {
      const lower = defaultInterest.toLowerCase().trim();
      const mappedInterest: Record<string, WaitlistInterestCategory> = {
        banking: 'digital_banking',
        digital_banking: 'digital_banking',
        savings: 'smart_savings',
        smart_savings: 'smart_savings',
        loans: 'personal_loans',
        personal_loans: 'personal_loans',
        business_financing: 'business_financing',
        bills: 'bill_payments',
        payments: 'bill_payments',
        bill_payments: 'bill_payments',
        merchants: 'merchant_services',
        merchant_services: 'merchant_services',
        investments: 'investments_future',
        investments_future: 'investments_future',
        crypto: 'crypto_future',
        crypto_future: 'crypto_future',
      };
      if (mappedInterest[lower]) {
        setFormData((prev) => ({ ...prev, primaryInterest: mappedInterest[lower] }));
      }
    }
  }, [defaultInterest]);

  const interestOptions = [
    { value: 'digital_banking', label: 'Digital Banking & Virtual Accounts' },
    { value: 'smart_savings', label: 'Disciplined & Goal Savings' },
    { value: 'personal_loans', label: 'Personal Credit & Salary Advance' },
    { value: 'business_financing', label: 'SME & Business Financing' },
    { value: 'bill_payments', label: 'Utility & Bill Payments' },
    { value: 'merchant_services', label: 'Merchant Collections & Settlement' },
    { value: 'investments_future', label: 'Investment Portfolios (Future Waitlist)' },
    { value: 'crypto_future', label: 'Crypto & Digital Assets (Future Waitlist)' },
  ];

  const segmentOptions = [
    { value: 'individual', label: 'Retail Consumer / Individual' },
    { value: 'salary_earner', label: 'Salary Earner / Civil Servant' },
    { value: 'business_owner', label: 'Entrepreneur / Business Owner' },
    { value: 'student', label: 'Student / Young Adult' },
    { value: 'other', label: 'Other / Agent Operator' },
  ];

  const validateClient = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.consentAccepted) {
      errs.consentAccepted = 'Please acknowledge consent for onboarding notifications.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateClient()) return;

    // Parse URL params for attribution
    let utmSource: string | undefined;
    let utmMedium: string | undefined;
    let utmCampaign: string | undefined;
    let utmContent: string | undefined;
    let refCode: string | undefined;

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      utmSource = urlParams.get('utm_source') || undefined;
      utmMedium = urlParams.get('utm_medium') || undefined;
      utmCampaign = urlParams.get('utm_campaign') || undefined;
      utmContent = urlParams.get('utm_content') || undefined;
      refCode = urlParams.get('ref') || urlParams.get('referral') || undefined;
    }

    const payload = {
      ...formData,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      referralCode: refCode,
      landingPage: typeof window !== 'undefined' ? window.location.pathname : '/',
      source: defaultInterest ? defaultInterest.toUpperCase() : 'HOMEPAGE',
      consent: formData.consentAccepted,
    };

    setIsLoading(true);
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit waitlist registration.');
      }

      setServerSuccess({
        referenceId: result.data.referenceId,
        message: result.message,
        alreadyRegistered: result.data.alreadyRegistered,
      });
    } catch (err: any) {
      setServerError(err.message || 'An unexpected connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setServerSuccess(null);
    setServerError(null);
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      primaryInterest: 'digital_banking',
      customerSegment: 'individual',
      notes: '',
      consentAccepted: true,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={serverSuccess ? 'Early Access Confirmed' : 'Join the Beyond Financials Waitlist'}
      subtitle={
        serverSuccess
          ? 'You have secured priority access for the upcoming release.'
          : 'Get early access, milestone updates, and priority account activation across Nigeria.'
      }
      maxWidth="md"
    >
      {serverSuccess ? (
        <div className="text-center py-6 space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-bold font-display text-slate-900">
              Welcome to the Future of Finance
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {serverSuccess.message}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto space-y-1">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Waitlist Priority Reference
            </span>
            <p className="text-lg font-mono font-bold text-blue-900">
              {serverSuccess.referenceId}
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Next Steps:
            </p>
            <p>
              When Phase 1 account onboarding opens, you will receive an exclusive invitation link to complete your Tier 1 verification and claim your dedicated virtual account.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={handleReset} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Privacy Banner */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900">
            <Lock className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Privacy & Security Commitment</p>
              <p className="text-blue-800 mt-0.5">
                We never request BVN, NIN, passwords, or payment credentials on this public waitlist.
              </p>
            </div>
          </div>

          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-900">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="waitlist-firstName"
              label="First Name"
              required
              placeholder="e.g. Tunde"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={errors.firstName}
            />
            <Input
              id="waitlist-lastName"
              label="Last Name"
              required
              placeholder="e.g. Adeleke"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={errors.lastName}
            />
          </div>

          {/* Contact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="waitlist-email"
              label="Email Address"
              type="email"
              required
              placeholder="tunde@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
            <Input
              id="waitlist-phone"
              label="Phone Number (Optional)"
              type="tel"
              placeholder="08012345678"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              helperText="For SMS early access notification"
            />
          </div>

          {/* Categorization Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="waitlist-interest"
              label="Primary Financial Interest"
              required
              options={interestOptions}
              value={formData.primaryInterest}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primaryInterest: e.target.value as WaitlistInterestCategory,
                })
              }
            />
            <Select
              id="waitlist-segment"
              label="I am registering as a..."
              required
              options={segmentOptions}
              value={formData.customerSegment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerSegment: e.target.value as WaitlistSubmission['customerSegment'],
                })
              }
            />
          </div>

          {/* Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-left">
              <input
                type="checkbox"
                id="waitlist-consent"
                checked={formData.consentAccepted}
                onChange={(e) => setFormData({ ...formData, consentAccepted: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-normal">
                I agree to receive milestone updates, early onboarding access, and product announcements from Beyond Financials (beyondfinancials.ng). You can unsubscribe anytime.
              </span>
            </label>
            {errors.consentAccepted && (
              <p className="text-xs text-rose-600 font-medium mt-1">{errors.consentAccepted}</p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="ghost" size="md" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="md"
              type="submit"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Confirm Waitlist Access
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
