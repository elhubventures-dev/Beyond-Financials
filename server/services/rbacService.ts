/**
 * Beyond Financials - Role-Based Access Control (RBAC) & Permission Service
 * 
 * Centralizes role hierarchies, permission mapping, and authorization checks.
 */

import { UserRole, Permission, UserEntity, UserProfile } from '../types/auth';

/**
 * Standard Role-to-Permissions Mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    Permission.USER_READ_OWN,
    Permission.USER_UPDATE_OWN,
    Permission.KYC_SUBMIT,
    Permission.KYC_READ_OWN,
    Permission.TRANSACTION_READ_OWN,
    Permission.TRANSACTION_INITIATE,
    Permission.LOAN_APPLY,
    Permission.LOAN_READ_OWN,
  ],
  [UserRole.MERCHANT]: [
    Permission.USER_READ_OWN,
    Permission.USER_UPDATE_OWN,
    Permission.KYC_SUBMIT,
    Permission.KYC_READ_OWN,
    Permission.TRANSACTION_READ_OWN,
    Permission.TRANSACTION_INITIATE,
    Permission.REPORT_VIEW,
  ],
  [UserRole.AGENT]: [
    Permission.USER_READ_OWN,
    Permission.USER_UPDATE_OWN,
    Permission.KYC_SUBMIT,
    Permission.KYC_READ_OWN,
    Permission.TRANSACTION_READ_OWN,
    Permission.TRANSACTION_INITIATE,
    Permission.REPORT_VIEW,
  ],
  [UserRole.SUPPORT]: [
    Permission.USER_READ_OWN,
    Permission.USER_READ_ALL,
    Permission.KYC_READ_ALL,
    Permission.TRANSACTION_READ_ALL,
    Permission.LOAN_READ_ALL,
  ],
  [UserRole.COMPLIANCE]: [
    Permission.USER_READ_ALL,
    Permission.USER_SUSPEND,
    Permission.KYC_READ_ALL,
    Permission.KYC_REVIEW,
    Permission.TRANSACTION_READ_ALL,
    Permission.TRANSACTION_REVIEW,
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.SECURITY_AUDIT_VIEW,
  ],
  [UserRole.FINANCE]: [
    Permission.USER_READ_ALL,
    Permission.TRANSACTION_READ_ALL,
    Permission.TRANSACTION_REVIEW,
    Permission.LOAN_READ_ALL,
    Permission.LOAN_REVIEW,
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
  ],
  [UserRole.ADMIN]: [
    Permission.USER_READ_ALL,
    Permission.USER_UPDATE_ALL,
    Permission.USER_SUSPEND,
    Permission.KYC_READ_ALL,
    Permission.KYC_REVIEW,
    Permission.TRANSACTION_READ_ALL,
    Permission.TRANSACTION_REVIEW,
    Permission.LOAN_READ_ALL,
    Permission.LOAN_REVIEW,
    Permission.REPORT_VIEW,
    Permission.REPORT_EXPORT,
    Permission.SECURITY_AUDIT_VIEW,
    Permission.ADMIN_MANAGE,
  ],
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
};

export class RbacService {
  /**
   * Resolves full list of deduplicated permissions for a list of roles.
   */
  public static getPermissionsForRoles(roles: UserRole[]): Permission[] {
    const permSet = new Set<Permission>();
    for (const role of roles) {
      const perms = ROLE_PERMISSIONS[role] || [];
      for (const p of perms) {
        permSet.add(p);
      }
    }
    return Array.from(permSet);
  }

  /**
   * Checks if user has a specific permission.
   */
  public static hasPermission(user: UserEntity | UserProfile, permission: Permission): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }

  /**
   * Checks if user has a specific role.
   */
  public static hasRole(user: UserEntity | UserProfile, role: UserRole): boolean {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }

  /**
   * Checks if user is an administrator (ADMIN or SUPER_ADMIN).
   */
  public static isAdmin(user: UserEntity | UserProfile): boolean {
    return this.hasRole(user, UserRole.ADMIN) || this.hasRole(user, UserRole.SUPER_ADMIN);
  }
}
