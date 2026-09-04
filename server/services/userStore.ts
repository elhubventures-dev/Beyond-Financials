/**
 * Beyond Financials - Identity & Access Store
 * 
 * Core Responsibilities:
 * - Secure in-memory user registry with scrypt password hashing
 * - Session lifecycle management (creation, activity sliding, revocation)
 * - Brute force defense & account lock enforcement
 * - Security event logging and audit trails
 * - Password recovery and email verification token abstractions
 * - Strict separation from WaitlistLead store
 */

import {
  UserEntity,
  UserProfile,
  UserSession,
  SessionInfo,
  UserStatus,
  UserRole,
  SecurityEvent,
  SecurityEventType,
  PasswordResetRecord,
  EmailVerificationRecord,
} from '../types/auth';
import { CryptoService } from './cryptoService';
import { RbacService } from './rbacService';

export class UserStore {
  private users: Map<string, UserEntity> = new Map();
  private sessions: Map<string, UserSession> = new Map();
  private securityEvents: SecurityEvent[] = [];
  private passwordResetTokens: Map<string, PasswordResetRecord> = new Map();
  private emailVerificationTokens: Map<string, EmailVerificationRecord> = new Map();

  // Lockout configuration: 5 failed attempts locks account for 15 minutes
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 mins
  private static readonly SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    this.seedInitialUsers();
  }

  /**
   * Seeds demo users for testing and development environments.
   */
  private seedInitialUsers() {
    const now = new Date().toISOString();

    // 1. Demo Retail Customer
    const customerPasswordHash = CryptoService.hashPassword('BeyondPass2026!');
    const customerId = 'usr_customer_demo';
    const customerRoles = [UserRole.CUSTOMER];
    const customerUser: UserEntity = {
      id: customerId,
      firstName: 'Adebayo',
      lastName: 'Okonkwo',
      email: 'customer@beyondfinancials.ng',
      phone: '+2348023456789',
      country: 'NG',
      countryCode: '+234',
      timezone: 'Africa/Lagos',
      locale: 'en',
      passwordHash: customerPasswordHash,
      status: UserStatus.ACTIVE,
      roles: customerRoles,
      permissions: RbacService.getPermissionsForRoles(customerRoles),
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      lastLoginAt: now,
      lastPasswordChangeAt: now,
      termsAcceptedAt: now,
      termsVersion: '2026.1',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: now,
    };
    this.users.set(customerUser.id, customerUser);

    // 2. Demo Administrator User
    const adminPasswordHash = CryptoService.hashPassword('AdminMaster2026!');
    const adminId = 'usr_admin_demo';
    const adminRoles = [UserRole.ADMIN, UserRole.CUSTOMER];
    const adminUser: UserEntity = {
      id: adminId,
      firstName: 'Amara',
      lastName: 'Eze',
      email: 'admin@beyondfinancials.ng',
      phone: '+2348098765432',
      country: 'NG',
      countryCode: '+234',
      timezone: 'Africa/Lagos',
      locale: 'en',
      passwordHash: adminPasswordHash,
      status: UserStatus.ACTIVE,
      roles: adminRoles,
      permissions: RbacService.getPermissionsForRoles(adminRoles),
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      lastLoginAt: now,
      lastPasswordChangeAt: now,
      termsAcceptedAt: now,
      termsVersion: '2026.1',
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      updatedAt: now,
    };
    this.users.set(adminUser.id, adminUser);
  }

  // ==========================================
  // USER OPERATIONS
  // ==========================================

  /**
   * Registers a new user account.
   */
  public async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    country?: string;
    countryCode?: string;
    timezone?: string;
    locale?: string;
    termsAccepted: boolean;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ user: UserProfile; session: UserSession }> {
    const normalizedEmail = CryptoService.normalizeEmail(data.email);
    const countryCode = data.countryCode || '+234';
    const normalizedPhone = CryptoService.normalizePhone(data.phone, countryCode);

    // Check duplicate email
    if (this.findByEmail(normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    // Validate password policy
    const passwordValidation = CryptoService.validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join('. '));
    }

    // Validate terms acceptance
    if (!data.termsAccepted) {
      throw new Error('You must review and accept the Terms of Service to register.');
    }

    const now = new Date().toISOString();
    const userId = CryptoService.generateId('usr');
    const passwordHash = CryptoService.hashPassword(data.password);
    const roles = [UserRole.CUSTOMER];
    const permissions = RbacService.getPermissionsForRoles(roles);

    const newUser: UserEntity = {
      id: userId,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      country: data.country || 'NG',
      countryCode: countryCode,
      timezone: data.timezone || 'Africa/Lagos',
      locale: data.locale || 'en',
      passwordHash,
      status: UserStatus.ACTIVE, // Initial foundation status
      roles,
      permissions,
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
      lastLoginAt: now,
      lastPasswordChangeAt: now,
      termsAcceptedAt: now,
      termsVersion: '2026.1',
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(userId, newUser);

    // Record Security Event
    this.recordSecurityEvent(
      'REGISTRATION_SUCCESS',
      userId,
      userId,
      data.ipAddress,
      data.userAgent,
      { email: normalizedEmail, country: newUser.country }
    );

    // Create immediate session
    const session = this.createSession(userId, data.ipAddress, data.userAgent);

    return {
      user: this.toPublicProfile(newUser),
      session,
    };
  }

  /**
   * Retrieves user by normalized email.
   */
  public findByEmail(email: string): UserEntity | undefined {
    const normalized = CryptoService.normalizeEmail(email);
    for (const user of this.users.values()) {
      if (user.email === normalized) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Retrieves user by internal ID.
   */
  public findById(id: string): UserEntity | undefined {
    return this.users.get(id);
  }

  /**
   * Updates public profile attributes.
   */
  public updateProfile(
    userId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      country?: string;
      timezone?: string;
      locale?: string;
    },
    ipAddress?: string,
    userAgent?: string
  ): UserProfile {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (updates.firstName) user.firstName = updates.firstName.trim();
    if (updates.lastName) user.lastName = updates.lastName.trim();
    if (updates.phone) {
      user.phone = CryptoService.normalizePhone(updates.phone, user.countryCode);
    }
    if (updates.country) user.country = updates.country;
    if (updates.timezone) user.timezone = updates.timezone;
    if (updates.locale) user.locale = updates.locale;
    user.updatedAt = new Date().toISOString();

    this.recordSecurityEvent('PROFILE_UPDATED', userId, userId, ipAddress, userAgent);

    return this.toPublicProfile(user);
  }

  /**
   * Changes user password securely.
   */
  public changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    currentSessionId?: string,
    ipAddress?: string,
    userAgent?: string
  ): void {
    const user = this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    if (!CryptoService.verifyPassword(currentPassword, user.passwordHash)) {
      this.recordSecurityEvent('LOGIN_FAILURE', userId, userId, ipAddress, userAgent, {
        reason: 'Password change invalid current password',
      });
      throw new Error('The current password provided is incorrect.');
    }

    // Validate new password policy
    const validation = CryptoService.validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.errors.join('. '));
    }

    // Ensure new password is not identical to current password
    if (CryptoService.verifyPassword(newPassword, user.passwordHash)) {
      throw new Error('Your new password cannot be the same as your current password.');
    }

    const now = new Date().toISOString();
    user.passwordHash = CryptoService.hashPassword(newPassword);
    user.lastPasswordChangeAt = now;
    user.updatedAt = now;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;

    // Revoke all other active sessions for security
    this.revokeAllUserSessions(userId, currentSessionId);

    this.recordSecurityEvent('PASSWORD_CHANGED', userId, userId, ipAddress, userAgent);
  }

  // ==========================================
  // AUTHENTICATION & ACCOUNT LOCKING
  // ==========================================

  /**
   * Checks if user account is currently locked.
   */
  public isAccountLocked(user: UserEntity): { isLocked: boolean; remainingMinutes?: number } {
    if (user.status === UserStatus.LOCKED || user.lockedUntil) {
      if (user.lockedUntil) {
        const lockExpiry = new Date(user.lockedUntil).getTime();
        const now = Date.now();
        if (now < lockExpiry) {
          const remainingMinutes = Math.ceil((lockExpiry - now) / (60 * 1000));
          return { isLocked: true, remainingMinutes };
        } else {
          // Lock period has expired, auto-unlock
          user.lockedUntil = null;
          user.failedLoginAttempts = 0;
          if (user.status === UserStatus.LOCKED) {
            user.status = UserStatus.ACTIVE;
          }
          user.updatedAt = new Date().toISOString();
          return { isLocked: false };
        }
      }
      return { isLocked: true, remainingMinutes: 15 };
    }
    return { isLocked: false };
  }

  /**
   * Records a failed login attempt and locks account if threshold is met.
   */
  public recordFailedLogin(user: UserEntity, ipAddress?: string, userAgent?: string): void {
    user.failedLoginAttempts += 1;
    user.updatedAt = new Date().toISOString();

    this.recordSecurityEvent('LOGIN_FAILURE', null, user.id, ipAddress, userAgent, {
      attemptNumber: user.failedLoginAttempts,
    });

    if (user.failedLoginAttempts >= UserStore.MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + UserStore.LOCKOUT_DURATION_MS).toISOString();
      user.lockedUntil = lockUntil;
      user.status = UserStatus.LOCKED;

      this.recordSecurityEvent('ACCOUNT_LOCKED', null, user.id, ipAddress, userAgent, {
        reason: 'Maximum failed login attempts exceeded',
        lockedUntil: lockUntil,
      });
    }
  }

  /**
   * Records a successful login and clears failure counters.
   */
  public recordSuccessfulLogin(user: UserEntity, ipAddress?: string, userAgent?: string): void {
    const now = new Date().toISOString();
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    if (user.status === UserStatus.LOCKED) {
      user.status = UserStatus.ACTIVE;
    }
    user.lastLoginAt = now;
    user.updatedAt = now;

    this.recordSecurityEvent('LOGIN_SUCCESS', user.id, user.id, ipAddress, userAgent);
  }

  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================

  /**
   * Creates a new authenticated session for a user.
   */
  public createSession(userId: string, ipAddress?: string, userAgent?: string): UserSession {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + UserStore.SESSION_DURATION_MS).toISOString();
    const sessionId = CryptoService.generateSessionToken();

    const session: UserSession = {
      id: sessionId,
      userId,
      ipAddress: CryptoService.anonymizeIp(ipAddress),
      userAgent: userAgent ? userAgent.substring(0, 200) : 'Unknown Browser',
      createdAt: now.toISOString(),
      lastActiveAt: now.toISOString(),
      expiresAt,
      isRevoked: false,
    };

    this.sessions.set(sessionId, session);
    this.recordSecurityEvent('SESSION_CREATED', userId, userId, ipAddress, userAgent, {
      sessionId: sessionId.substring(0, 10) + '...',
    });

    return session;
  }

  /**
   * Validates session token and returns associated UserEntity.
   */
  public validateSession(sessionId: string): { user: UserEntity; session: UserSession } | null {
    if (!sessionId) return null;

    const session = this.sessions.get(sessionId);
    if (!session || session.isRevoked) {
      return null;
    }

    const now = Date.now();
    const expiry = new Date(session.expiresAt).getTime();
    if (now > expiry) {
      session.isRevoked = true;
      return null;
    }

    const user = this.findById(session.userId);
    if (!user) {
      return null;
    }

    // Check account status
    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.DEACTIVATED) {
      return null;
    }

    // Slide last active timestamp (if > 5 minutes since last update)
    const lastActive = new Date(session.lastActiveAt).getTime();
    if (now - lastActive > 5 * 60 * 1000) {
      session.lastActiveAt = new Date(now).toISOString();
    }

    return { user, session };
  }

  /**
   * Revokes a specific session.
   */
  public revokeSession(sessionId: string, actorUserId?: string, ipAddress?: string, userAgent?: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.isRevoked = true;
    this.recordSecurityEvent('SESSION_REVOKED', actorUserId || session.userId, session.userId, ipAddress, userAgent, {
      sessionId: sessionId.substring(0, 10) + '...',
    });
    return true;
  }

  /**
   * Revokes all active sessions for a user, optionally exempting current session.
   */
  public revokeAllUserSessions(userId: string, exceptSessionId?: string): number {
    let count = 0;
    for (const [id, session] of this.sessions.entries()) {
      if (session.userId === userId && !session.isRevoked) {
        if (exceptSessionId && id === exceptSessionId) {
          continue;
        }
        session.isRevoked = true;
        count++;
      }
    }
    return count;
  }

  /**
   * Retrieves active sessions for a user.
   */
  public getUserSessions(userId: string, currentSessionId?: string): SessionInfo[] {
    const now = Date.now();
    const results: SessionInfo[] = [];

    for (const session of this.sessions.values()) {
      if (session.userId === userId && !session.isRevoked) {
        const expiry = new Date(session.expiresAt).getTime();
        if (now <= expiry) {
          results.push({
            sessionId: session.id,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
            lastActiveAt: session.lastActiveAt,
            ipAddress: session.ipAddress,
            userAgent: session.userAgent,
            isCurrent: session.id === currentSessionId,
          });
        }
      }
    }

    // Sort by last active descending
    return results.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
  }

  // ==========================================
  // PASSWORD RECOVERY & EMAIL VERIFICATION
  // ==========================================

  /**
   * Creates a password reset token. Always returns safe token object regardless of whether
   * the email exists (preventing timing attacks).
   */
  public createPasswordResetToken(
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): { token: string; emailExists: boolean } {
    const normalizedEmail = CryptoService.normalizeEmail(email);
    const user = this.findByEmail(normalizedEmail);
    const token = CryptoService.generateToken('reset');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour

    if (user) {
      this.passwordResetTokens.set(token, {
        token,
        userId: user.id,
        email: normalizedEmail,
        expiresAt,
        isUsed: false,
        createdAt: now.toISOString(),
      });

      this.recordSecurityEvent('PASSWORD_RESET_REQUESTED', null, user.id, ipAddress, userAgent, {
        email: normalizedEmail,
      });

      return { token, emailExists: true };
    }

    return { token, emailExists: false };
  }

  /**
   * Resets password using a valid reset token.
   */
  public resetPasswordWithToken(
    token: string,
    newPassword: string,
    ipAddress?: string,
    userAgent?: string
  ): { success: boolean; message: string } {
    const record = this.passwordResetTokens.get(token);
    if (!record || record.isUsed) {
      return { success: false, message: 'Invalid or expired password reset token.' };
    }

    const now = Date.now();
    const expiry = new Date(record.expiresAt).getTime();
    if (now > expiry) {
      return { success: false, message: 'Password reset token has expired. Please request a new one.' };
    }

    const user = this.findById(record.userId);
    if (!user) {
      return { success: false, message: 'User account not found.' };
    }

    const validation = CryptoService.validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      return { success: false, message: validation.errors.join('. ') };
    }

    user.passwordHash = CryptoService.hashPassword(newPassword);
    user.lastPasswordChangeAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    if (user.status === UserStatus.LOCKED) {
      user.status = UserStatus.ACTIVE;
    }

    record.isUsed = true;
    this.revokeAllUserSessions(user.id);

    this.recordSecurityEvent('PASSWORD_RESET_COMPLETED', user.id, user.id, ipAddress, userAgent);

    return { success: true, message: 'Password has been successfully reset. Please log in.' };
  }

  // ==========================================
  // SECURITY AUDIT TRAIL
  // ==========================================

  /**
   * Appends an auditable security event.
   */
  public recordSecurityEvent(
    eventType: SecurityEventType,
    actorUserId?: string | null,
    targetUserId?: string | null,
    ipAddress?: string,
    userAgent?: string,
    metadata?: Record<string, unknown>
  ): SecurityEvent {
    const event: SecurityEvent = {
      id: CryptoService.generateId('evt'),
      eventType,
      actorUserId: actorUserId || null,
      targetUserId: targetUserId || null,
      ipAddress: CryptoService.anonymizeIp(ipAddress),
      userAgent: userAgent ? userAgent.substring(0, 150) : undefined,
      metadata: metadata || {},
      createdAt: new Date().toISOString(),
    };

    this.securityEvents.unshift(event);

    // Keep max 2000 events in memory
    if (this.securityEvents.length > 2000) {
      this.securityEvents.pop();
    }

    return event;
  }

  /**
   * Retrieves security events for a specific user.
   */
  public getSecurityEventsForUser(userId: string, limit: number = 20): SecurityEvent[] {
    return this.securityEvents
      .filter((evt) => evt.targetUserId === userId || evt.actorUserId === userId)
      .slice(0, limit);
  }

  /**
   * Retrieves all security events (admin audit log).
   */
  public getAllSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.securityEvents.slice(0, limit);
  }

  // ==========================================
  // SERIALIZATION & SANITIZATION
  // ==========================================

  /**
   * Sanitizes UserEntity into public-safe UserProfile.
   * Strips passwordHash, salts, failed attempts, and sensitive recovery internals.
   */
  public toPublicProfile(user: UserEntity): UserProfile {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      country: user.country,
      countryCode: user.countryCode,
      timezone: user.timezone,
      locale: user.locale,
      status: user.status,
      roles: user.roles,
      permissions: user.permissions,
      emailVerified: Boolean(user.emailVerifiedAt),
      phoneVerified: Boolean(user.phoneVerifiedAt),
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}

// Export singleton instance
export const userStore = new UserStore();
