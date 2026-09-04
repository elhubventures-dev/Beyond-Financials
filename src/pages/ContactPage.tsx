/**
 * Beyond Financials - Public Contact & Enquiry Interface
 * 
 * Route: /contact
 * Purpose: Secure, server-integrated contact portal for partnerships, general enquiries,
 * customer assistance, and waitlist support with strict PII protection.
 */

import React, { useState } from 'react';
import { SEOHead } from '../components/seo/SEOHead';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Link } from '../router/Router';
import {
  Mail,
  Building2,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Lock,
  Globe2,
} from 'lucide-react';

interface ContactPageProps {
  onOpenWaitlist: (interest?: string) => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  category: string;
  subject: string;
  message: string;
  consentAccepted: boolean;
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  category: 'general',
  subject: '',
  message: '',
  consentAccepted: false,
};

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenWaitlist }) => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    firstName: string;
    category: string;
    submittedAt: string;
    expectedResponseTime: string;
  } | null>(null);

  const categories = [
    { id: 'general', label: 'General Information & Questions' },
    { id: 'partnership', label: 'Institutional & Ecosystem Partnerships' },
    { id: 'banking', label: 'Digital Banking & Virtual Accounts' },
    { id: 'savings', label: 'Disciplined & Goal Savings' },
    { id: 'loans', label: 'Structured Loans & Credit Facilities' },
    { id: 'payments', label: 'Utility & Everyday Bill Payments' },
    { id: 'investments', label: 'Investments & Capital Markets (Future Scope)' },
    { id: 'crypto', label: 'Digital Assets & Web3 (Future Scope)' },
    { id: 'merchants', label: 'Merchant & POS Settlement Solutions' },
    { id: 'agents', label: 'Agency Banking & Float Management' },
    { id: 'support', label: 'Waitlist & Early Access Support' },
    { id: 'other', label: 'Other Enquiries' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear field-specific error upon typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.details) {
          setErrors(result.error.details);
        } else {
          setGeneralError(
            result.message || 'An unexpected error occurred. Please check your submission and try again.'
          );
        }
        setLoading(false);
        return;
      }

      setSuccessData(result.data);
      setFormData(INITIAL_FORM);
      setLoading(false);
    } catch (err) {
      setGeneralError(
        'Unable to connect to the Beyond Financials server. Please check your internet connection and try again.'
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Contact Beyond Financials - Official Communication & Inquiries"
        description="Get in touch with the Beyond Financials team for partnership inquiries, institutional collaborations, ecosystem questions, and waitlist support."
        canonicalPath="/contact"
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 bg-linear-to-b from-[#001B40] to-[#002866] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FBBF24_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="warning" size="md">
                Official Communication
              </Badge>
              <span className="text-xs font-mono text-blue-200">
                Direct Channels
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
              Get in touch with{' '}
              <span className="text-[#FBBF24]">Beyond Financials</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Whether you are an institution exploring partnership opportunities, an agent operator, a merchant, or a prospective user with questions, our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Channels & Form */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Official Contact Channels */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <Badge variant="blue" size="md">
                  Official Channels
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#001B40]">
                  Verified Inquiries & Support
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We maintain strict verified email and domain endpoints. Always ensure communications originate from our registered domain <strong className="text-slate-800">beyondfinancials.ng</strong>.
                </p>
              </div>

              <div className="space-y-4">
                {/* General Enquiries */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-[#0046AD]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        General & Support
                      </span>
                      <h3 className="text-base font-bold text-[#001B40]">
                        hello@beyondfinancials.ng
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    For public enquiries, account information, and waitlist questions.
                  </p>
                </div>

                {/* Partnerships */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Institutional Partnerships
                      </span>
                      <h3 className="text-base font-bold text-[#001B40]">
                        partners@beyondfinancials.ng
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    For licensed financial institutions, payment gateways, and corporate alliances.
                  </p>
                </div>

                {/* Security Reporting */}
                <div className="p-6 rounded-2xl bg-white border border-gray-200/90 shadow-2xs space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Security & Compliance
                      </span>
                      <h3 className="text-base font-bold text-[#001B40]">
                        security@beyondfinancials.ng
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 pt-1">
                    For responsible vulnerability reports, data privacy inquiries, and compliance audits.
                  </p>
                </div>
              </div>

              {/* Security Warning Box */}
              <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/90 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Important Privacy & Security Notice</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Beyond Financials will <strong>NEVER</strong> ask for your Bank Verification Number (BVN), National Identity Number (NIN), account password, card PIN, or recovery phrases in any contact form or email. Never enter financial secrets in public forms.
                </p>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-8 sm:p-10 space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold font-display text-[#001B40]">
                    Send Us a Message
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Fill out the details below and your enquiry will be routed to the appropriate specialist.
                  </p>
                </div>

                {successData ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-6 animate-in fade-in duration-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-emerald-950">
                        Enquiry Successfully Received
                      </h4>
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        Thank you, <strong>{successData.firstName}</strong>. Your message has been logged and routed to our team.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60 space-y-2 text-xs text-emerald-900">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reference ID:</span>
                        <span className="font-mono font-bold text-emerald-900">{successData.referenceId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Expected Turnaround:</span>
                        <span className="font-semibold text-emerald-900">{successData.expectedResponseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timestamp:</span>
                        <span className="font-mono text-slate-700">{new Date(successData.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => setSuccessData(null)}
                        className="px-6 py-2.5 rounded-full bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors cursor-pointer"
                      >
                        Send Another Message
                      </button>
                      <button
                        onClick={() => onOpenWaitlist()}
                        className="px-6 py-2.5 rounded-full bg-[#FBBF24] text-[#001B40] font-bold text-xs hover:bg-yellow-400 transition-colors cursor-pointer"
                      >
                        Join Priority Waitlist
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {generalError && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{generalError}</span>
                      </div>
                    )}

                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          First Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="e.g. Chukwuma"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                            errors.firstName
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-gray-200 focus:ring-[#0046AD]/30 focus:border-[#0046AD]'
                          }`}
                        />
                        {errors.firstName && (
                          <p className="text-[11px] text-rose-600">{errors.firstName[0]}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Last Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="e.g. Adeleke"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                            errors.lastName
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-gray-200 focus:ring-[#0046AD]/30 focus:border-[#0046AD]'
                          }`}
                        />
                        {errors.lastName && (
                          <p className="text-[11px] text-rose-600">{errors.lastName[0]}</p>
                        )}
                      </div>
                    </div>

                    {/* Email & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="name@example.com"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                            errors.email
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-gray-200 focus:ring-[#0046AD]/30 focus:border-[#0046AD]'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-rose-600">{errors.email[0]}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="08012345678"
                          className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                            errors.phoneNumber
                              ? 'border-rose-400 focus:ring-rose-200'
                              : 'border-gray-200 focus:ring-[#0046AD]/30 focus:border-[#0046AD]'
                          }`}
                        />
                        {errors.phoneNumber && (
                          <p className="text-[11px] text-rose-600">{errors.phoneNumber[0]}</p>
                        )}
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Enquiry Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                          errors.category
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-gray-200 focus:ring-[#0046AD]/30 focus:border-[#0046AD]'
                        }`}
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-[11px] text-rose-600">{errors.category[0]}</p>
                      )}
                    </div>

                    {/* Subject Line */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Subject <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief summary of your inquiry"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-gray-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0046AD]/30 focus:border-[#0046AD] transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Message <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {formData.message.length} / 2000
                        </span>
                      </div>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please write your enquiry here. Remember not to include confidential financial secrets, passwords, or identification numbers."
                        className={`w-full px-4 py-3 rounded-xl bg-slate-50 border text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all resize-y ${
                          errors.message
                            ? 'border-rose-400 focus:ring-rose-200'
                            : 'border-gray-200 focus:ring-[#0046AD]/30 focus:border-[#0046AD]'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] text-rose-600">{errors.message[0]}</p>
                      )}
                    </div>

                    {/* Consent Checkbox */}
                    <div className="space-y-1.5 pt-1">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consentAccepted"
                          checked={formData.consentAccepted}
                          onChange={handleInputChange}
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0046AD] focus:ring-[#0046AD]"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I agree to Beyond Financials storing my message to respond to my enquiry in accordance with their privacy standards. I confirm I have not included sensitive financial identifiers.
                        </span>
                      </label>
                      {errors.consentAccepted && (
                        <p className="text-[11px] text-rose-600">{errors.consentAccepted[0]}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-full bg-[#0046AD] hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span>Processing enquiry...</span>
                      ) : (
                        <>
                          <span>Submit Official Enquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist CTA Banner */}
      <section className="py-20 bg-[#001B40] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FBBF24]">
              Priority Early Access
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
              Join Our Growing Waitlist Community
            </h2>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              If your inquiry relates to early product access, we encourage you to join the waitlist directly for immediate queue placement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenWaitlist()}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FBBF24] text-[#001B40] font-bold text-base hover:bg-yellow-400 active:bg-yellow-500 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/faq"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base transition-colors border border-white/20 flex items-center justify-center gap-2"
            >
              <span>Browse Knowledge Base</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
