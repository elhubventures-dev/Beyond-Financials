/**
 * Beyond Financials - Authentication & Authorization Middleware
 * 
 * Verifies session tokens, checks account status (active vs suspended/locked),
 * enforces Role-Based Access Control (RBAC) and permission checks.
 */

import { Request, Response, NextFunction } from 'express';
import { userStore } from '../services/userStore';
import { UserEntity, UserProfile, UserSession, UserRole, Permission, UserStatus } from '../types/auth';
import { RbacService } from '../services/rbacService';
import { AppError } from './errorHandler';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
      userProfile?: UserProfile;
      session?: UserSession;
    }
  }
}

/**
 * Extracts session ID from standard Authorization header or custom header.
 */
function extractSessionId(req: Request): string | undefined {
  const authHeader = req.headers['authorization'];
  if (authHeader && typeof authHeader === 'string') {
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7).trim();
    }
    return authHeader.trim();
  }

  const customHeader = req.headers['x-session-id'];
  if (customHeader && typeof customHeader === 'string') {
    return customHeader.trim();
  }

  return undefined;
}

/**
 * Enforces that a request has a valid, active session.
 */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const sessionId = extractSessionId(req);

    if (!sessionId) {
      throw new AppError(
        'Authentication required. Please log in to access this resource.',
        401,
        'AUTH_REQUIRED'
      );
    }

    const validation = userStore.validateSession(sessionId);
    if (!validation) {
      throw new AppError(
        'Session expired or invalid. Please log in again.',
        401,
        'INVALID_SESSION'
      );
    }

    const { user, session } = validation;

    // Check account status
    if (user.status === UserStatus.SUSPENDED) {
      throw new AppError(
        'Your account has been suspended. Please contact Beyond Financials support.',
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

    // Check temporary lock
    const lockCheck = userStore.isAccountLocked(user);
    if (lockCheck.isLocked) {
      throw new AppError(
        `Account temporarily locked due to security attempts. Please try again in ${lockCheck.remainingMinutes || 15} minutes.`,
        423,
        'ACCOUNT_LOCKED'
      );
    }

    // Attach to request
    req.user = user;
    req.userProfile = userStore.toPublicProfile(user);
    req.session = session;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication: attaches user if session token is provided and valid,
 * but allows unauthenticated requests to proceed.
 */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const sessionId = extractSessionId(req);
    if (sessionId) {
      const validation = userStore.validateSession(sessionId);
      if (validation) {
        req.user = validation.user;
        req.userProfile = userStore.toPublicProfile(validation.user);
        req.session = validation.session;
      }
    }
    next();
  } catch {
    next();
  }
}

/**
 * Middleware factory to enforce required Role.
 */
export function requireRole(role: UserRole) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'AUTH_REQUIRED'));
    }

    if (!RbacService.hasRole(req.user, role)) {
      return next(
        new AppError(
          `Access forbidden: requires ${role} role privileges.`,
          403,
          'INSUFFICIENT_ROLE_PRIVILEGES'
        )
      );
    }

    next();
  };
}

/**
 * Middleware factory to enforce required Permission.
 */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Authentication required.', 401, 'AUTH_REQUIRED'));
    }

    if (!RbacService.hasPermission(req.user, permission)) {
      return next(
        new AppError(
          `Access forbidden: requires ${permission} permission.`,
          403,
          'INSUFFICIENT_PERMISSIONS'
        )
      );
    }

    next();
  };
}
