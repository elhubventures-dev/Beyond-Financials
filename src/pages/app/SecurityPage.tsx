/**
 * Beyond Financials - Customer Security, Password & Session Management
 * Route: /app/security
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '../../components/app/AppShell';
import { useAuth } from '../../providers/AuthProvider';
import { Badge } from '../../components/ui/Badge';
import { SessionInfo, SecurityEvent } from '../../types/auth';
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Clock,
  LogOut,
  Sparkles,
  Info,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const {
    changePassword,
    getSessions,
    revokeSession,
    revokeOtherSessions,
    getSecurityEvents,
  } = useAuth();

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sessions state
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionSuccess, setSessionSuccess] = useState<string | null>(null);

  // Security audit log state
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Password strength validation
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

  const loadData = async () => {
    setIsLoadingSessions(true);
    setIsLoadingEvents(true);
    try {
      const [sessionsData, eventsData] = await Promise.all([
        getSessions(),
        getSecurityEvents(15),
      ]);
      setSessions(sessionsData);
      setSecurityEvents(eventsData);
    } catch {
      console.warn('Failed to load security data');
    } finally {
      setIsLoadingSessions(false);
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordScore < 4) {
      setPasswordError('Please satisfy all password security requirements before saving.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changePassword(currentPassword, newPassword, confirmPassword);
      if (res.success) {
        const notice = res.securityNotice === 'accepted'
          ? ' A security notice was submitted to your email provider. This does not confirm it has reached your inbox.'
          : res.securityNotice === 'failed'
            ? ' A security email could not be sent.'
            : '';
        setPasswordSuccess(`${res.message}${notice}`);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Reload sessions as other sessions were revoked
        loadData();
      } else {
        setPasswordError(res.message);
      }
    } catch {
      setPasswordError('Failed to change password. Please check your current credentials.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setSessionSuccess(null);
    const success = await revokeSession(sessionId);
    if (success) {
      setSessionSuccess('Session revoked successfully.');
      loadData();
    }
  };

  const handleRevokeAllOtherSessions = async () => {
    setSessionSuccess(null);
    const success = await revokeOtherSessions();
    if (success) {
      setSessionSuccess('All other active sessions have been signed out.');
      loadData();
    }
  };

  const formatDateTime = (isoDate: string) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'LOGIN_SUCCESS':
        return <Badge variant="emerald" size="sm">Login Success</Badge>;
      case 'LOGIN_FAILURE':
        return <Badge variant="danger" size="sm">Login Failed</Badge>;
      case 'PASSWORD_CHANGED':
      case 'PASSWORD_RESET_COMPLETED':
        return <Badge variant="blue" size="sm">Password Changed</Badge>;
      case 'REGISTRATION_SUCCESS':
        return <Badge variant="amber" size="sm">Registered</Badge>;
      case 'SESSION_REVOKED':
        return <Badge variant="slate" size="sm">Session Revoked</Badge>;
      default:
        return <Badge variant="slate" size="sm">{type.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <AppShell activeTab="security">
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-black text-[#001B40] tracking-tight">
            Security & Authentication Controls
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your login credentials, active device sessions, and account audit logs
          </p>
        </div>

        {/* ==================================================== */}
        {/* 1. PASSWORD ROTATION */}
        {/* ==================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-[#0046AD] rounded-xl">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#001B40]">
                  Change Password
                </h2>
                <p className="text-xs text-slate-500">
                  Update your scrypt-hashed account password
                </p>
              </div>
            </div>
            <Badge variant="emerald" size="sm" dot>
              Scrypt Active
            </Badge>
          </div>

          {passwordSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{passwordSuccess}</p>
              </div>
            </div>
          )}

          {passwordError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{passwordError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0046AD]"
                  />
                </div>
              </div>
            </div>

            {/* Strength Meter */}
            {newPassword.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex gap-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
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

            <div className="pt-3 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Updating your password will automatically sign out all other active sessions.
              </p>
              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-6 py-2.5 bg-[#0046AD] hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isChangingPassword ? <span>Saving...</span> : <span>Update Password</span>}
              </button>
            </div>
          </form>
        </div>

        {/* ==================================================== */}
        {/* 2. TWO-FACTOR AUTHENTICATION (MFA) ARCHITECTURE */}
        {/* ==================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#001B40]">
                  Two-Factor Authentication (MFA)
                </h2>
                <p className="text-xs text-slate-500">
                  Additional layer of security for financial transactions and account access
                </p>
              </div>
            </div>
            <Badge variant="amber" size="sm">
              Setup Available Soon
            </Badge>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
            <div className="flex items-start gap-3 text-xs text-slate-700 leading-relaxed">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#001B40]">Extra sign-in protection is coming.</strong>{' '}
                When financial services open, you will be able to add a second check such as an authenticator app or a text message. It is not available on your profile yet.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-xs font-bold text-slate-800">TOTP Authenticator</div>
                <div className="text-[11px] text-slate-500 mt-0.5">A code from an authenticator app</div>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl">
                <div className="text-xs font-bold text-slate-800">Carrier SMS Fallback</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Verified international phone numbers</div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================== */}
        {/* 3. ACTIVE SESSIONS MANAGEMENT */}
        {/* ==================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#001B40]">
                  Active Sessions
                </h2>
                <p className="text-xs text-slate-500">
                  Manage active browser tokens and sign in locations
                </p>
              </div>
            </div>

            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleRevokeAllOtherSessions}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Sign Out Other Sessions
              </button>
            )}
          </div>

          {sessionSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold animate-in fade-in">
              {sessionSuccess}
            </div>
          )}

          {isLoadingSessions ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading active sessions...</div>
          ) : sessions.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No active sessions found.</div>
          ) : (
            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.sessionId}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                    sess.isCurrent
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#001B40]">
                        {sess.userAgent?.includes('Mozilla') ? 'Web Browser' : sess.userAgent || 'Web Client'}
                      </span>
                      {sess.isCurrent && (
                        <Badge variant="blue" size="sm">
                          Current Session
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                      <span>IP: {sess.ipAddress}</span>
                      <span>•</span>
                      <span>Last active: {formatDateTime(sess.lastActiveAt)}</span>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleRevokeSession(sess.sessionId)}
                      className="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-lg text-xs font-bold transition-colors cursor-pointer self-start sm:self-center"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==================================================== */}
        {/* 4. SECURITY AUDIT LOG */}
        {/* ==================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#001B40]">
                  Security Activity Log
                </h2>
                <p className="text-xs text-slate-500">
                  Recent authentication and credential events recorded on your account
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              Audit Stream
            </span>
          </div>

          {isLoadingEvents ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading audit history...</div>
          ) : securityEvents.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">No events recorded.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {securityEvents.map((evt) => (
                <div key={evt.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getEventBadge(evt.eventType)}
                    <span className="text-xs text-slate-700 font-mono text-[11px]">
                      IP {evt.ipAddress || '0.0.0.0'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {formatDateTime(evt.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};
