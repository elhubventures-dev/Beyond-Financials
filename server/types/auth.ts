/**
 * Beyond Financials - Identity & Access Management Domain Types
 * 
 * Core Principles:
 * 1. Strict separation between Waitlist Lead and Registered User entities.
 * 2. Extensible Role-Based Access Control (RBAC) with granular permissions.
 * 3. International-ready user profile and locale attributes.
 * 4. Zero sensitive plain-text credentials in models or API responses.
 * 5. Strict lifecycle states (PENDING_VERIFICATION, ACTIVE, SUSPENDED, LOCKED, DEACTIVATED).
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
  // User Management
  USER_READ_OWN = 'USER_READ_OWN',
  USER_UPDATE_OWN = 'USER_UPDATE_OWN',
  USER_READ_ALL = 'USER_READ_ALL',
  USER_UPDATE_ALL = 'USER_UPDATE_ALL',
  USER_SUSPEND = 'USER_SUSPEND',
  USER_DELETE = 'USER_DELETE',

  // KYC & Verification (Future milestone integration)
  KYC_SUBMIT = 'KYC_SUBMIT',
  KYC_READ_OWN = 'KYC_READ_OWN',
  KYC_READ_ALL = 'KYC_READ_ALL',
  KYC_REVIEW = 'KYC_REVIEW',

  // Transactions & Ledger (Future milestone integration)
  TRANSACTION_READ_OWN = 'TRANSACTION_READ_OWN',
  TRANSACTION_INITIATE = 'TRANSACTION_INITIATE',
  TRANSACTION_READ_ALL = 'TRANSACTION_READ_ALL',
  TRANSACTION_REVIEW = 'TRANSACTION_REVIEW',

  // Credit & Loans (Future milestone integration)
  LOAN_APPLY = 'LOAN_APPLY',
  LOAN_READ_OWN = 'LOAN_READ_OWN',
  LOAN_READ_ALL = 'LOAN_READ_ALL',
  LOAN_REVIEW = 'LOAN_REVIEW',

  // Reporting & Analytics
  REPORT_VIEW = 'REPORT_VIEW',
  REPORT_EXPORT = 'REPORT_EXPORT',

  // System & Security Administration
  SECURITY_AUDIT_VIEW = 'SECURITY_AUDIT_VIEW',
  SYSTEM_CONFIG_MANAGE = 'SYSTEM_CONFIG_MANAGE',
  ADMIN_MANAGE = 'ADMIN_MANAGE',
}

export type SecurityEventType =
  | 'REGISTRATION_SUCCESS'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'EMAIL_VERIFICATION_REQUESTED'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'SESSION_CREATED'
  | 'SESSION_REVOKED'
  | 'SESSION_EXPIRED'
  | 'PROFILE_UPDATED'
  | 'SECURITY_SETTINGS_UPDATED';

/**
 * Core User Entity (Server-side model)
 */
export interface UserEntity {
  id: string; // e.g. 'usr_102839102'
  firstName: string;
  lastName: string;
  email: string; // normalized lower-case
  phone: string; // normalized E.164
  country: string; // ISO 2-letter e.g. 'NG', 'GH', 'GB', 'US'
  countryCode: string; // e.g. '+234'
  timezone: string; // e.g. 'Africa/Lagos'
  locale: string; // e.g. 'en'
  passwordHash: string; // scrypt/pbkdf2 salted hash
  status: UserStatus;
  roles: UserRole[];
  permissions: Permission[];
  
  // Security & Lifecycle
  failedLoginAttempts: number;
  lockedUntil: string | null; // ISO timestamp
  emailVerifiedAt: string | null;
  phoneVerifiedAt: string | null;
  lastLoginAt: string | null;
  lastPasswordChangeAt: string | null;
  termsAcceptedAt: string;
  termsVersion: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Public/Client-safe User Profile (Never contains passwordHash, salts, or internal auth tokens)
 */
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

/**
 * Authenticated Session Entity
 */
export interface UserSession {
  id: string; // session token 'sess_...'
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isRevoked: boolean;
}

/**
 * Public Session Info (returned to client)
 */
export interface SessionInfo {
  sessionId: string;
  expiresAt: string;
  createdAt: string;
  lastActiveAt: string;
  ipAddress?: string;
  userAgent?: string;
  isCurrent?: boolean;
}

/**
 * Security Event / Audit Log Entry
 */
export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  actorUserId?: string | null;
  targetUserId?: string | null;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

/**
 * Password Reset Token record (internal)
 */
export interface PasswordResetRecord {
  tokenHash: string;
  userId: string;
  email: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}

/**
 * Email Verification Token record (internal)
 */
export interface EmailVerificationRecord {
  tokenHash: string;
  userId: string;
  email: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
}
