/**
 * Beyond Financials - Authentication & Identity API Routes
 * 
 * Endpoints:
 * - POST /api/auth/register         - User account registration with password policy
 * - POST /api/auth/login            - Timing-safe login with brute force locking
 * - POST /api/auth/logout           - Session invalidation
 * - GET  /api/auth/session          - Active session & user profile validation
 * - GET  /api/auth/profile          - User profile retrieval
 * - PATCH /api/auth/profile         - User profile update
 * - POST /api/auth/change-password  - Secure password rotation
 * - POST /api/auth/forgot-password  - Account enumeration-safe recovery
 * - POST /api/auth/reset-password   - Token-based password reset
 * - GET  /api/auth/sessions         - Active session list for user
 * - DELETE /api/auth/sessions/:id   - Revoke specific session
 * - DELETE /api/auth/sessions       - Revoke all other sessions
 * - GET  /api/auth/security-events  - User's recent security activity log
 */

import { Router, Request, Response } from 'express';
import { userStore } from '../services/userStore';
import { CryptoService } from '../services/cryptoService';
import { requireAuth } from '../middleware/auth';
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordRecoveryRateLimiter,
  passwordChangeRateLimiter,
} from '../middleware/authRateLimit';
import { allowsDevTokenDisclosure } from '../email/config';
import { AppError } from '../middleware/errorHandler';
import { UserStatus } from '../types/auth';
import {
  notifyEmailVerification,
  notifyPasswordChanged,
  notifyPasswordReset,
  PublicEmailStatus,
} from '../services/notificationService';

export const authRouter = Router();

