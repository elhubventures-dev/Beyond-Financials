/**
 * Beyond Financials - Authentication & Identity React Context Provider
 * 
 * Manages authenticated user state, session validation, registration,
 * login, password changes, active sessions, and security events.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserProfile, SessionInfo, SecurityEvent } from '../types/auth';

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  country?: string;
  countryCode?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: SessionInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    timezone?: string;
    locale?: string;
  }) => Promise<{ success: boolean; message: string; error?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string; error?: string }>;
  getSessions: () => Promise<SessionInfo[]>;
  revokeSession: (sessionId: string) => Promise<boolean>;
  revokeOtherSessions: () => Promise<boolean>;
  getSecurityEvents: (limit?: number) => Promise<SecurityEvent[]>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string; devResetToken?: string }>;
  resetPasswordWithToken: (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'bf_auth_session_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(SESSION_STORAGE_KEY);
  };

  const saveToken = (token: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SESSION_STORAGE_KEY, token);
  };

  const clearToken = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  /**
   * Validates active session on mount
   */
  const refreshSession = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setUser(result.data.user);
          setSession(result.data.session);
        } else {
          clearToken();
          setUser(null);
          setSession(null);
        }
      } else {
        clearToken();
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      console.warn('[AUTH] Failed to refresh session from server:', err);
      clearToken();
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  /**
   * Login Handler
   */
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Login failed. Please verify your credentials.',
          error: data.error?.code || 'AUTH_ERROR',
        };
      }

      const { user: userProfile, session: sessionData } = data.data;
      saveToken(sessionData.sessionId);
      setUser(userProfile);
      setSession(sessionData);

      return {
        success: true,
        message: data.message || 'Welcome back to Beyond Financials.',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Network error communicating with authentication service. Please check your connection.',
        error: 'NETWORK_ERROR',
      };
    }
  };

  /**
   * Register Handler
   */
  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Registration failed. Please check form entries.',
          error: data.error?.code || 'REGISTRATION_ERROR',
        };
      }

      const { user: userProfile, session: sessionData } = data.data;
      saveToken(sessionData.sessionId);
      setUser(userProfile);
      setSession(sessionData);

      return {
        success: true,
        message: data.message || 'Account created successfully.',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Network error during registration. Please try again.',
        error: 'NETWORK_ERROR',
      };
    }
  };

  /**
   * Logout Handler
   */
  const logout = async () => {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn('[AUTH] Server logout error:', err);
      }
    }

    clearToken();
    setUser(null);
    setSession(null);
  };

  /**
   * Profile Update Handler
   */
  const updateProfile = async (updates: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    timezone?: string;
    locale?: string;
  }) => {
    const token = getStoredToken();
    if (!token) return { success: false, message: 'Authentication required' };

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to update profile.',
          error: data.error?.code,
        };
      }

      setUser(data.data);
      return {
        success: true,
        message: 'Profile updated successfully.',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Network error updating profile.',
      };
    }
  };

  /**
   * Change Password Handler
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    const token = getStoredToken();
    if (!token) return { success: false, message: 'Authentication required' };

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Failed to change password.',
          error: data.error?.code,
        };
      }

      return {
        success: true,
        message: data.message || 'Password changed successfully.',
      };
    } catch (err) {
      return {
        success: false,
        message: 'Network error updating password.',
      };
    }
  };

  /**
   * Active Sessions API
   */
  const getSessions = async (): Promise<SessionInfo[]> => {
    const token = getStoredToken();
    if (!token) return [];

    try {
      const res = await fetch('/api/auth/sessions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch {
      return [];
    }
  };

  const revokeSession = async (sessionId: string): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  };

  const revokeOtherSessions = async (): Promise<boolean> => {
    const token = getStoredToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.success;
    } catch {
      return false;
    }
  };

  /**
   * Security Audit Events API
   */
  const getSecurityEvents = async (limit: number = 20): Promise<SecurityEvent[]> => {
    const token = getStoredToken();
    if (!token) return [];

    try {
      const res = await fetch(`/api/auth/security-events?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      return data.success && Array.isArray(data.data) ? data.data : [];
    } catch {
      return [];
    }
  };

  /**
   * Forgot & Reset Password
   */
  const requestPasswordReset = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message,
        devResetToken: data.data?.devResetToken,
      };
    } catch {
      return {
        success: false,
        message: 'Unable to process password reset request at this time.',
      };
    }
  };

  const resetPasswordWithToken = async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword, confirmPassword }),
      });
      const data = await res.json();
      return {
        success: data.success,
        message: data.message,
      };
    } catch {
      return {
        success: false,
        message: 'Network error attempting to reset password.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated: Boolean(user && session),
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        getSessions,
        revokeSession,
        revokeOtherSessions,
        getSecurityEvents,
        requestPasswordReset,
        resetPasswordWithToken,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
