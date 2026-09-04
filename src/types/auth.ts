/**
 * Beyond Financials - Client-Side Authentication Types
 */

export enum UserStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MERCHANT = 'MERCHANT',
  AGENT = 'AGENT',
  SUPPORT = 'SUPPORT',
  COMPLIANCE = 'COMPLIANCE',
  FINANCE = 'FINANCE',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum Permission {
  USER_READ_OWN = 'USER_READ_OWN',
  USER_UPDATE_OWN = 'USER_UPDATE_OWN',
  USER_READ_ALL = 'USER_READ_ALL',
  USER_UPDATE_ALL = 'USER_UPDATE_ALL',
  USER_SUSPEND = 'USER_SUSPEND',
  USER_DELETE = 'USER_DELETE',
  KYC_SUBMIT = 'KYC_SUBMIT',
  KYC_READ_OWN = 'KYC_READ_OWN',
  KYC_READ_ALL = 'KYC_READ_ALL',
  KYC_REVIEW = 'KYC_REVIEW',
  TRANSACTION_READ_OWN = 'TRANSACTION_READ_OWN',
  TRANSACTION_INITIATE = 'TRANSACTION_INITIATE',
  TRANSACTION_READ_ALL = 'TRANSACTION_READ_ALL',
  TRANSACTION_REVIEW = 'TRANSACTION_REVIEW',
  LOAN_APPLY = 'LOAN_APPLY',
  LOAN_READ_OWN = 'LOAN_READ_OWN',
  LOAN_READ_ALL = 'LOAN_READ_ALL',
  LOAN_REVIEW = 'LOAN_REVIEW',
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_EXPORT = 'REPORT_EXPORT',
  SECURITY_AUDIT_VIEW = 'SECURITY_AUDIT_VIEW',
  SYSTEM_CONFIG_MANAGE = 'SYSTEM_CONFIG_MANAGE',
  ADMIN_MANAGE = 'ADMIN_MANAGE',
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  timezone: string;
  locale: string;
  status: UserStatus;
  roles: UserRole[];
  permissions: Permission[];
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface SessionInfo {
  sessionId: string;
  expiresAt: string;
  createdAt: string;
  lastActiveAt: string;
  ipAddress?: string;
  userAgent?: string;
  isCurrent?: boolean;
}

export interface SecurityEvent {
  id: string;
  eventType: string;
  actorUserId?: string | null;
  targetUserId?: string | null;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: SessionInfo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