// ==========================================
// 1. REGISTRATION
// ==========================================
authRouter.post('/register', registerRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, termsAccepted, country, countryCode } = req.body;

    // Validate required fields
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
      throw new AppError('First name is required (minimum 2 characters).', 400, 'INVALID_FIRST_NAME');
    }

    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
      throw new AppError('Last name is required (minimum 2 characters).', 400, 'INVALID_LAST_NAME');
    }

    if (!email || !CryptoService.isValidEmail(email)) {
      throw new AppError('A valid email address is required.', 400, 'INVALID_EMAIL');
    }

    if (!phone || !CryptoService.isValidPhone(phone)) {
      throw new AppError('A valid international phone number is required.', 400, 'INVALID_PHONE');
    }

    if (!password || typeof password !== 'string') {
      throw new AppError('Password is required.', 400, 'PASSWORD_REQUIRED');
    }

    if (password !== confirmPassword) {
      throw new AppError('Passwords do not match.', 400, 'PASSWORDS_MISMATCH');
    }

    if (!termsAccepted) {
      throw new AppError('You must acknowledge and accept the Terms of Service to register.', 400, 'TERMS_REQUIRED');
    }

    // Attempt creation
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    try {
      const result = await userStore.createUser({
        firstName,
        lastName,
        email,
        phone,
        password,
        country: country || 'NG',
        countryCode: countryCode || '+234',
        termsAccepted: Boolean(termsAccepted),
        ipAddress: clientIp,
        userAgent,
      });

      const correlationId = typeof req.headers['x-request-id'] === 'string'
        ? req.headers['x-request-id'].slice(0, 80)
        : CryptoService.generateId('req', 8);

      const verification = userStore.createEmailVerificationToken(result.user.id, clientIp, userAgent);
      let emailVerification: PublicEmailStatus = 'skipped';
      if (verification) {
        emailVerification = await notifyEmailVerification({
          userId: result.user.id,
          email: verification.email,
          firstName: verification.firstName,
          token: verification.token,
          correlationId,
        });
      }

      res.status(201).json({
        success: true,
        message: 'Account successfully created. Welcome to Beyond Financials.',
        data: {
          user: result.user,
          session: {
            sessionId: result.session.id,
            expiresAt: result.session.expiresAt,
            createdAt: result.session.createdAt,
          },
          emailVerification,
          ...(allowsDevTokenDisclosure() && verification
            ? { devVerificationToken: verification.token }
            : {}),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      throw new AppError(errorMessage, 400, 'REGISTRATION_FAILED');
    }
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 2. LOGIN
// ==========================================
authRouter.post('/login', loginRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required.', 400, 'MISSING_CREDENTIALS');
    }

    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const normalizedEmail = CryptoService.normalizeEmail(email);

    const user = userStore.findByEmail(normalizedEmail);

    // Timing-safe response: if user doesn't exist, execute dummy scrypt hash to prevent timing enumeration
    if (!user) {
      CryptoService.verifyPassword(
        password,
        'scrypt:00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
      );
      userStore.recordSecurityEvent('LOGIN_FAILURE', null, null, clientIp, userAgent, {
        reason: 'Account not found (enumerated safely)',
      });
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Check account status
    if (user.status === UserStatus.SUSPENDED) {
      throw new AppError(
        'Your account has been suspended. Please contact Beyond Financials compliance support.',
        403,
        'ACCOUNT_SUSPENDED'
      );
    }

    if (user.status === UserStatus.DEACTIVATED) {
      throw new AppError(
        'This account has been deactivated.',
        403,
        'ACCOUNT_DEACTIVATED'
      );
    }

    // Check temporary account lock
    const lockStatus = userStore.isAccountLocked(user);
    if (lockStatus.isLocked) {
      throw new AppError(
        `Account temporarily locked due to multiple failed login attempts. Please try again in ${lockStatus.remainingMinutes || 15} minutes.`,
        423,
        'ACCOUNT_LOCKED'
      );
    }

    // Verify password
    const isPasswordValid = CryptoService.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      userStore.recordFailedLogin(user, clientIp, userAgent);
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Successful Login
    userStore.recordSuccessfulLogin(user, clientIp, userAgent);
    const session = userStore.createSession(user.id, clientIp, userAgent);
    const publicProfile = userStore.toPublicProfile(user);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: publicProfile,
        session: {
          sessionId: session.id,
          expiresAt: session.expiresAt,
          createdAt: session.createdAt,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 3. LOGOUT
// ==========================================
authRouter.post('/logout', requireAuth, (req: Request, res: Response, next) => {
  try {
    if (req.session) {
      const clientIp = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];
      userStore.revokeSession(req.session.id, req.user?.id, clientIp, userAgent);
    }

    res.json({
      success: true,
      message: 'Logged out successfully.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 4. SESSION VALIDATION
// ==========================================
authRouter.get('/session', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      user: req.userProfile,
      session: {
        sessionId: req.session?.id,
        expiresAt: req.session?.expiresAt,
        createdAt: req.session?.createdAt,
        lastActiveAt: req.session?.lastActiveAt,
      },
    },
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 5. PROFILE GET & UPDATE
// ==========================================
authRouter.get('/profile', requireAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    data: req.userProfile,
    timestamp: new Date().toISOString(),
  });
});

authRouter.patch('/profile', requireAuth, (req: Request, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const { firstName, lastName, phone, country, timezone, locale } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const updatedProfile = userStore.updateProfile(
      req.user.id,
      { firstName, lastName, phone, country, timezone, locale },
      clientIp,
      userAgent
    );

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedProfile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 6. CHANGE PASSWORD
// ==========================================
authRouter.post('/change-password', requireAuth, passwordChangeRateLimiter, async (req: Request, res: Response, next) => {
  try {
    if (!req.user || !req.session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required.', 400, 'MISSING_FIELDS');
    }

    if (newPassword !== confirmPassword) {
      throw new AppError('New passwords do not match.', 400, 'PASSWORDS_MISMATCH');
    }

    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    try {
      userStore.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
        req.session.id,
        clientIp,
        userAgent
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to change password.';
      throw new AppError(message, 400, 'PASSWORD_CHANGE_FAILED');
    }

    const changedAt = new Date().toISOString();
    const correlationId = typeof req.headers['x-request-id'] === 'string'
      ? req.headers['x-request-id'].slice(0, 80)
      : CryptoService.generateId('req', 8);
    const securityNotice = await notifyPasswordChanged({
      userId: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      changedAt,
      correlationId,
    });

    res.json({
      success: true,
      message: 'Password changed successfully. Other active sessions have been signed out for security.',
      data: { securityNotice },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 7. FORGOT PASSWORD (Safe Response)
// ==========================================
authRouter.post('/forgot-password', passwordRecoveryRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const { email } = req.body;

    if (!email || !CryptoService.isValidEmail(email)) {
      throw new AppError('A valid email address is required.', 400, 'INVALID_EMAIL');
    }

    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const recovery = userStore.createPasswordResetToken(email, clientIp, userAgent);

    if (recovery.emailExists && recovery.token && recovery.userId) {
      const correlationId = typeof req.headers['x-request-id'] === 'string'
        ? req.headers['x-request-id'].slice(0, 80)
        : CryptoService.generateId('req', 8);
      await notifyPasswordReset({
        userId: recovery.userId,
        email: CryptoService.normalizeEmail(email),
        firstName: recovery.firstName || 'there',
        token: recovery.token,
        correlationId,
      });
    }

    // Same response whether or not an account exists, and whether or not email delivery succeeded.
    res.json({
      success: true,
      message: 'If an account exists for this email address, a password reset request has been recorded.',
      data: {
        // Local development helper only. Never returned in production.
        ...(allowsDevTokenDisclosure() && recovery.emailExists
          ? { devResetToken: recovery.token }
          : {}),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 8. RESET PASSWORD WITH TOKEN
// ==========================================
authRouter.post('/reset-password', passwordRecoveryRateLimiter, async (req: Request, res: Response, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || typeof token !== 'string') {
      throw new AppError('Reset token is required.', 400, 'TOKEN_REQUIRED');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      throw new AppError('New password is required.', 400, 'PASSWORD_REQUIRED');
    }

    if (newPassword !== confirmPassword) {
      throw new AppError('Passwords do not match.', 400, 'PASSWORDS_MISMATCH');
    }

    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const result = userStore.resetPasswordWithToken(token, newPassword, clientIp, userAgent);

    if (!result.success) {
      throw new AppError(result.message, 400, 'RESET_FAILED');
    }

    let securityNotice: PublicEmailStatus = 'skipped';
    if (result.userId && result.email) {
      const correlationId = typeof req.headers['x-request-id'] === 'string'
        ? req.headers['x-request-id'].slice(0, 80)
        : CryptoService.generateId('req', 8);
      securityNotice = await notifyPasswordChanged({
        userId: result.userId,
        email: result.email,
        firstName: result.firstName || 'there',
        changedAt: new Date().toISOString(),
        correlationId,
      });
    }

    res.json({
      success: true,
      message: result.message,
      data: { securityNotice },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 8b. EMAIL VERIFICATION
// ==========================================
authRouter.post('/verify-email', passwordRecoveryRateLimiter, (req: Request, res: Response, next) => {
  try {
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = userStore.consumeEmailVerificationToken(token, clientIp, userAgent);

    if (!result.success) {
      throw new AppError(result.message, 400, 'VERIFICATION_FAILED');
    }

    res.json({
      success: true,
      message: result.message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/resend-verification', requireAuth, passwordRecoveryRateLimiter, async (req: Request, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    if (req.user.emailVerifiedAt) {
      res.json({
        success: true,
        message: 'This email address is already verified.',
        data: { emailVerification: 'skipped' satisfies PublicEmailStatus },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const verification = userStore.createEmailVerificationToken(req.user.id, clientIp, userAgent);

    if (!verification) {
      res.json({
        success: true,
        message: 'This email address is already verified.',
        data: { emailVerification: 'skipped' satisfies PublicEmailStatus },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const correlationId = typeof req.headers['x-request-id'] === 'string'
      ? req.headers['x-request-id'].slice(0, 80)
      : CryptoService.generateId('req', 8);

    const emailVerification = await notifyEmailVerification({
      userId: req.user.id,
      email: verification.email,
      firstName: verification.firstName,
      token: verification.token,
      correlationId,
    });

    const accepted = emailVerification === 'accepted';
    res.json({
      success: true,
      message: accepted
        ? 'A verification email was submitted to your email provider. This does not confirm it has reached your inbox.'
        : 'We could not send a verification email just now. Your account is unchanged.',
      data: {
        emailVerification,
        ...(allowsDevTokenDisclosure() ? { devVerificationToken: verification.token } : {}),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 9. ACTIVE SESSIONS MANAGEMENT
// ==========================================
authRouter.get('/sessions', requireAuth, (req: Request, res: Response, next) => {
  try {
    if (!req.user || !req.session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const sessions = userStore.getUserSessions(req.user.id, req.session.id);

    res.json({
      success: true,
      data: sessions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.delete('/sessions/:sessionId', requireAuth, (req: Request, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const { sessionId } = req.params;
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const revoked = userStore.revokeSession(sessionId, req.user.id, clientIp, userAgent);
    if (!revoked) {
      throw new AppError('Session not found.', 404, 'SESSION_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Session revoked successfully.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

authRouter.delete('/sessions', requireAuth, (req: Request, res: Response, next) => {
  try {
    if (!req.user || !req.session) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const revokedCount = userStore.revokeAllUserSessions(req.user.id, req.session.id);

    res.json({
      success: true,
      message: `${revokedCount} other active session(s) revoked successfully.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 10. SECURITY EVENTS / AUDIT LOG
// ==========================================
authRouter.get('/security-events', requireAuth, (req: Request, res: Response, next) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const events = userStore.getSecurityEventsForUser(req.user.id, limit);

    res.json({
      success: true,
      data: events,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});
