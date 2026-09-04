# Beyond Financials — Identity & Authentication Architecture Specification

## 1. Executive Overview & Domain Boundaries

The **Beyond Financials Identity & Authentication Subsystem** establishes the secure user registry, cryptographic credential verification, role-based access control (RBAC), and session state management that all future financial services (accounts, vaults, loans, transfers) depend on.

### Domain Separation Rule
- **Public Acquisition / Waitlist Leads (`/server/services/leadStore.ts`)**: Transient marketing interest collection. Not customer accounts. Holds no credentials or authentication capabilities.
- **Customer Identity Foundation (`/server/services/userStore.ts`)**: Authoritative, cryptographically isolated customer identity and permission registry.
- **Administrative Access**: Admin roles (`ADMIN`, `SUPER_ADMIN`) are authenticated users with granular RBAC permissions (`ADMIN_MANAGE`, `SECURITY_AUDIT_VIEW`, `USER_UPDATE_ALL`), completely decoupled from any single static API key in the financial core.

---

## 2. Core Domain Models

### User Entity
```typescript
interface UserEntity {
  id: string;                      // Prefix 'usr_' + 24 cryptographically random bytes
  firstName: string;
  lastName: string;
  email: string;                   // Normalized lowercase; unique primary identity key
  phone: string;                   // E.164 formatted; unique secondary identity key
  country: string;                 // ISO 3166-1 alpha-2 (e.g., 'NG', 'GH', 'KE', 'GB', 'US')
  countryCode: string;             // Dial prefix (e.g., '+234')
  timezone: string;                // IANA format (e.g., 'Africa/Lagos')
  locale: string;                  // e.g., 'en'
  status: UserStatus;              // PENDING_VERIFICATION | ACTIVE | SUSPENDED | LOCKED | DEACTIVATED
  roles: UserRole[];               // CUSTOMER | MERCHANT | AGENT | SUPPORT | COMPLIANCE | FINANCE | ADMIN | SUPER_ADMIN
  passwordHash: string;            // scrypt:salt:derivedKey format
  failedLoginAttempts: number;     // Monitored for brute-force lockouts
  lockedUntil: string | null;      // ISO string timestamp if locked
  emailVerified: boolean;
  phoneVerified: boolean;
  lastLoginAt: string | null;
  lastPasswordChangeAt: string;
  createdAt: string;
  updatedAt: string;
}
```

### Session Entity
```typescript
interface SessionEntity {
  sessionId: string;               // Prefix 'sess_' + 32 cryptographically random bytes
  userId: string;                  // Foreign key -> UserEntity.id
  expiresAt: string;               // ISO timestamp (Default: 7 days TTL)
  createdAt: string;
  lastActiveAt: string;            // Updated on authenticated API calls
  userAgent?: string;
  ipAddress?: string;
}
```

---

## 3. Cryptographic Security Standards

1. **Password Storage**:
   - Algorithm: **scrypt** (Memory-hard key derivation function)
   - Parameters: `N=16384` (CPU/memory cost), `r=8` (block size), `p=1` (parallelization), `keyLen=64 bytes`.
   - Salt: 32 bytes cryptographically secure random bytes generated via `crypto.randomBytes(32)`.
   - Storage format: `scrypt:${saltHex}:${derivedKeyHex}`.
   - Plaintext passwords are never logged, persisted, or passed beyond the memory stack of the credential evaluation function.

2. **Constant-Time Verification**:
   - Hash comparisons utilize `crypto.timingSafeEqual` over fixed-length binary buffers to eliminate side-channel timing attacks.

3. **Session Token Generation**:
   - `sess_` + 64 hex characters (32 bytes entropy), resistant to collision or prediction.

---

## 4. Role-Based Access Control (RBAC) Matrix

| Permission | CUSTOMER | AGENT | SUPPORT | COMPLIANCE | FINANCE | ADMIN | SUPER_ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `USER_READ_OWN` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `USER_UPDATE_OWN` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `USER_READ_ALL` | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `USER_UPDATE_ALL` | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| `USER_SUSPEND` | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `KYC_SUBMIT` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `KYC_READ_ALL` | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| `KYC_REVIEW` | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `SECURITY_AUDIT_VIEW` | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| `ADMIN_MANAGE` | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Security Lifecycle & Lockout Logic

- **Lockout Policy**:
  - Maximum consecutive failed login attempts: **5 attempts**.
  - Lockout window: **15 minutes**.
  - Attempt counter resets automatically upon successful login.
- **Session Revocation**:
  - Password change or reset automatically invalidates all existing active sessions.
  - Users can inspect active device sessions and selectively revoke individual sessions or all other sessions.
- **Account Enumeration Protection**:
  - Registration with an existing email returns an intentional generic rejection without confirming account existence.
  - Login failure returns generic `"Invalid credentials provided."` whether email exists, password fails, or phone does not match.
  - Forgot password requests always return `"If an account is registered with this email, recovery instructions have been recorded."`
