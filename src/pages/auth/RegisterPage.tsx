/**
 * Beyond Financials - Secure Customer Registration Page
 * Route: /register
 */

import React, { useState, useMemo } from 'react';
import { Link, useRouter } from '../../router/Router';
import { useAuth } from '../../providers/AuthProvider';
import { BrandLogo } from '../../components/ui/BrandLogo';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Globe,
  Info,
} from 'lucide-react';

const COUNTRY_OPTIONS = [
  { code: 'NG', name: 'Nigeria', dialCode: '+234' },
  { code: 'GH', name: 'Ghana', dialCode: '+233' },
  { code: 'KE', name: 'Kenya', dialCode: '+254' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
];

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const activeDialCode = useMemo(() => {
    return COUNTRY_OPTIONS.find((c) => c.code === selectedCountry)?.dialCode || '+234';
  }, [selectedCountry]);

  // Password criteria computation
  const passwordCriteria = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password),
    };
  }, [password]);

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

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please provide both your first and last legal names.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Please provide your phone number.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('The passwords entered do not match.');
      return;
    }

    if (passwordScore < 4) {
      setErrorMessage('Please satisfy all password security requirements before proceeding.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must review and agree to the Terms of Service to create an account.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedPhone = `${activeDialCode}${phoneNumber.replace(/^0+/, '').replace(/\s+/g, '')}`;

      const res = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: formattedPhone,
        country: selectedCountry,
        countryCode: activeDialCode,
        password,
        confirmPassword,
        termsAccepted,
      });

      if (res.success) {
        navigate('/app');
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage('An unexpected error occurred during account creation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="flex justify-center mb-6">
          <Link to="/" className="inline-block focus:outline-none">
            <BrandLogo size="lg" />
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001B40] tracking-tight">
            Create your Beyond Financials Account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Establish your unified identity foundation across all future financial services
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/80 rounded-2xl sm:px-10">
          {/* Regulatory & Scope Clarification Banner */}
          <div className="mb-6 p-3.5 bg-blue-50/80 border border-blue-100 rounded-xl flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Before you create a profile:</span> We do not ask for your BVN, NIN, or identity documents here. Identity checks will be explained when financial services open.
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Adebayo"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Okonkwo"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
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

            {/* Phone & Country (International Readiness) */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative w-36">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full h-full py-2.5 pl-3 pr-8 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="801 234 5678"
                    className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Password Strength Meter */}
              {password.length > 0 && (
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
                      <span>Upper & lowercase</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.number ? 'text-emerald-700 font-semibold' : ''}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${passwordCriteria.number ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>At least 1 number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordCriteria.special ? 'text-emerald-700 font-semibold' : ''}`}>
                      <CheckCircle2 className={`w-3.5 h-3.5 ${passwordCriteria.special ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>1 special symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm Password
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
                  placeholder="Re-enter password"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Terms of Service Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-[#0046AD] border-slate-300 rounded-sm focus:ring-[#0046AD]"
                />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="font-bold text-[#0046AD] hover:underline" target="_blank">
                    Terms of Service
                  </Link>{' '}
                  and acknowledge the{' '}
                  <Link to="/privacy" className="font-bold text-[#0046AD] hover:underline" target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-[#0046AD] hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#0046AD] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>NDPA Data Privacy & Encrypted Identity Vault</span>
        </div>
      </div>
    </div>
  );
};
