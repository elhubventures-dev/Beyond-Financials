/**
 * Beyond Financials - Cryptography, Password Hashing & Security Utilities
 * 
 * Standards:
 * - Scrypt key derivation with random 16-byte cryptographically secure salt.
 * - Constant-time comparison (crypto.timingSafeEqual) against timing attacks.
 * - Zero plaintext password storage.
 * - Robust password complexity validation.
 */

import crypto from 'crypto';

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 4
  errors: string[];
}

export class CryptoService {
  private static readonly SCRYPT_KEY_LENGTH = 64;
  private static readonly SALT_LENGTH = 16;

  /**
   * Hashes a plaintext password using scrypt with a unique random salt.
   * Stored format: "scrypt:salt_hex:derived_key_hex"
   */
  public static hashPassword(password: string): string {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    const salt = crypto.randomBytes(this.SALT_LENGTH).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, this.SCRYPT_KEY_LENGTH);
    return `scrypt:${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * Constant-time verification of a plaintext password against a stored scrypt hash.
   */
  public static verifyPassword(password: string, storedHash: string): boolean {
    if (!password || !storedHash) return false;

    try {
      const parts = storedHash.split(':');
      if (parts.length !== 3 || parts[0] !== 'scrypt') {
        return false;
      }

      const salt = parts[1];
      const originalKeyHex = parts[2];
      const originalKey = Buffer.from(originalKeyHex, 'hex');

      const derivedKey = crypto.scryptSync(password, salt, this.SCRYPT_KEY_LENGTH);

      if (originalKey.length !== derivedKey.length) {
        return false;
      }

      return crypto.timingSafeEqual(originalKey, derivedKey);
    } catch {
      return false;
    }
  }

  /**
   * Validates password strength according to Beyond Financials Security Policy:
   * - Minimum 8 characters (12+ recommended)
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 number
   * - At least 1 special character
   */
  public static validatePasswordStrength(password: string): PasswordValidationResult {
    const errors: string[] = [];
    let score = 0;

    if (!password || typeof password !== 'string') {
      return { isValid: false, score: 0, errors: ['Password is required'] };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    } else {
      score += 1;
      if (password.length >= 12) score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter (A-Z)');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter (a-z)');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one numerical digit (0-9)');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*...)');
    } else {
      score += 1;
    }

    return {
      isValid: errors.length === 0,
      score: Math.min(score, 4),
      errors,
    };
  }

  /**
   * Generates a cryptographically secure random identifier.
   */
  public static generateId(prefix: string = 'id', byteLength: number = 16): string {
    const randomHex = crypto.randomBytes(byteLength).toString('hex');
    return `${prefix}_${randomHex}`;
  }

  /**
   * Generates a secure random session token.
   */
  public static generateSessionToken(): string {
    return this.generateId('sess', 24);
  }

  /**
   * Generates a secure random password reset or verification token.
   */
  public static generateToken(prefix: string = 'tok'): string {
    return this.generateId(prefix, 32);
  }

  /**
   * Normalizes email address (lowercase, trim).
   */
  public static normalizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    return email.trim().toLowerCase();
  }

  /**
   * Validates email format.
   */
  public static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Normalizes international phone number.
   * Ensures standard prefix format without punctuation.
   */
  public static normalizePhone(phone: string, defaultCountryCode: string = '+234'): string {
    if (!phone || typeof phone !== 'string') return '';
    // Strip whitespace, hyphens, brackets, dots
    let cleaned = phone.replace(/[\s\-().]/g, '');

    // If starts with 0 and Nigerian default, convert to +234
    if (cleaned.startsWith('0') && defaultCountryCode === '+234') {
      cleaned = '+234' + cleaned.substring(1);
    } else if (!cleaned.startsWith('+')) {
      cleaned = defaultCountryCode + cleaned;
    }

    return cleaned;
  }

  /**
   * Validates international phone format.
   */
  public static isValidPhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = phone.replace(/[\s\-().]/g, '');
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;
    return phoneRegex.test(cleaned);
  }

  /**
   * Anonymizes IP address for privacy-safe security event recording.
   */
  public static anonymizeIp(ip: string | undefined): string {
    if (!ip) return '0.0.0.0';
    if (ip.includes(':')) {
      // IPv6 - keep first 3 segments
      const parts = ip.split(':');
      return parts.slice(0, 3).join(':') + '::xxxx';
    }
    // IPv4 - keep first 3 octets
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return 'xxx.xxx.xxx.xxx';
  }
}
