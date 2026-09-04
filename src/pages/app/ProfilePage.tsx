/**
 * Beyond Financials - Customer Profile Page
 * Route: /app/profile
 */

import React, { useState } from 'react';
import { AppShell } from '../../components/app/AppShell';
import { useAuth } from '../../providers/AuthProvider';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  Mail,
  Phone,
  Globe,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  Info,
} from 'lucide-react';

const COUNTRY_OPTIONS = [
  { code: 'NG', name: 'Nigeria (+234)', timezone: 'Africa/Lagos' },
  { code: 'GH', name: 'Ghana (+233)', timezone: 'Africa/Accra' },
  { code: 'KE', name: 'Kenya (+254)', timezone: 'Africa/Nairobi' },
  { code: 'ZA', name: 'South Africa (+27)', timezone: 'Africa/Johannesburg' },
  { code: 'GB', name: 'United Kingdom (+44)', timezone: 'Europe/London' },
  { code: 'US', name: 'United States (+1)', timezone: 'America/New_York' },
  { code: 'CA', name: 'Canada (+1)', timezone: 'America/Toronto' },
];

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [country, setCountry] = useState(user?.country || 'NG');
  const [timezone, setTimezone] = useState(user?.timezone || 'Africa/Lagos');
  const [locale, setLocale] = useState(user?.locale || 'en');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) return null;

  const handleCountryChange = (newCountryCode: string) => {
    setCountry(newCountryCode);
    const matched = COUNTRY_OPTIONS.find((c) => c.code === newCountryCode);
    if (matched) {
      setTimezone(matched.timezone);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('First and last names are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        country,
        timezone,
        locale,
      });

      if (res.success) {
        setSuccessMessage('Your profile attributes have been successfully updated.');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell activeTab="profile">
      <div className="max-w-4xl space-y-8">
        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-black text-[#001B40] tracking-tight">
            Customer Profile & Identity
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, localization preferences, and contact information
          </p>
        </div>

        {/* Feedback Alerts */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{successMessage}</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Identity Snapshot Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#001B40] to-[#0046AD] text-white text-2xl font-black flex items-center justify-center mx-auto shadow-md">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#001B40]">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              </div>
              <div className="inline-flex items-center gap-2">
                <Badge variant="emerald" size="sm" dot>
                  {user.status}
                </Badge>
                <Badge variant="blue" size="sm">
                  {user.roles.includes('ADMIN' as any) ? 'ADMINISTRATOR' : 'RETAIL CUSTOMER'}
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Account Reference</span>
                <span className="font-mono font-bold text-slate-700">
                  {user.id.substring(0, 10)}...
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Country Target</span>
                <span className="font-bold text-slate-700">{user.country}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Timezone</span>
                <span className="font-bold text-slate-700">{user.timezone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Locale</span>
                <span className="font-bold text-slate-700">{user.locale}</span>
              </div>
            </div>

            {/* KYC Notice */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>KYC Tier 0 Active</span>
              </div>
              Government identity documents (BVN/NIN/ID) will be requested upon rollout of transactional accounts.
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h2 className="text-base font-extrabold text-[#001B40] mb-6">
              Edit Account Attributes
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Primary Identity Identifier)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed select-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Email cannot be changed directly for security audit trail integrity.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+2348012345678"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Locale
                  </label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] cursor-pointer"
                  >
                    <option value="en">English (en)</option>
                    <option value="fr">French (fr)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#0046AD] hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Saving Changes...</span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
};
