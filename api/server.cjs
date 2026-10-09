var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/vercelHandler.ts
var vercelHandler_exports = {};
__export(vercelHandler_exports, {
  createVercelApp: () => createVercelApp,
  default: () => vercelHandler_default,
  restoreApiPath: () => restoreApiPath
});
module.exports = __toCommonJS(vercelHandler_exports);
var import_express7 = __toESM(require("express"), 1);

// server/app.ts
var import_express6 = __toESM(require("express"), 1);

// server/middleware/logger.ts
function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url } = req;
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const sanitizedUrl = String(url || "").replace(/([?&](bvn|nin|password|token)=)[^&]+/gi, "$1[REDACTED]").replace(/(\/sessions\/)[^/?]+/gi, "$1[REDACTED]");
    console.log(`[HTTP] ${method} ${sanitizedUrl} -> ${statusCode} (${duration}ms)`);
  });
  next();
}

// server/middleware/errorHandler.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400, code = "BAD_REQUEST", details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
function errorHandler(err, req, res, _next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const code = isAppError ? err.code : "INTERNAL_SERVER_ERROR";
  const message = isAppError ? err.message : "An unexpected error occurred. Please try again later.";
  const details = isAppError ? err.details : void 0;
  console.error(`[ERROR] [${code}] ${err.message}`, process.env.NODE_ENV !== "production" ? err.stack : "");
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// server/routes/health.ts
var import_express = require("express");
var healthRouter = (0, import_express.Router)();
healthRouter.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Beyond Financials is preparing for launch.",
    data: {
      service: "beyond-financials",
      status: "PRE_LAUNCH",
      realTransactionsEnabled: false,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
healthRouter.get("/system/status", (_req, res) => {
  res.json({
    success: true,
    message: "Beyond Financials services are not yet available to the public.",
    data: {
      status: "PRE_LAUNCH",
      realTransactionsEnabled: false
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});

// server/routes/waitlist.ts
var import_express2 = require("express");

// server/services/cryptoService.ts
var import_crypto = __toESM(require("crypto"), 1);
var CryptoService = class {
  static {
    this.SCRYPT_KEY_LENGTH = 64;
  }
  static {
    this.SALT_LENGTH = 16;
  }
  /**
   * Hashes a plaintext password using scrypt with a unique random salt.
   * Stored format: "scrypt:salt_hex:derived_key_hex"
   */
  static hashPassword(password) {
    if (!password || typeof password !== "string") {
      throw new Error("Password must be a non-empty string");
    }
    const salt = import_crypto.default.randomBytes(this.SALT_LENGTH).toString("hex");
    const derivedKey = import_crypto.default.scryptSync(password, salt, this.SCRYPT_KEY_LENGTH);
    return `scrypt:${salt}:${derivedKey.toString("hex")}`;
  }
  /**
   * Constant-time verification of a plaintext password against a stored scrypt hash.
   */
  static verifyPassword(password, storedHash) {
    if (!password || !storedHash) return false;
    try {
      const parts = storedHash.split(":");
      if (parts.length !== 3 || parts[0] !== "scrypt") {
        return false;
      }
      const salt = parts[1];
      const originalKeyHex = parts[2];
      const originalKey = Buffer.from(originalKeyHex, "hex");
      const derivedKey = import_crypto.default.scryptSync(password, salt, this.SCRYPT_KEY_LENGTH);
      if (originalKey.length !== derivedKey.length) {
        return false;
      }
      return import_crypto.default.timingSafeEqual(originalKey, derivedKey);
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
  static validatePasswordStrength(password) {
    const errors = [];
    let score = 0;
    if (!password || typeof password !== "string") {
      return { isValid: false, score: 0, errors: ["Password is required"] };
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    } else {
      score += 1;
      if (password.length >= 12) score += 1;
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter (A-Z)");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter (a-z)");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one numerical digit (0-9)");
    } else {
      score += 1;
    }
    if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
      errors.push("Password must contain at least one special character (!@#$%^&*...)");
    } else {
      score += 1;
    }
    return {
      isValid: errors.length === 0,
      score: Math.min(score, 4),
      errors
    };
  }
  /**
   * Generates a cryptographically secure random identifier.
   */
  static generateId(prefix = "id", byteLength = 16) {
    const randomHex = import_crypto.default.randomBytes(byteLength).toString("hex");
    return `${prefix}_${randomHex}`;
  }
  /**
   * Generates a secure random session token.
   */
  static generateSessionToken() {
    return this.generateId("sess", 24);
  }
  /**
   * Generates a secure random password reset or verification token.
   */
  static generateToken(prefix = "tok") {
    return this.generateId(prefix, 32);
  }
  /**
   * SHA-256 hex digest for reset, verification, and unsubscribe tokens.
   * Only the raw token is emailed. Stores and logs keep this hash.
   */
  static hashToken(token) {
    return import_crypto.default.createHash("sha256").update(token).digest("hex");
  }
  /**
   * Normalizes email address (lowercase, trim).
   */
  static normalizeEmail(email) {
    if (!email || typeof email !== "string") return "";
    return email.trim().toLowerCase();
  }
  /**
   * Validates email format.
   */
  static isValidEmail(email) {
    if (!email || typeof email !== "string") return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }
  /**
   * Normalizes international phone number.
   * Ensures standard prefix format without punctuation.
   */
  static normalizePhone(phone, defaultCountryCode = "+234") {
    if (!phone || typeof phone !== "string") return "";
    let cleaned = phone.replace(/[\s\-().]/g, "");
    if (cleaned.startsWith("0") && defaultCountryCode === "+234") {
      cleaned = "+234" + cleaned.substring(1);
    } else if (!cleaned.startsWith("+")) {
      cleaned = defaultCountryCode + cleaned;
    }
    return cleaned;
  }
  /**
   * Validates international phone format.
   */
  static isValidPhone(phone) {
    if (!phone || typeof phone !== "string") return false;
    const cleaned = phone.replace(/[\s\-().]/g, "");
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;
    return phoneRegex.test(cleaned);
  }
  /**
   * Anonymizes IP address for privacy-safe security event recording.
   */
  static anonymizeIp(ip) {
    if (!ip) return "0.0.0.0";
    if (ip.includes(":")) {
      const parts2 = ip.split(":");
      return parts2.slice(0, 3).join(":") + "::xxxx";
    }
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return "xxx.xxx.xxx.xxx";
  }
};

// server/services/leadStore.ts
var INTEREST_MAP = {
  banking: "BANKING",
  digital_banking: "BANKING",
  savings: "SAVINGS",
  smart_savings: "SAVINGS",
  disciplined_savings: "SAVINGS",
  loans: "LOANS",
  personal_loans: "LOANS",
  business_financing: "LOANS",
  sme: "LOANS",
  payments: "PAYMENTS",
  bill_payments: "PAYMENTS",
  bills: "PAYMENTS",
  investments: "INVESTMENTS",
  investments_future: "INVESTMENTS",
  crypto: "CRYPTO",
  crypto_future: "CRYPTO",
  merchants: "MERCHANTS",
  merchant_services: "MERCHANTS",
  agents: "AGENTS",
  agency_banking: "AGENTS",
  other: "OTHER"
};
var SOURCE_MAP = {
  direct: "DIRECT",
  homepage: "HOMEPAGE",
  home: "HOMEPAGE",
  services: "SERVICES",
  banking: "BANKING",
  savings: "SAVINGS",
  loans: "LOANS",
  payments: "PAYMENTS",
  investments: "INVESTMENTS",
  crypto: "CRYPTO",
  contact: "CONTACT",
  campaign: "CAMPAIGN",
  referral: "REFERRAL",
  web_portal_foundation: "HOMEPAGE",
  web_portal_contact_form: "CONTACT"
};
var VALID_LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "UNSUBSCRIBED"
];
var VALID_INTEREST_CATEGORIES = [
  "BANKING",
  "SAVINGS",
  "LOANS",
  "PAYMENTS",
  "INVESTMENTS",
  "CRYPTO",
  "MERCHANTS",
  "AGENTS",
  "OTHER"
];
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function normalizePhoneNumber(phone) {
  if (!phone) return void 0;
  const digitsOnly = phone.replace(/[^\d+]/g, "");
  if (!digitsOnly) return void 0;
  if (digitsOnly.startsWith("0") && digitsOnly.length === 11) {
    return `+234${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.startsWith("234") && digitsOnly.length === 13) {
    return `+${digitsOnly}`;
  }
  return digitsOnly;
}
function normalizeInterest(interestStr) {
  const key = interestStr.toLowerCase().trim();
  return INTEREST_MAP[key] || "OTHER";
}
function normalizeSource(sourceStr) {
  if (!sourceStr) return "DIRECT";
  const key = sourceStr.toLowerCase().trim();
  return SOURCE_MAP[key] || sourceStr.toUpperCase().slice(0, 30);
}
var LeadStoreService = class {
  constructor() {
    this.leads = [];
    this.auditLogs = [];
    /** SHA-256 token hash -> lead id. Raw unsubscribe tokens are not stored. */
    this.unsubscribeTokens = /* @__PURE__ */ new Map();
    this.seedInitialLeads();
  }
  /**
   * Seed structured, realistic pre-launch acquisition prospects across Nigerian demographics
   */
  seedInitialLeads() {
    const seedData = [
      {
        firstName: "Chidinma",
        lastName: "Okonkwo",
        email: "chidinma.okonkwo@example.com",
        phone: "+2348023456789",
        interest: "SAVINGS",
        segment: "salary_earner",
        source: "HOMEPAGE",
        status: "NEW",
        daysAgo: 1,
        utmSource: "linkedin",
        utmCampaign: "pre_launch_waitlist",
        notes: "Interested in disciplined lock savings for rent."
      },
      {
        firstName: "Tunde",
        lastName: "Adeleke",
        email: "tunde.adeleke@example.com",
        phone: "+2348034567890",
        interest: "BANKING",
        segment: "business_owner",
        source: "BANKING",
        status: "QUALIFIED",
        daysAgo: 3,
        utmSource: "google_search",
        utmCampaign: "virtual_accounts_ng",
        notes: "Runs a retail pharmacy chain in Ikeja, requires multiple sub-accounts."
      },
      {
        firstName: "Ibrahim",
        lastName: "Musa",
        email: "ibrahim.musa@example.com",
        phone: "+2348056789012",
        interest: "LOANS",
        segment: "business_owner",
        source: "LOANS",
        status: "CONTACTED",
        daysAgo: 5,
        utmSource: "twitter_x",
        utmCampaign: "sme_financing",
        notes: "Needs inventory credit financing for seasonal supplies."
      },
      {
        firstName: "Ngozi",
        lastName: "Eze",
        email: "ngozi.eze@example.com",
        phone: "+2348078901234",
        interest: "PAYMENTS",
        segment: "individual",
        source: "SERVICES",
        status: "NEW",
        daysAgo: 2,
        utmSource: "referral",
        utmCampaign: "friend_share"
      },
      {
        firstName: "Babatunde",
        lastName: "Fashola",
        email: "babatunde.f@example.com",
        phone: "+2348101234567",
        interest: "INVESTMENTS",
        segment: "salary_earner",
        source: "INVESTMENTS",
        status: "QUALIFIED",
        daysAgo: 6,
        utmSource: "techcabal",
        utmCampaign: "wealth_tech_review",
        notes: "Inquired about capital market access and curated treasury bills."
      },
      {
        firstName: "Emeka",
        lastName: "Nnamdi",
        email: "emeka.nnamdi@example.com",
        phone: "+2348123456780",
        interest: "CRYPTO",
        segment: "student",
        source: "CRYPTO",
        status: "NEW",
        daysAgo: 4,
        utmSource: "telegram",
        utmCampaign: "web3_community"
      },
      {
        firstName: "Amina",
        lastName: "Bello",
        email: "amina.bello@example.com",
        phone: "+2348145678901",
        interest: "BANKING",
        segment: "individual",
        source: "HOMEPAGE",
        status: "CONVERTED",
        daysAgo: 10,
        utmSource: "direct",
        notes: "Participated in pre-launch product discovery interview."
      },
      {
        firstName: "Kelechi",
        lastName: "Nwosu",
        email: "kelechi.nwosu@example.com",
        phone: "+2348167890123",
        interest: "LOANS",
        segment: "salary_earner",
        source: "LOANS",
        status: "NEW",
        daysAgo: 1,
        utmSource: "facebook",
        utmCampaign: "quick_credit"
      }
    ];
    const now = Date.now();
    for (const item of seedData) {
      const createdTime = new Date(now - item.daysAgo * 864e5).toISOString();
      const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      this.leads.push({
        id: leadId,
        firstName: item.firstName,
        lastName: item.lastName,
        email: normalizeEmail(item.email),
        phoneNumber: normalizePhoneNumber(item.phone),
        primaryInterest: item.interest,
        interests: [item.interest],
        customerSegment: item.segment,
        consent: true,
        consentRecordedAt: createdTime,
        source: item.source,
        status: item.status,
        statusNotes: item.notes,
        country: "NG",
        utmSource: item.utmSource,
        utmCampaign: item.utmCampaign,
        landingPage: item.source === "HOMEPAGE" ? "/" : `/services/${item.source.toLowerCase()}`,
        notes: item.notes,
        createdAt: createdTime,
        updatedAt: createdTime,
        ipHash: Buffer.from("127.0.0.1").toString("base64").slice(0, 10)
      });
    }
    this.recordAudit({
      action: "SYSTEM_INITIALIZED_SEEDED_PROSPECTS",
      actor: "SYSTEM_BOOTSTRAP",
      details: { seededCount: this.leads.length },
      level: "INFO"
    });
  }
  /**
   * Process Waitlist Lead (Create New or Safely Update Duplicate)
   */
  createOrUpdateLead(input) {
    const cleanEmail = normalizeEmail(input.email);
    const cleanPhone = normalizePhoneNumber(input.phoneNumber);
    const primaryInterest = normalizeInterest(input.primaryInterest);
    const source = normalizeSource(input.source);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const ipHash = input.ip ? Buffer.from(input.ip).toString("base64").slice(0, 10) : void 0;
    const existingIndex = this.leads.findIndex((lead) => lead.email === cleanEmail);
    if (existingIndex !== -1) {
      const existing = this.leads[existingIndex];
      const updatedInterests = Array.from(/* @__PURE__ */ new Set([...existing.interests, primaryInterest]));
      existing.updatedAt = now;
      existing.interests = updatedInterests;
      if (input.notes && !existing.notes?.includes(input.notes)) {
        existing.notes = existing.notes ? `${existing.notes} | ${input.notes}` : input.notes;
      }
      if (cleanPhone && !existing.phoneNumber) {
        existing.phoneNumber = cleanPhone;
      }
      if (input.utmSource && !existing.utmSource) {
        existing.utmSource = input.utmSource;
        existing.utmMedium = input.utmMedium;
        existing.utmCampaign = input.utmCampaign;
        existing.utmContent = input.utmContent;
      }
      this.recordAudit({
        action: "LEAD_DUPLICATE_SUBMISSION_CONSOLIDATED",
        actor: "PUBLIC_PROSPECT",
        targetId: existing.id,
        ipHash,
        details: {
          email: cleanEmail,
          primaryInterest,
          source
        },
        level: "INFO"
      });
      return { lead: existing, isDuplicate: true };
    }
    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newLead = {
      id: leadId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: cleanEmail,
      phoneNumber: cleanPhone,
      primaryInterest,
      interests: [primaryInterest],
      customerSegment: input.customerSegment || "individual",
      consent: Boolean(input.consent),
      consentRecordedAt: now,
      source,
      status: "NEW",
      country: input.country || "NG",
      referralCode: input.referralCode,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmContent: input.utmContent,
      landingPage: input.landingPage || "/",
      notes: input.notes?.trim(),
      createdAt: now,
      updatedAt: now,
      ipHash
    };
    this.leads.unshift(newLead);
    this.recordAudit({
      action: "LEAD_REGISTERED",
      actor: "PUBLIC_PROSPECT",
      targetId: newLead.id,
      ipHash,
      details: {
        interest: newLead.primaryInterest,
        segment: newLead.customerSegment,
        source: newLead.source
      },
      level: "INFO"
    });
    return { lead: newLead, isDuplicate: false };
  }
  /**
   * Search and Filter Leads for Admin Management Interface
   */
  getLeads(params = {}) {
    let filtered = [...this.leads];
    if (params.q && params.q.trim().length > 0) {
      const q = params.q.trim().toLowerCase();
      filtered = filtered.filter((lead) => {
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const email = lead.email.toLowerCase();
        const phone = (lead.phoneNumber || "").toLowerCase();
        const id = lead.id.toLowerCase();
        const referral = (lead.referralCode || "").toLowerCase();
        const notes = (lead.notes || "").toLowerCase();
        return fullName.includes(q) || email.includes(q) || phone.includes(q) || id.includes(q) || referral.includes(q) || notes.includes(q);
      });
    }
    if (params.status && params.status !== "ALL") {
      filtered = filtered.filter((lead) => lead.status === params.status);
    }
    if (params.interest && params.interest !== "ALL") {
      filtered = filtered.filter(
        (lead) => lead.primaryInterest === params.interest || lead.interests.includes(params.interest)
      );
    }
    if (params.source && params.source !== "ALL") {
      filtered = filtered.filter((lead) => lead.source.toUpperCase() === params.source?.toUpperCase());
    }
    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      filtered = filtered.filter((lead) => new Date(lead.createdAt).getTime() >= start);
    }
    if (params.endDate) {
      const end = new Date(params.endDate).getTime();
      filtered = filtered.filter((lead) => new Date(lead.createdAt).getTime() <= end);
    }
    const sortBy = params.sortBy || "createdAt";
    const sortOrder = params.sortOrder || "desc";
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "createdAt") {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "updatedAt") {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === "name") {
        comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      } else if (sortBy === "status") {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === "desc" ? -comparison : comparison;
    });
    const total = filtered.length;
    const page = Math.max(1, Number(params.page) || 1);
    const pageSize = Math.min(100, Math.max(5, Number(params.pageSize) || 20));
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedLeads = filtered.slice(startIndex, startIndex + pageSize);
    return {
      leads: paginatedLeads,
      total,
      page,
      pageSize,
      totalPages
    };
  }
  /**
   * Get single lead by ID
   */
  getLeadById(id) {
    return this.leads.find((lead) => lead.id === id);
  }
  /**
   * Update lead status
   */
  updateLeadStatus(id, newStatus, note, actor = "ADMINISTRATOR") {
    const lead = this.leads.find((item) => item.id === id);
    if (!lead) return null;
    const previousStatus = lead.status;
    lead.status = newStatus;
    lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (note) {
      lead.statusNotes = note.trim();
    }
    this.recordAudit({
      action: "LEAD_STATUS_UPDATED",
      actor,
      targetId: lead.id,
      details: {
        previousStatus,
        newStatus,
        note: note ? note.slice(0, 100) : void 0
      },
      level: "INFO"
    });
    return lead;
  }
  /**
   * Update lead notes
   */
  updateLeadNotes(id, notes, actor = "ADMINISTRATOR") {
    const lead = this.leads.find((item) => item.id === id);
    if (!lead) return null;
    lead.notes = notes.trim();
    lead.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.recordAudit({
      action: "LEAD_NOTES_UPDATED",
      actor,
      targetId: lead.id,
      details: { noteLength: notes.length },
      level: "INFO"
    });
    return lead;
  }
  /**
   * Compute Real-Time Acquisition & Waitlist Metrics
   */
  getAnalyticsSummary() {
    const totalLeads = this.leads.length;
    let newLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let convertedLeads = 0;
    let unsubscribedLeads = 0;
    const byInterest = {
      BANKING: 0,
      LOANS: 0,
      SAVINGS: 0,
      PAYMENTS: 0,
      INVESTMENTS: 0,
      CRYPTO: 0,
      MERCHANTS: 0,
      AGENTS: 0,
      OTHER: 0
    };
    const bySource = {};
    const bySegment = {};
    for (const lead of this.leads) {
      if (lead.status === "NEW") newLeads++;
      else if (lead.status === "CONTACTED") contactedLeads++;
      else if (lead.status === "QUALIFIED") qualifiedLeads++;
      else if (lead.status === "CONVERTED") convertedLeads++;
      else if (lead.status === "UNSUBSCRIBED") unsubscribedLeads++;
      byInterest[lead.primaryInterest] = (byInterest[lead.primaryInterest] || 0) + 1;
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;
      bySegment[lead.customerSegment] = (bySegment[lead.customerSegment] || 0) + 1;
    }
    const dailyMap = /* @__PURE__ */ new Map();
    const today = /* @__PURE__ */ new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().slice(0, 10);
      dailyMap.set(dateKey, 0);
    }
    for (const lead of this.leads) {
      const dateKey = lead.createdAt.slice(0, 10);
      if (dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
      }
    }
    const recentDailyTrend = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      unsubscribedLeads,
      byInterest,
      bySource,
      bySegment,
      recentDailyTrend,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  /**
   * Controlled CSV Lead Export
   * Includes formula-injection sanitization (=, +, -, @ prefix protection)
   */
  exportLeadsCSV(params = {}) {
    const { leads } = this.getLeads({ ...params, page: 1, pageSize: 5e3 });
    const sanitizeCell = (val) => {
      if (val === null || val === void 0) return '""';
      let str = String(val).replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };
    const headers = [
      "Reference ID",
      "First Name",
      "Last Name",
      "Email Address",
      "Phone Number",
      "Primary Interest",
      "All Interests",
      "Customer Segment",
      "Status",
      "Acquisition Source",
      "UTM Source",
      "UTM Campaign",
      "Consent Accepted",
      "Registration Date",
      "Last Updated"
    ];
    const rows = leads.map((lead) => [
      sanitizeCell(lead.id),
      sanitizeCell(lead.firstName),
      sanitizeCell(lead.lastName),
      sanitizeCell(lead.email),
      sanitizeCell(lead.phoneNumber || "N/A"),
      sanitizeCell(lead.primaryInterest),
      sanitizeCell(lead.interests.join(", ")),
      sanitizeCell(lead.customerSegment),
      sanitizeCell(lead.status),
      sanitizeCell(lead.source),
      sanitizeCell(lead.utmSource || "N/A"),
      sanitizeCell(lead.utmCampaign || "N/A"),
      sanitizeCell(lead.consent ? "YES" : "NO"),
      sanitizeCell(lead.createdAt),
      sanitizeCell(lead.updatedAt)
    ]);
    this.recordAudit({
      action: "LEAD_CSV_EXPORT_GENERATED",
      actor: "ADMINISTRATOR",
      details: { exportCount: leads.length },
      level: "INFO"
    });
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    return csvContent;
  }
  /**
   * Audit Logging
   */
  recordAudit(entry) {
    const log = {
      id: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...entry
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }
  getAuditLogs(limit = 50) {
    return this.auditLogs.slice(0, limit);
  }
  /**
   * Creates a single-use-capable unsubscribe token for waitlist email.
   * Repeat calls replace the previous token for that lead.
   */
  createUnsubscribeToken(leadId) {
    const lead = this.leads.find((item) => item.id === leadId);
    if (!lead) return null;
    for (const [hash, id] of this.unsubscribeTokens) {
      if (id === leadId) this.unsubscribeTokens.delete(hash);
    }
    const token = CryptoService.generateToken("unsub");
    this.unsubscribeTokens.set(CryptoService.hashToken(token), leadId);
    return token;
  }
  /**
   * Marks a lead UNSUBSCRIBED. The same token remains valid so a second click
   * still confirms the preference instead of looking broken.
   */
  unsubscribeByToken(token) {
    if (!token || typeof token !== "string") return { success: false };
    const leadId = this.unsubscribeTokens.get(CryptoService.hashToken(token));
    if (!leadId) return { success: false };
    const lead = this.leads.find((item) => item.id === leadId);
    if (!lead) return { success: false };
    if (lead.status !== "UNSUBSCRIBED") {
      this.updateLeadStatus(
        leadId,
        "UNSUBSCRIBED",
        "Recipient unsubscribed from waitlist email updates.",
        "EMAIL_PREFERENCE"
      );
    }
    return { success: true };
  }
};
var leadStore = new LeadStoreService();

// server/email/config.ts
var EMAIL_ADDRESS = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
function isLocalHostname(hostname) {
  const host = hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".localhost");
}
function isPrivateOrReservedHost(hostname) {
  const host = hostname.toLowerCase();
  if (isLocalHostname(host) || host === "0.0.0.0" || host.endsWith(".local")) return true;
  const match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  if (a === 10 || a === 127 || a === 0 || a >= 224) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}
function resolveConfiguredOrigin() {
  const raw = (process.env.APP_BASE_URL || process.env.APP_URL || "").trim();
  if (!raw) return null;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const hostname = url.hostname.toLowerCase();
  if (!hostname || hostname.includes(" ")) return null;
  if (isLocalHostname(hostname)) {
    return { origin: url.origin, kind: "local" };
  }
  if (url.protocol !== "https:" || isPrivateOrReservedHost(hostname)) return null;
  return { origin: url.origin, kind: "public" };
}
function getAppBaseUrl() {
  return resolveConfiguredOrigin()?.origin || "";
}
function nodeEnvName() {
  return (process.env.NODE_ENV || "").trim();
}
function allowsDevTokenDisclosure() {
  const nodeEnv = nodeEnvName();
  if (nodeEnv !== "development" && nodeEnv !== "test") return false;
  return resolveConfiguredOrigin()?.kind === "local";
}
function isSafeEmailAddress(value) {
  if (!value || value.length > 254) return false;
  if (/[\r\n\0]/.test(value)) return false;
  return EMAIL_ADDRESS.test(value.trim());
}
function isSafeFromAddress(value) {
  const trimmed = value.trim();
  if (!trimmed || /[\r\n\0]/.test(trimmed)) return false;
  const wrapped = trimmed.match(/^([^<>]{1,80})<([^<>]+)>$/);
  if (wrapped) {
    return isSafeEmailAddress(wrapped[2].trim());
  }
  return isSafeEmailAddress(trimmed);
}
function getEmailFrom() {
  return (process.env.EMAIL_FROM || "").trim();
}
function getEmailReplyTo() {
  return (process.env.EMAIL_REPLY_TO || "").trim();
}
function getContactInbox() {
  return (process.env.EMAIL_CONTACT_INBOX || "").trim();
}
function getLeadsInbox() {
  return (process.env.EMAIL_LEADS_INBOX || "").trim();
}
function isPublicHttpsUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.username || url.password) return false;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host.endsWith(".local")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
function getEmailLogoUrl() {
  const explicit = (process.env.EMAIL_LOGO_URL || "").trim();
  if (explicit) {
    return isPublicHttpsUrl(explicit) ? explicit : null;
  }
  const base = getAppBaseUrl();
  if (!base || !isPublicHttpsUrl(base)) return null;
  try {
    const url = new URL("/logo.png", `${base}/`);
    return isPublicHttpsUrl(url.toString()) ? url.toString() : null;
  } catch {
    return null;
  }
}
function safeAppUrl(pathnameAndQuery) {
  if (!pathnameAndQuery.startsWith("/") || pathnameAndQuery.startsWith("//")) return null;
  if (/[\\\0\r\n]/.test(pathnameAndQuery)) return null;
  const configured = resolveConfiguredOrigin();
  if (!configured) return null;
  const nodeEnv = nodeEnvName();
  if (configured.kind === "local" && nodeEnv !== "development" && nodeEnv !== "test") return null;
  if (nodeEnv === "production" && configured.kind !== "public") return null;
  try {
    const url = new URL(pathnameAndQuery, `${configured.origin}/`);
    if (url.origin !== configured.origin) return null;
    if (url.username || url.password) return null;
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
function resolveEmailRuntime() {
  const nodeEnv = nodeEnvName();
  const mode = (process.env.EMAIL_DELIVERY_MODE || "").trim().toLowerCase();
  const hasCredentials = Boolean(process.env.RESEND_API_KEY?.trim() && isSafeFromAddress(getEmailFrom()));
  const origin = resolveConfiguredOrigin();
  if (nodeEnv === "test") {
    return { canSend: false, reason: "test" };
  }
  if (nodeEnv !== "production" && nodeEnv !== "development") {
    return { canSend: false, reason: "dev_hold" };
  }
  if (!hasCredentials) {
    return { canSend: false, reason: "unconfigured" };
  }
  if (nodeEnv === "production" && mode === "log") {
    return { canSend: false, reason: "production_log_mode" };
  }
  if (!origin || nodeEnv === "production" && origin.kind !== "public") {
    return { canSend: false, reason: "invalid_origin" };
  }
  if (nodeEnv !== "production" && mode !== "live") {
    return { canSend: false, reason: "dev_hold" };
  }
  return { canSend: true, reason: "live" };
}

// server/email/html.ts
var EMAIL_COLORS = {
  navy: "#001B40",
  royal: "#0046AD",
  royalHover: "#00388A",
  gold: "#FBBF24",
  canvas: "#F8FAFC",
  white: "#FFFFFF",
  text: "#1E293B",
  muted: "#475569",
  line: "#E2E8F0",
  panel: "#F8FAFC"
};
var BODY_FONT = "'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
var DISPLAY_FONT = "Outfit, 'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeText(value) {
  return String(value ?? "").replace(/\r/g, "").slice(0, 4e3);
}
function paragraphHtml(text) {
  return `<p style="margin:0 0 16px 0;font-family:${BODY_FONT};font-size:16px;line-height:1.6;color:${EMAIL_COLORS.text};">${text}</p>`;
}
function logoBlock(logoUrl) {
  const wordmark = `
    <p style="margin:0;font-family:${DISPLAY_FONT};font-size:18px;line-height:1.2;font-weight:700;letter-spacing:0.04em;color:${EMAIL_COLORS.navy};">
      BEYOND FINANCIALS
    </p>
    <p style="margin:4px 0 0 0;font-family:${BODY_FONT};font-size:12px;line-height:1.4;color:${EMAIL_COLORS.muted};">
      beyondfinancials.ng
    </p>`;
  if (!logoUrl) {
    return wordmark;
  }
  return `
    <img src="${escapeHtml(logoUrl)}" alt="Beyond Financials" width="168" height="46" style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:168px;margin:0 0 10px 0;" />
    ${wordmark}`;
}
function renderEmailDocument(input) {
  const preheader = escapeHtml(input.preheader);
  const heading = escapeHtml(input.heading);
  const body = input.paragraphs.map(paragraphHtml).join("");
  const panel = input.panel ? `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 20px 0;">
        <tr>
          <td style="background:${EMAIL_COLORS.panel};border:1px solid ${EMAIL_COLORS.line};border-left:4px solid ${EMAIL_COLORS.gold};border-radius:8px;padding:16px 18px;">
            <p style="margin:0 0 8px 0;font-family:${DISPLAY_FONT};font-size:13px;line-height:1.4;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${EMAIL_COLORS.navy};">${escapeHtml(input.panel.title)}</p>
            ${input.panel.lines.map(
    (line) => `<p style="margin:0 0 6px 0;font-family:${BODY_FONT};font-size:14px;line-height:1.5;color:${EMAIL_COLORS.text};">${line}</p>`
  ).join("")}
          </td>
        </tr>
      </table>` : "";
  const cta = input.cta ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 12px 0;">
        <tr>
          <td align="center" bgcolor="${EMAIL_COLORS.royal}" style="border-radius:8px;">
            <a href="${escapeHtml(input.cta.href)}" style="display:inline-block;padding:14px 28px;font-family:${BODY_FONT};font-size:16px;line-height:1.2;font-weight:700;color:#ffffff;text-decoration:none;border-radius:8px;">${escapeHtml(input.cta.label)}</a>
          </td>
        </tr>
      </table>` : "";
  const secondary = input.secondaryLink ? `<p style="margin:0 0 8px 0;font-family:${BODY_FONT};font-size:14px;line-height:1.5;"><a href="${escapeHtml(input.secondaryLink.href)}" style="color:${EMAIL_COLORS.royal};font-weight:600;text-decoration:underline;">${escapeHtml(input.secondaryLink.label)}</a></p>` : "";
  const unsubscribe = input.unsubscribeUrl ? `<p style="margin:12px 0 0 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">To stop waitlist updates, <a href="${escapeHtml(input.unsubscribeUrl)}" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">unsubscribe</a>.</p>` : "";
  const footerNote = input.footerNote ? `<p style="margin:0 0 12px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">${escapeHtml(input.footerNote)}</p>` : "";
  const siteLink = input.siteUrl ? ` \xB7 <a href="${escapeHtml(input.siteUrl)}" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">beyondfinancials.ng</a>` : " \xB7 beyondfinancials.ng";
  const footerLinks = (input.footerLinks || []).map(
    (link, index) => `${index > 0 ? " \xB7 " : ""}<a href="${escapeHtml(link.href)}" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">${escapeHtml(link.label)}</a>`
  ).join("");
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${heading}</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&amp;family=Plus+Jakarta+Sans:wght@400;600;700&amp;display=swap" />
</head>
<body style="margin:0;padding:0;background:${EMAIL_COLORS.canvas};">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${preheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${EMAIL_COLORS.canvas};margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="padding:0 0 16px 0;">
              ${logoBlock(input.logoUrl)}
            </td>
          </tr>
          <tr>
            <td style="background:${EMAIL_COLORS.white};border:1px solid ${EMAIL_COLORS.line};border-radius:12px;padding:32px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="padding:0 0 18px 0;border-bottom:3px solid ${EMAIL_COLORS.gold};">
                    <h1 style="margin:0;font-family:${DISPLAY_FONT};font-size:26px;line-height:1.25;font-weight:700;color:${EMAIL_COLORS.navy};">${heading}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:22px 0 0 0;">
                    ${body}
                    ${panel}
                    ${cta}
                    ${secondary}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 8px 0 8px;">
              ${footerNote}
              <p style="margin:0 0 8px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">
                Beyond Financials${siteLink}
              </p>
              <p style="margin:0 0 8px 0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">
                Questions: <a href="mailto:hello@beyondfinancials.ng" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">hello@beyondfinancials.ng</a>
                \xB7 Security: <a href="mailto:security@beyondfinancials.ng" style="color:${EMAIL_COLORS.royal};text-decoration:underline;">security@beyondfinancials.ng</a>
              </p>
              ${footerLinks ? `<p style="margin:0;font-family:${BODY_FONT};font-size:12px;line-height:1.5;color:${EMAIL_COLORS.muted};">${footerLinks}</p>` : ""}
              ${unsubscribe}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  const textLines = [
    "BEYOND FINANCIALS",
    "beyondfinancials.ng",
    "",
    input.heading,
    "",
    ...input.paragraphs.map((paragraph) => paragraph.replace(/<[^>]+>/g, "")),
    ""
  ];
  if (input.panel) {
    textLines.push(input.panel.title);
    textLines.push(...input.panel.lines.map((line) => line.replace(/<[^>]+>/g, "")));
    textLines.push("");
  }
  if (input.cta) {
    textLines.push(`${input.cta.label}: ${input.cta.href}`);
    textLines.push("");
  }
  if (input.secondaryLink) {
    textLines.push(`${input.secondaryLink.label}: ${input.secondaryLink.href}`);
    textLines.push("");
  }
  if (input.footerNote) {
    textLines.push(input.footerNote);
    textLines.push("");
  }
  textLines.push("Questions: hello@beyondfinancials.ng");
  textLines.push("Security: security@beyondfinancials.ng");
  for (const link of input.footerLinks || []) {
    textLines.push(`${link.label}: ${link.href}`);
  }
  if (input.unsubscribeUrl) {
    textLines.push(`Unsubscribe from waitlist updates: ${input.unsubscribeUrl}`);
  }
  return { html, text: textLines.join("\n") };
}

// server/email/templates.ts
var INTEREST_LABELS = {
  BANKING: "Digital banking",
  SAVINGS: "Savings",
  LOANS: "Loans",
  PAYMENTS: "Payments",
  INVESTMENTS: "Investments",
  CRYPTO: "Digital assets",
  MERCHANTS: "Merchant services",
  AGENTS: "Agency services",
  OTHER: "General interest"
};
var CONTACT_CATEGORY_LABELS = {
  general: "General information",
  partnership: "Partnerships",
  banking: "Digital banking",
  savings: "Savings",
  loans: "Loans",
  payments: "Payments",
  investments: "Investments",
  crypto: "Digital assets",
  merchants: "Merchant services",
  agents: "Agency services",
  support: "Waitlist support",
  other: "Other"
};
function interestLabel(code) {
  return INTEREST_LABELS[code] || "General interest";
}
function categoryLabel(code) {
  return CONTACT_CATEGORY_LABELS[code] || "General information";
}
function configuredPage(path) {
  return safeAppUrl(path);
}
function render(input) {
  const footerLinks = [
    ["Privacy", "/privacy"],
    ["Terms", "/terms"],
    ["Contact", "/contact"]
  ].flatMap(([label, path]) => {
    const href = configuredPage(path);
    return href ? [{ label, href }] : [];
  });
  return renderEmailDocument({
    ...input,
    siteUrl: input.siteUrl === void 0 ? configuredPage("/") : input.siteUrl,
    footerLinks: input.footerLinks === void 0 ? footerLinks : input.footerLinks,
    logoUrl: input.logoUrl === void 0 ? getEmailLogoUrl() : input.logoUrl
  });
}
function renderWaitlistConfirmation(input) {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const interests = input.interests.map(interestLabel);
  const interestLine = interests.length > 0 ? interests.join(", ") : "General interest";
  const servicesUrl = configuredPage("/services");
  const homeUrl = configuredPage("/");
  const document = render({
    preheader: "Your Beyond Financials waitlist registration is saved.",
    heading: "You are on the waitlist",
    paragraphs: [
      `Hello ${name},`,
      "Thank you for registering your interest with Beyond Financials. Your waitlist registration has been saved.",
      "We will email this address when there is news about opening. A place on the waitlist does not open an account, approve a loan, or reserve a product. Services described on the website are not available yet."
    ],
    panel: {
      title: "Your registration",
      lines: [
        `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
        `<strong>Interests:</strong> ${escapeHtml(interestLine)}`
      ]
    },
    ...homeUrl ? { cta: { label: "Visit Beyond Financials", href: homeUrl } } : {},
    ...servicesUrl ? { secondaryLink: { label: "Explore planned services", href: servicesUrl } } : {},
    footerNote: "This message confirms a waitlist registration you submitted.",
    unsubscribeUrl: input.unsubscribeUrl || void 0
  });
  return {
    subject: "You are on the Beyond Financials waitlist",
    ...document
  };
}
function renderContactAcknowledgement(input) {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const contactUrl = configuredPage("/contact");
  const document = render({
    preheader: `We received your message. Reference ${input.referenceId}.`,
    heading: "We received your message",
    paragraphs: [
      `Hello ${name},`,
      "Your enquiry has been received and stored. A member of the Beyond Financials team can review it from the details you submitted.",
      "If you need to add something, reply to this email or write to us again and include your reference number."
    ],
    panel: {
      title: "Enquiry reference",
      lines: [
        `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
        `<strong>Topic:</strong> ${escapeHtml(categoryLabel(input.category))}`
      ]
    },
    ...contactUrl ? { cta: { label: "Contact Beyond Financials", href: contactUrl } } : {},
    footerNote: "This message confirms an enquiry you submitted. It is not a marketing email."
  });
  return {
    subject: "We received your Beyond Financials message",
    ...document
  };
}
function renderInternalContactNotification(input) {
  const lines = [
    `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
    `<strong>Name:</strong> ${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}`,
    `<strong>Email:</strong> ${escapeHtml(input.email)}`,
    `<strong>Phone:</strong> ${escapeHtml(input.phoneNumber || "Not provided")}`,
    `<strong>Topic:</strong> ${escapeHtml(categoryLabel(input.category))}`,
    `<strong>Subject:</strong> ${escapeHtml(input.subject || "Not provided")}`
  ];
  const document = render({
    preheader: `New contact enquiry ${input.referenceId}.`,
    heading: "New contact enquiry",
    paragraphs: [
      "A contact form submission was accepted and stored. Review the details below. Do not request BVN, NIN, card numbers, passwords, or recovery phrases."
    ],
    panel: {
      title: "Submission",
      lines: [
        ...lines,
        `<strong>Message:</strong><br />${escapeHtml(input.message).replace(/\n/g, "<br />")}`
      ]
    },
    footerNote: "Internal notification for the configured contact inbox."
  });
  return {
    subject: `New contact enquiry ${input.referenceId}`,
    ...document
  };
}
function renderInternalLeadNotification(input) {
  const document = render({
    preheader: `New waitlist registration ${input.referenceId}.`,
    heading: "New waitlist registration",
    paragraphs: [
      "A new waitlist registration was saved. This notice is not sent again when the same email submits a duplicate."
    ],
    panel: {
      title: "Registration",
      lines: [
        `<strong>Reference:</strong> ${escapeHtml(input.referenceId)}`,
        `<strong>Name:</strong> ${escapeHtml(input.firstName)} ${escapeHtml(input.lastName)}`,
        `<strong>Email:</strong> ${escapeHtml(input.email)}`,
        `<strong>Interest:</strong> ${escapeHtml(interestLabel(input.interest))}`,
        `<strong>Segment:</strong> ${escapeHtml(input.segment)}`
      ]
    },
    footerNote: "Internal notification for the configured leads inbox."
  });
  return {
    subject: `New waitlist registration ${input.referenceId}`,
    ...document
  };
}
function renderEmailVerification(input) {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const document = render({
    preheader: "Confirm the email address on your Beyond Financials account.",
    heading: "Verify your email address",
    paragraphs: [
      `Hello ${name},`,
      "Use the button below to confirm this email address for your Beyond Financials account. The link expires in 24 hours and can be used once.",
      "You can still sign in before verification. Verifying this address does not open a financial account.",
      "If you did not create an account, you can ignore this email."
    ],
    cta: { label: "Verify email address", href: input.verifyUrl },
    secondaryLink: { label: "Or copy this verification link", href: input.verifyUrl },
    footerNote: "This message was sent because an account was registered with this email address."
  });
  return {
    subject: "Verify your Beyond Financials email address",
    ...document
  };
}
function renderPasswordReset(input) {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const document = render({
    preheader: "A password reset was requested for your Beyond Financials account.",
    heading: "Reset your password",
    paragraphs: [
      `Hello ${name},`,
      "A password reset was requested for your Beyond Financials account. The link below expires in 1 hour and can be used once.",
      "If you did not request this, you can ignore this email. Your password will stay the same."
    ],
    cta: { label: "Reset password", href: input.resetUrl },
    secondaryLink: { label: "Or copy this reset link", href: input.resetUrl },
    footerNote: "Beyond Financials will never ask you to send your password by email."
  });
  return {
    subject: "Reset your Beyond Financials password",
    ...document
  };
}
function renderPasswordChanged(input) {
  const name = escapeHtml(escapeText(input.firstName).slice(0, 80));
  const securityUrl = configuredPage("/contact");
  const document = render({
    preheader: "The password on your Beyond Financials account was changed.",
    heading: "Your password was changed",
    paragraphs: [
      `Hello ${name},`,
      "The password for your Beyond Financials account was changed. Other sessions were signed out.",
      "If you made this change, no further action is needed. If you did not, contact security immediately."
    ],
    panel: {
      title: "Security notice",
      lines: [`<strong>When:</strong> ${escapeHtml(input.changedAt)}`]
    },
    ...securityUrl ? { cta: { label: "Contact security support", href: securityUrl } } : {},
    footerNote: "This is a security notice about your account. It does not include your password."
  });
  return {
    subject: "Your Beyond Financials password was changed",
    ...document
  };
}

// server/services/emailService.ts
var import_resend = require("resend");
var completed = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
var deliveryLog = [];
var MAX_LOG = 500;
var testTransport = null;
var TRANSIENT_STATUS = /* @__PURE__ */ new Set([408, 409, 425, 429, 500, 502, 503, 504]);
var RESEND_API_ORIGIN = "https://api.resend.com";
var AUTH_ERROR_NAMES = /* @__PURE__ */ new Set(["missing_api_key", "invalid_api_key"]);
var PERMISSION_ERROR_NAMES = /* @__PURE__ */ new Set(["restricted_api_key", "invalid_access"]);
var RATE_LIMIT_NAMES = /* @__PURE__ */ new Set(["rate_limit_exceeded"]);
var QUOTA_NAMES = /* @__PURE__ */ new Set(["monthly_quota_exceeded", "daily_quota_exceeded"]);
function classifyProviderFailure(statusCode, name, message) {
  const code = (name || "").trim().toLowerCase();
  const text = (message || "").toLowerCase();
  const domainUnverified = /domain/.test(text) && /verif/.test(text);
  if (AUTH_ERROR_NAMES.has(code) || statusCode === 401 || /invalid api key|missing api key|unauthorized/.test(text)) {
    return { reason: "authentication_error", retry: false };
  }
  if (domainUnverified) {
    return { reason: "domain_unverified", retry: false };
  }
  if (code === "invalid_from_address") {
    return { reason: "invalid_sender", retry: false };
  }
  if (PERMISSION_ERROR_NAMES.has(code) || statusCode === 403) {
    return { reason: "permission_error", retry: false };
  }
  if (QUOTA_NAMES.has(code)) {
    return { reason: "rate_limited", retry: false };
  }
  if (RATE_LIMIT_NAMES.has(code) || statusCode === 429) {
    return { reason: "rate_limited", retry: true };
  }
  if (statusCode === 0 || TRANSIENT_STATUS.has(statusCode) || code === "internal_server_error" || code === "application_error") {
    return { reason: statusCode === 0 ? "network_error" : "provider_error", retry: true };
  }
  return { reason: "provider_error", retry: false };
}
function maskEmail(email) {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.indexOf("@");
  if (at <= 0) return "[redacted]";
  return `${trimmed.slice(0, 1)}***@${trimmed.slice(at + 1)}`;
}
function scrubSensitiveText(value) {
  return value.replace(/re_[A-Za-z0-9_]+/g, "[redacted]").replace(/\b(reset|verify|unsub)_[a-f0-9]{8,}\b/gi, "[redacted-token]").replace(/([?&]token=)[^&\s]+/gi, "$1[redacted]").slice(0, 300);
}
function activeTransport() {
  if (process.env.NODE_ENV === "production") return null;
  return testTransport;
}
function logDelivery(entry) {
  deliveryLog.unshift(entry);
  if (deliveryLog.length > MAX_LOG) deliveryLog.pop();
  const provider = entry.providerMessageId ? ` provider=${entry.providerMessageId}` : "";
  const correlation = entry.correlationId ? ` correlation=${entry.correlationId}` : "";
  const reason = entry.reason ? ` reason=${entry.reason}` : "";
  console.info(
    `[EMAIL] ${entry.status} template=${entry.template} to=${entry.recipient} attempts=${entry.attempts}${reason}${provider}${correlation}`
  );
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function resendTransport(apiKey, payload) {
  const resend = new import_resend.Resend(apiKey);
  if (resend.baseUrl !== RESEND_API_ORIGIN) {
    return {
      ok: false,
      statusCode: 0,
      name: "application_error",
      message: "Unexpected email provider endpoint."
    };
  }
  const replyTo = payload.replyTo && isSafeEmailAddress(payload.replyTo) ? payload.replyTo : void 0;
  const result = await resend.emails.send(
    {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo
    },
    { idempotencyKey: payload.idempotencyKey }
  );
  if (result.error) {
    const error = result.error;
    return {
      ok: false,
      statusCode: error.statusCode ?? void 0,
      name: error.name,
      message: error.message || "Email provider rejected the request."
    };
  }
  return { ok: true, id: result.data?.id };
}
async function deliver(input) {
  const base = { template: input.template };
  if (!isSafeEmailAddress(input.to)) {
    return { ...base, status: "failed", reason: "invalid_recipient", attempts: 0 };
  }
  const injected = activeTransport();
  const runtime = resolveEmailRuntime();
  if (!injected && !runtime.canSend) {
    const reason = runtime.reason === "live" ? "unconfigured" : runtime.reason;
    return { ...base, status: "unavailable", reason, attempts: 0 };
  }
  const from = getEmailFrom();
  if (!injected && !isSafeFromAddress(from)) {
    return { ...base, status: "unavailable", reason: "invalid_sender", attempts: 0 };
  }
  const payload = {
    from: from || "Beyond Financials <notifications@example.com>",
    to: input.to.trim(),
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: getEmailReplyTo() || void 0,
    idempotencyKey: input.idempotencyKey
  };
  const transport = injected ? injected : {
    send: (message) => resendTransport(process.env.RESEND_API_KEY.trim(), message)
  };
  const maxAttempts = 2;
  let attempts = 0;
  let lastStatus = 0;
  let lastMessage = "";
  while (attempts < maxAttempts) {
    attempts += 1;
    try {
      const result = await transport.send(payload);
      if (result.ok) {
        return {
          ...base,
          status: "accepted",
          providerMessageId: result.id,
          attempts
        };
      }
      lastStatus = result.statusCode || 0;
      lastMessage = result.message || "provider_error";
      const classified = classifyProviderFailure(lastStatus, result.name, lastMessage);
      console.error(
        `[EMAIL] provider failure template=${input.template} status=${lastStatus || "network"} reason=${classified.reason} detail=${scrubSensitiveText(lastMessage)}`
      );
      if (!classified.retry || attempts >= maxAttempts) {
        return {
          ...base,
          status: "failed",
          reason: classified.reason,
          attempts
        };
      }
    } catch (error) {
      lastStatus = 0;
      lastMessage = error instanceof Error ? error.message : "network_error";
      const classified = classifyProviderFailure(0, void 0, lastMessage);
      console.error(
        `[EMAIL] provider failure template=${input.template} status=network reason=${classified.reason} detail=${scrubSensitiveText(lastMessage)}`
      );
      if (!classified.retry || attempts >= maxAttempts) {
        return {
          ...base,
          status: "failed",
          reason: classified.reason,
          attempts
        };
      }
    }
    const waitMs = process.env.NODE_ENV === "test" ? 20 : 400 * attempts;
    await delay(waitMs);
  }
  return {
    ...base,
    status: "failed",
    reason: lastStatus === 0 ? "network_error" : "provider_error",
    attempts
  };
}
async function sendEmail(input) {
  const existing = completed.get(input.idempotencyKey);
  if (existing) {
    const duplicate = existing.status === "accepted" ? { ...existing, status: "skipped", reason: "duplicate" } : existing;
    logDelivery({
      at: (/* @__PURE__ */ new Date()).toISOString(),
      template: input.template,
      status: duplicate.status,
      reason: duplicate.reason,
      recipient: maskEmail(input.to),
      attempts: 0,
      correlationId: input.correlationId
    });
    return duplicate;
  }
  const pending = inflight.get(input.idempotencyKey);
  if (pending) return pending;
  const promise = deliver(input).then((result) => {
    completed.set(input.idempotencyKey, result);
    logDelivery({
      at: (/* @__PURE__ */ new Date()).toISOString(),
      template: input.template,
      status: result.status,
      reason: result.reason,
      recipient: maskEmail(input.to),
      providerMessageId: result.providerMessageId,
      attempts: result.attempts,
      correlationId: input.correlationId
    });
    return result;
  }).finally(() => {
    inflight.delete(input.idempotencyKey);
  });
  inflight.set(input.idempotencyKey, promise);
  return promise;
}

// server/services/notificationService.ts
function publicStatus(result) {
  return result.status;
}
async function safeSend(input) {
  try {
    return await sendEmail(input);
  } catch (error) {
    const message = error instanceof Error ? error.message : "notification_error";
    console.error(`[EMAIL] notification failed template=${input.template} detail=${scrubSensitiveText(message)}`);
    return {
      status: "failed",
      reason: "network_error",
      attempts: 0,
      template: input.template
    };
  }
}
async function notifyWaitlistCreated(input) {
  if (!isSafeEmailAddress(input.email)) return "failed";
  const unsubscribeToken = leadStore.createUnsubscribeToken(input.leadId);
  const unsubscribeUrl = unsubscribeToken ? safeAppUrl(`/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`) : null;
  const message = renderWaitlistConfirmation({
    firstName: input.firstName,
    interests: input.interests,
    referenceId: input.leadId,
    unsubscribeUrl
  });
  const confirmation = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `waitlist-confirmation:${input.leadId}`,
    template: "waitlist-confirmation",
    correlationId: input.correlationId
  });
  const inbox = getLeadsInbox();
  if (isSafeEmailAddress(inbox)) {
    const internal = renderInternalLeadNotification({
      referenceId: input.leadId,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      interest: input.interest,
      segment: input.segment
    });
    await safeSend({
      to: inbox,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      idempotencyKey: `lead-internal:${input.leadId}`,
      template: "lead-internal",
      correlationId: input.correlationId
    });
  }
  return publicStatus(confirmation);
}
async function notifyContactAccepted(input) {
  if (!isSafeEmailAddress(input.email)) return "failed";
  const acknowledgement = renderContactAcknowledgement({
    firstName: input.firstName,
    referenceId: input.referenceId,
    category: input.category
  });
  const confirmation = await safeSend({
    to: input.email,
    subject: acknowledgement.subject,
    html: acknowledgement.html,
    text: acknowledgement.text,
    idempotencyKey: `contact-ack:${input.referenceId}`,
    template: "contact-acknowledgement",
    correlationId: input.correlationId
  });
  const inbox = getContactInbox();
  if (isSafeEmailAddress(inbox)) {
    const internal = renderInternalContactNotification(input);
    await safeSend({
      to: inbox,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      idempotencyKey: `contact-internal:${input.referenceId}`,
      template: "contact-internal",
      correlationId: input.correlationId
    });
  }
  return publicStatus(confirmation);
}
async function notifyEmailVerification(input) {
  const verifyUrl = safeAppUrl(`/verify-email?token=${encodeURIComponent(input.token)}`);
  if (!verifyUrl || !isSafeEmailAddress(input.email)) return "failed";
  const message = renderEmailVerification({ firstName: input.firstName, verifyUrl });
  const result = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `email-verify:${input.userId}:${CryptoService.hashToken(input.token).slice(0, 16)}`,
    template: "email-verification",
    correlationId: input.correlationId
  });
  return publicStatus(result);
}
async function notifyPasswordReset(input) {
  const resetUrl = safeAppUrl(`/reset-password?token=${encodeURIComponent(input.token)}`);
  if (!resetUrl || !isSafeEmailAddress(input.email)) return "failed";
  const message = renderPasswordReset({ firstName: input.firstName, resetUrl });
  const result = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `password-reset:${input.userId}:${CryptoService.hashToken(input.token).slice(0, 16)}`,
    template: "password-reset",
    correlationId: input.correlationId
  });
  return publicStatus(result);
}
async function notifyPasswordChanged(input) {
  if (!isSafeEmailAddress(input.email)) return "failed";
  const message = renderPasswordChanged({ firstName: input.firstName, changedAt: input.changedAt });
  const result = await safeSend({
    to: input.email,
    subject: message.subject,
    html: message.html,
    text: message.text,
    idempotencyKey: `password-changed:${input.userId}:${input.changedAt}`,
    template: "password-changed",
    correlationId: input.correlationId
  });
  return publicStatus(result);
}

// server/routes/waitlist.ts
var waitlistRouter = (0, import_express2.Router)();
var waitlistRateMap = /* @__PURE__ */ new Map();
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var PHONE_CLEAN_REGEX = /^(?:\+234|0)[789][01]\d{8}$/;
var SENSITIVE_KEYWORDS = [
  /\bbvn\b[\s\S]{0,15}\d{11}/i,
  /\bnin\b[\s\S]{0,15}\d{11}/i,
  /\b(?:\d[ -]*?){13,19}\b/,
  // Potential card PAN
  /\bpassword\b/i,
  /\bcvv\b[\s\S]{0,10}\d{3,4}/i,
  /\b(?:card|atm|secret)\s+pin\b/i,
  /\bseed\s*phrase\b/i,
  /\bprivate\s*key\b/i
];
function checkWaitlistRateLimit(key) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1e3;
  const maxAttempts = process.env.NODE_ENV === "test" ? 1e4 : 6;
  const timestamps = waitlistRateMap.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  if (validTimestamps.length >= maxAttempts) {
    return false;
  }
  validTimestamps.push(now);
  waitlistRateMap.set(key, validTimestamps);
  return true;
}
waitlistRouter.post("/", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      primaryInterest,
      customerSegment = "individual",
      notes,
      consentAccepted,
      consent,
      source = "HOMEPAGE",
      country = "NG",
      referralCode,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      landingPage
    } = req.body;
    const validationErrors = {};
    const ipKey = req.ip || "anonymous";
    const emailKey = typeof email === "string" ? email.trim().toLowerCase() : ipKey;
    if (!checkWaitlistRateLimit(ipKey) || !checkWaitlistRateLimit(emailKey)) {
      throw new AppError(
        "Too many waitlist submissions received recently. Please wait a few minutes before trying again.",
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }
    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
      validationErrors.firstName = ["First name is required (minimum 2 characters)."];
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
      validationErrors.lastName = ["Last name is required (minimum 2 characters)."];
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      validationErrors.email = ["A valid email address is required."];
    }
    if (phoneNumber && typeof phoneNumber === "string" && phoneNumber.trim().length > 0) {
      const sanitizedPhone = phoneNumber.replace(/[\s-]/g, "");
      if (!PHONE_CLEAN_REGEX.test(sanitizedPhone) && sanitizedPhone.length < 10) {
        validationErrors.phoneNumber = ["Please provide a valid Nigerian phone number (e.g. 08012345678 or +2348012345678)."];
      }
    }
    if (!primaryInterest || typeof primaryInterest !== "string" || primaryInterest.trim().length === 0) {
      validationErrors.primaryInterest = ["Please select a valid area of interest."];
    }
    const combinedText = `${notes || ""} ${referralCode || ""}`;
    for (const pattern of SENSITIVE_KEYWORDS) {
      if (pattern.test(combinedText)) {
        validationErrors.notes = [
          "Security Notice: For your safety, do NOT include BVN, NIN, card details, PINs, passwords, or recovery phrases in waitlist forms."
        ];
        break;
      }
    }
    const isConsentGiven = Boolean(consentAccepted !== void 0 ? consentAccepted : consent);
    if (!isConsentGiven) {
      validationErrors.consentAccepted = ["You must agree to receive early access updates and communications."];
    }
    if (Object.keys(validationErrors).length > 0) {
      throw new AppError("Waitlist registration failed validation.", 422, "VALIDATION_FAILED", validationErrors);
    }
    const { lead, isDuplicate } = leadStore.createOrUpdateLead({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : void 0,
      primaryInterest,
      customerSegment,
      notes: notes ? String(notes).trim().slice(0, 300) : void 0,
      consent: isConsentGiven,
      source: String(source),
      country,
      referralCode: referralCode ? String(referralCode).trim().slice(0, 50) : void 0,
      utmSource: utmSource ? String(utmSource).trim().slice(0, 50) : void 0,
      utmMedium: utmMedium ? String(utmMedium).trim().slice(0, 50) : void 0,
      utmCampaign: utmCampaign ? String(utmCampaign).trim().slice(0, 50) : void 0,
      utmContent: utmContent ? String(utmContent).trim().slice(0, 50) : void 0,
      landingPage: landingPage ? String(landingPage).trim().slice(0, 100) : void 0,
      ip: req.ip
    });
    if (isDuplicate) {
      return res.status(200).json({
        success: true,
        message: "You may already be on the list. If so, we'll keep your existing registration and updated preferences.",
        data: {
          referenceId: lead.id,
          email: lead.email,
          alreadyRegistered: true,
          emailConfirmation: "skipped"
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
    const emailConfirmation = await notifyWaitlistCreated({
      leadId: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      interest: lead.primaryInterest,
      interests: lead.interests,
      segment: lead.customerSegment,
      correlationId
    });
    return res.status(201).json({
      success: true,
      message: "Thank you for joining the Beyond Financials early access waitlist. We look forward to welcoming you.",
      data: {
        referenceId: lead.id,
        firstName: lead.firstName,
        email: lead.email,
        primaryInterest: lead.primaryInterest,
        submittedAt: lead.createdAt,
        alreadyRegistered: false,
        emailConfirmation
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
waitlistRouter.post("/unsubscribe", (req, res, next) => {
  try {
    const ipKey = req.ip || "anonymous";
    if (!checkWaitlistRateLimit(`unsubscribe:${ipKey}`)) {
      throw new AppError(
        "Too many unsubscribe requests. Please wait a few minutes and try again.",
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }
    const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
    const result = leadStore.unsubscribeByToken(token);
    if (!result.success) {
      throw new AppError("This unsubscribe link is invalid or has expired.", 400, "INVALID_UNSUBSCRIBE_TOKEN");
    }
    return res.json({
      success: true,
      message: "You are unsubscribed from Beyond Financials waitlist updates.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
waitlistRouter.get("/stats", (_req, res) => {
  const stats = leadStore.getAnalyticsSummary();
  res.json({
    success: true,
    message: "Waitlist acquisition summary statistics.",
    data: stats,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});

// server/routes/contact.ts
var import_express3 = require("express");
var contactRouter = (0, import_express3.Router)();
var contactStore = [];
var auditLogs = [];
var submissionRateMap = /* @__PURE__ */ new Map();
var EMAIL_REGEX2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var NIGERIAN_PHONE_REGEX = /^(?:\+234|0)[789][01]\d{8}$/;
var SENSITIVE_KEYWORDS2 = [
  /\bbvn\b[\s\S]{0,15}\d{11}/i,
  /\bnin\b[\s\S]{0,15}\d{11}/i,
  /\b(?:\d[ -]*?){13,19}\b/,
  // Potential card PAN
  /\bpassword\b/i,
  /\bcvv\b[\s\S]{0,10}\d{3,4}/i,
  /\b(?:card|atm|secret)\s+pin\b/i,
  /\bseed\s*phrase\b/i,
  /\bprivate\s*key\b/i
];
var VALID_CATEGORIES = [
  "general",
  "partnership",
  "banking",
  "savings",
  "loans",
  "payments",
  "investments",
  "crypto",
  "merchants",
  "agents",
  "support",
  "other"
];
function checkRateLimit(key) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1e3;
  const maxAttempts = process.env.NODE_ENV === "test" ? 1e4 : 5;
  const timestamps = submissionRateMap.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);
  if (validTimestamps.length >= maxAttempts) {
    return false;
  }
  validTimestamps.push(now);
  submissionRateMap.set(key, validTimestamps);
  return true;
}
contactRouter.post("/", async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      category = "general",
      subject,
      message,
      consentAccepted
    } = req.body;
    const validationErrors = {};
    const ipKey = req.ip || "anonymous";
    const emailKey = typeof email === "string" ? email.trim().toLowerCase() : ipKey;
    if (!checkRateLimit(ipKey) || !checkRateLimit(emailKey)) {
      throw new AppError(
        "Too many contact requests submitted recently. Please wait a few minutes before submitting another enquiry.",
        429,
        "RATE_LIMIT_EXCEEDED"
      );
    }
    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
      validationErrors.firstName = ["First name is required (minimum 2 characters)."];
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
      validationErrors.lastName = ["Last name is required (minimum 2 characters)."];
    }
    if (!email || typeof email !== "string" || !EMAIL_REGEX2.test(email.trim().toLowerCase())) {
      validationErrors.email = ["A valid email address is required."];
    }
    if (phoneNumber && typeof phoneNumber === "string" && phoneNumber.trim().length > 0) {
      const sanitizedPhone = phoneNumber.replace(/[\s-]/g, "");
      if (!NIGERIAN_PHONE_REGEX.test(sanitizedPhone) && sanitizedPhone.length < 10) {
        validationErrors.phoneNumber = ["Please provide a valid phone number (e.g. 08012345678 or +2348012345678)."];
      }
    }
    if (!category || !VALID_CATEGORIES.includes(category)) {
      validationErrors.category = ["Please select a valid enquiry category."];
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      validationErrors.message = ["Please provide a descriptive message of at least 10 characters."];
    } else if (message.trim().length > 2e3) {
      validationErrors.message = ["Message exceeds the maximum allowable length of 2,000 characters."];
    }
    const combinedText = `${subject || ""} ${message || ""}`;
    for (const pattern of SENSITIVE_KEYWORDS2) {
      if (pattern.test(combinedText)) {
        validationErrors.message = [
          "Security Notice: For your safety, do NOT include BVN, NIN, card details, PINs, passwords, or recovery phrases in contact enquiries. Beyond Financials representatives will never ask for your confidential financial secrets."
        ];
        break;
      }
    }
    if (!consentAccepted) {
      validationErrors.consentAccepted = ["You must agree to our communication terms and privacy practices."];
    }
    if (Object.keys(validationErrors).length > 0) {
      throw new AppError("Contact submission failed validation.", 422, "VALIDATION_FAILED", validationErrors);
    }
    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanMessage = message.trim();
    const cleanSubject = subject && typeof subject === "string" ? subject.trim().slice(0, 150) : void 0;
    const referenceId = `BF-CNT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newContactEntry = {
      id: referenceId,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      phoneNumber: phoneNumber ? phoneNumber.trim() : void 0,
      category,
      subject: cleanSubject,
      message: cleanMessage,
      consentAccepted: Boolean(consentAccepted),
      status: "PENDING_REVIEW",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ipHash: req.ip ? Buffer.from(req.ip).toString("base64").slice(0, 10) : void 0,
      source: "web_portal_contact_form"
    };
    contactStore.push(newContactEntry);
    auditLogs.push({
      id: `AUD-CNT-${Date.now()}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      action: "CONTACT_ENQUIRY_RECORDED",
      actor: "PUBLIC_PROSPECT",
      ipHash: newContactEntry.ipHash,
      details: {
        enquiryId: newContactEntry.id,
        category: newContactEntry.category
      },
      level: "INFO"
    });
    const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
    const emailConfirmation = await notifyContactAccepted({
      referenceId: newContactEntry.id,
      firstName: newContactEntry.firstName,
      lastName: newContactEntry.lastName,
      email: newContactEntry.email,
      phoneNumber: newContactEntry.phoneNumber,
      category: newContactEntry.category,
      subject: newContactEntry.subject,
      message: newContactEntry.message,
      correlationId
    });
    return res.status(201).json({
      success: true,
      message: "Thank you for reaching out to Beyond Financials. Your enquiry has been received and routed to our team.",
      data: {
        referenceId: newContactEntry.id,
        firstName: newContactEntry.firstName,
        category: newContactEntry.category,
        submittedAt: newContactEntry.submittedAt,
        expectedResponseTime: "1 to 2 business days",
        emailConfirmation
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
contactRouter.get("/categories", (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: "general", label: "General Information & Questions" },
      { id: "partnership", label: "Institutional & Ecosystem Partnerships" },
      { id: "banking", label: "Digital Banking & Virtual Accounts" },
      { id: "savings", label: "Disciplined & Goal Savings" },
      { id: "loans", label: "Structured Loans & Credit Facilities" },
      { id: "payments", label: "Utility & Everyday Bill Payments" },
      { id: "investments", label: "Investments & Capital Markets (Future Scope)" },
      { id: "crypto", label: "Digital Assets & Web3 (Future Scope)" },
      { id: "merchants", label: "Merchant & POS Settlement Solutions" },
      { id: "agents", label: "Agency Banking & Float Management" },
      { id: "support", label: "Waitlist & Early Access Support" },
      { id: "other", label: "Other Enquiries" }
    ],
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});

// server/routes/adminLeads.ts
var import_express4 = require("express");

// server/middleware/adminAuth.ts
var import_crypto2 = __toESM(require("crypto"), 1);
function getAdminApiKey() {
  const value = process.env.ADMIN_API_KEY?.trim();
  return value ? value : null;
}
function keysMatch(provided, expected) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) {
    import_crypto2.default.timingSafeEqual(expectedBuffer, expectedBuffer);
    return false;
  }
  return import_crypto2.default.timingSafeEqual(providedBuffer, expectedBuffer);
}
function readProvidedAdminKey(req) {
  const customHeader = req.headers["x-admin-key"];
  if (typeof customHeader === "string" && customHeader.trim()) {
    return customHeader.trim();
  }
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== "string") return "";
  if (authHeader.startsWith("Bearer ")) return authHeader.slice(7).trim();
  return authHeader.trim();
}
function adminAccessState(provided) {
  const expected = getAdminApiKey();
  if (!expected) return "unconfigured";
  if (!provided || !keysMatch(provided, expected)) return "rejected";
  return "ok";
}
function adminAuthMiddleware(req, _res, next) {
  try {
    const state = adminAccessState(readProvidedAdminKey(req));
    if (state === "unconfigured") {
      throw new AppError(
        "Administrator access is not configured.",
        503,
        "ADMIN_UNCONFIGURED"
      );
    }
    if (state !== "ok") {
      throw new AppError(
        "Unauthorized: Invalid or missing administrator credentials for Beyond Financials lead management.",
        401,
        "ADMIN_UNAUTHORIZED"
      );
    }
    next();
  } catch (error) {
    next(error);
  }
}

// server/routes/adminLeads.ts
var adminRouter = (0, import_express4.Router)();
adminRouter.post("/auth/verify", (req, res) => {
  const { adminKey } = req.body;
  const headerKey = req.headers["x-admin-key"];
  const token = typeof adminKey === "string" ? adminKey.trim() : typeof headerKey === "string" ? headerKey.trim() : "";
  const state = adminAccessState(token);
  if (state === "unconfigured") {
    return res.status(503).json({
      success: false,
      message: "Administrator access is not configured.",
      data: { authenticated: false },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  if (state !== "ok") {
    return res.status(401).json({
      success: false,
      message: "Invalid administrator access key for Beyond Financials lead management.",
      data: { authenticated: false },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  return res.json({
    success: true,
    message: "Administrator session authenticated.",
    data: {
      authenticated: true,
      role: "ACQUISITION_ADMIN",
      environment: process.env.NODE_ENV || "development"
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
adminRouter.use(adminAuthMiddleware);
adminRouter.get("/leads", (req, res, next) => {
  try {
    const {
      q,
      status,
      interest,
      source,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      page = 1,
      pageSize = 20
    } = req.query;
    const filterStatus = status && VALID_LEAD_STATUSES.includes(status) ? status : status === "ALL" ? "ALL" : void 0;
    const filterInterest = interest && VALID_INTEREST_CATEGORIES.includes(interest) ? interest : interest === "ALL" ? "ALL" : void 0;
    const result = leadStore.getLeads({
      q: typeof q === "string" ? q : void 0,
      status: filterStatus,
      interest: filterInterest,
      source: typeof source === "string" ? source : void 0,
      startDate: typeof startDate === "string" ? startDate : void 0,
      endDate: typeof endDate === "string" ? endDate : void 0,
      sortBy: typeof sortBy === "string" && ["createdAt", "updatedAt", "name", "status"].includes(sortBy) ? sortBy : "createdAt",
      sortOrder: sortOrder === "asc" ? "asc" : "desc",
      page: Number(page),
      pageSize: Number(pageSize)
    });
    res.json({
      success: true,
      message: "Leads retrieved successfully.",
      data: result,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
adminRouter.get("/leads/stats", (_req, res, next) => {
  try {
    const summary = leadStore.getAnalyticsSummary();
    res.json({
      success: true,
      message: "Acquisition analytics summary.",
      data: summary,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
adminRouter.get("/leads/export", (req, res, next) => {
  try {
    const { q, status, interest, source, startDate, endDate } = req.query;
    const csvData = leadStore.exportLeadsCSV({
      q: typeof q === "string" ? q : void 0,
      status,
      interest,
      source,
      startDate: typeof startDate === "string" ? startDate : void 0,
      endDate: typeof endDate === "string" ? endDate : void 0
    });
    const filename = `beyond-financials-leads-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (error) {
    next(error);
  }
});
adminRouter.get("/leads/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = leadStore.getLeadById(id);
    if (!lead) {
      throw new AppError(`Waitlist lead with reference ID '${id}' not found.`, 404, "LEAD_NOT_FOUND");
    }
    res.json({
      success: true,
      message: "Lead detail retrieved.",
      data: lead,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
adminRouter.patch("/leads/:id/status", (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    if (!status || !VALID_LEAD_STATUSES.includes(status)) {
      throw new AppError(
        `Invalid status. Must be one of: ${VALID_LEAD_STATUSES.join(", ")}`,
        422,
        "INVALID_STATUS"
      );
    }
    const updatedLead = leadStore.updateLeadStatus(
      id,
      status,
      typeof note === "string" ? note : void 0,
      "ADMINISTRATOR"
    );
    if (!updatedLead) {
      throw new AppError(`Waitlist lead with reference ID '${id}' not found.`, 404, "LEAD_NOT_FOUND");
    }
    res.json({
      success: true,
      message: `Lead status updated to ${status}.`,
      data: updatedLead,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
adminRouter.patch("/leads/:id/notes", (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    if (typeof notes !== "string") {
      throw new AppError("Notes content must be a string.", 422, "INVALID_NOTES");
    }
    const updatedLead = leadStore.updateLeadNotes(id, notes, "ADMINISTRATOR");
    if (!updatedLead) {
      throw new AppError(`Waitlist lead with reference ID '${id}' not found.`, 404, "LEAD_NOT_FOUND");
    }
    res.json({
      success: true,
      message: "Lead notes updated.",
      data: updatedLead,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
adminRouter.get("/audit-logs", (_req, res, next) => {
  try {
    const logs = leadStore.getAuditLogs(50);
    res.json({
      success: true,
      message: "Administrative audit logs retrieved.",
      data: logs,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// server/routes/auth.ts
var import_express5 = require("express");

// server/types/auth.ts
var Permission = /* @__PURE__ */ ((Permission3) => {
  Permission3["USER_READ_OWN"] = "USER_READ_OWN";
  Permission3["USER_UPDATE_OWN"] = "USER_UPDATE_OWN";
  Permission3["USER_READ_ALL"] = "USER_READ_ALL";
  Permission3["USER_UPDATE_ALL"] = "USER_UPDATE_ALL";
  Permission3["USER_SUSPEND"] = "USER_SUSPEND";
  Permission3["USER_DELETE"] = "USER_DELETE";
  Permission3["KYC_SUBMIT"] = "KYC_SUBMIT";
  Permission3["KYC_READ_OWN"] = "KYC_READ_OWN";
  Permission3["KYC_READ_ALL"] = "KYC_READ_ALL";
  Permission3["KYC_REVIEW"] = "KYC_REVIEW";
  Permission3["TRANSACTION_READ_OWN"] = "TRANSACTION_READ_OWN";
  Permission3["TRANSACTION_INITIATE"] = "TRANSACTION_INITIATE";
  Permission3["TRANSACTION_READ_ALL"] = "TRANSACTION_READ_ALL";
  Permission3["TRANSACTION_REVIEW"] = "TRANSACTION_REVIEW";
  Permission3["LOAN_APPLY"] = "LOAN_APPLY";
  Permission3["LOAN_READ_OWN"] = "LOAN_READ_OWN";
  Permission3["LOAN_READ_ALL"] = "LOAN_READ_ALL";
  Permission3["LOAN_REVIEW"] = "LOAN_REVIEW";
  Permission3["REPORT_VIEW"] = "REPORT_VIEW";
  Permission3["REPORT_EXPORT"] = "REPORT_EXPORT";
  Permission3["SECURITY_AUDIT_VIEW"] = "SECURITY_AUDIT_VIEW";
  Permission3["SYSTEM_CONFIG_MANAGE"] = "SYSTEM_CONFIG_MANAGE";
  Permission3["ADMIN_MANAGE"] = "ADMIN_MANAGE";
  return Permission3;
})(Permission || {});

// server/services/rbacService.ts
var ROLE_PERMISSIONS = {
  ["CUSTOMER" /* CUSTOMER */]: [
    "USER_READ_OWN" /* USER_READ_OWN */,
    "USER_UPDATE_OWN" /* USER_UPDATE_OWN */,
    "KYC_SUBMIT" /* KYC_SUBMIT */,
    "KYC_READ_OWN" /* KYC_READ_OWN */,
    "TRANSACTION_READ_OWN" /* TRANSACTION_READ_OWN */,
    "TRANSACTION_INITIATE" /* TRANSACTION_INITIATE */,
    "LOAN_APPLY" /* LOAN_APPLY */,
    "LOAN_READ_OWN" /* LOAN_READ_OWN */
  ],
  ["MERCHANT" /* MERCHANT */]: [
    "USER_READ_OWN" /* USER_READ_OWN */,
    "USER_UPDATE_OWN" /* USER_UPDATE_OWN */,
    "KYC_SUBMIT" /* KYC_SUBMIT */,
    "KYC_READ_OWN" /* KYC_READ_OWN */,
    "TRANSACTION_READ_OWN" /* TRANSACTION_READ_OWN */,
    "TRANSACTION_INITIATE" /* TRANSACTION_INITIATE */,
    "REPORT_VIEW" /* REPORT_VIEW */
  ],
  ["AGENT" /* AGENT */]: [
    "USER_READ_OWN" /* USER_READ_OWN */,
    "USER_UPDATE_OWN" /* USER_UPDATE_OWN */,
    "KYC_SUBMIT" /* KYC_SUBMIT */,
    "KYC_READ_OWN" /* KYC_READ_OWN */,
    "TRANSACTION_READ_OWN" /* TRANSACTION_READ_OWN */,
    "TRANSACTION_INITIATE" /* TRANSACTION_INITIATE */,
    "REPORT_VIEW" /* REPORT_VIEW */
  ],
  ["SUPPORT" /* SUPPORT */]: [
    "USER_READ_OWN" /* USER_READ_OWN */,
    "USER_READ_ALL" /* USER_READ_ALL */,
    "KYC_READ_ALL" /* KYC_READ_ALL */,
    "TRANSACTION_READ_ALL" /* TRANSACTION_READ_ALL */,
    "LOAN_READ_ALL" /* LOAN_READ_ALL */
  ],
  ["COMPLIANCE" /* COMPLIANCE */]: [
    "USER_READ_ALL" /* USER_READ_ALL */,
    "USER_SUSPEND" /* USER_SUSPEND */,
    "KYC_READ_ALL" /* KYC_READ_ALL */,
    "KYC_REVIEW" /* KYC_REVIEW */,
    "TRANSACTION_READ_ALL" /* TRANSACTION_READ_ALL */,
    "TRANSACTION_REVIEW" /* TRANSACTION_REVIEW */,
    "REPORT_VIEW" /* REPORT_VIEW */,
    "REPORT_EXPORT" /* REPORT_EXPORT */,
    "SECURITY_AUDIT_VIEW" /* SECURITY_AUDIT_VIEW */
  ],
  ["FINANCE" /* FINANCE */]: [
    "USER_READ_ALL" /* USER_READ_ALL */,
    "TRANSACTION_READ_ALL" /* TRANSACTION_READ_ALL */,
    "TRANSACTION_REVIEW" /* TRANSACTION_REVIEW */,
    "LOAN_READ_ALL" /* LOAN_READ_ALL */,
    "LOAN_REVIEW" /* LOAN_REVIEW */,
    "REPORT_VIEW" /* REPORT_VIEW */,
    "REPORT_EXPORT" /* REPORT_EXPORT */
  ],
  ["ADMIN" /* ADMIN */]: [
    "USER_READ_ALL" /* USER_READ_ALL */,
    "USER_UPDATE_ALL" /* USER_UPDATE_ALL */,
    "USER_SUSPEND" /* USER_SUSPEND */,
    "KYC_READ_ALL" /* KYC_READ_ALL */,
    "KYC_REVIEW" /* KYC_REVIEW */,
    "TRANSACTION_READ_ALL" /* TRANSACTION_READ_ALL */,
    "TRANSACTION_REVIEW" /* TRANSACTION_REVIEW */,
    "LOAN_READ_ALL" /* LOAN_READ_ALL */,
    "LOAN_REVIEW" /* LOAN_REVIEW */,
    "REPORT_VIEW" /* REPORT_VIEW */,
    "REPORT_EXPORT" /* REPORT_EXPORT */,
    "SECURITY_AUDIT_VIEW" /* SECURITY_AUDIT_VIEW */,
    "ADMIN_MANAGE" /* ADMIN_MANAGE */
  ],
  ["SUPER_ADMIN" /* SUPER_ADMIN */]: Object.values(Permission)
};
var RbacService = class {
  /**
   * Resolves full list of deduplicated permissions for a list of roles.
   */
  static getPermissionsForRoles(roles) {
    const permSet = /* @__PURE__ */ new Set();
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
  static hasPermission(user, permission) {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }
  /**
   * Checks if user has a specific role.
   */
  static hasRole(user, role) {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }
  /**
   * Checks if user is an administrator (ADMIN or SUPER_ADMIN).
   */
  static isAdmin(user) {
    return this.hasRole(user, "ADMIN" /* ADMIN */) || this.hasRole(user, "SUPER_ADMIN" /* SUPER_ADMIN */);
  }
};

// server/services/userStore.ts
var UserStore = class _UserStore {
  // 7 days
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.sessions = /* @__PURE__ */ new Map();
    this.securityEvents = [];
    this.passwordResetTokens = /* @__PURE__ */ new Map();
    this.emailVerificationTokens = /* @__PURE__ */ new Map();
    this.seedInitialUsers();
  }
  static {
    // Lockout configuration: 5 failed attempts locks account for 15 minutes
    this.MAX_FAILED_ATTEMPTS = 5;
  }
  static {
    this.LOCKOUT_DURATION_MS = 15 * 60 * 1e3;
  }
  static {
    // 15 mins
    this.SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1e3;
  }
  /**
   * Seeds demo users for testing and development environments.
   */
  seedInitialUsers() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const customerPasswordHash = CryptoService.hashPassword("BeyondPass2026!");
    const customerId = "usr_customer_demo";
    const customerRoles = ["CUSTOMER" /* CUSTOMER */];
    const customerUser = {
      id: customerId,
      firstName: "Adebayo",
      lastName: "Okonkwo",
      email: "customer@beyondfinancials.ng",
      phone: "+2348023456789",
      country: "NG",
      countryCode: "+234",
      timezone: "Africa/Lagos",
      locale: "en",
      passwordHash: customerPasswordHash,
      status: "ACTIVE" /* ACTIVE */,
      roles: customerRoles,
      permissions: RbacService.getPermissionsForRoles(customerRoles),
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      lastLoginAt: now,
      lastPasswordChangeAt: now,
      termsAcceptedAt: now,
      termsVersion: "2026.1",
      createdAt: new Date(Date.now() - 30 * 864e5).toISOString(),
      updatedAt: now
    };
    this.users.set(customerUser.id, customerUser);
    const adminPasswordHash = CryptoService.hashPassword("AdminMaster2026!");
    const adminId = "usr_admin_demo";
    const adminRoles = ["ADMIN" /* ADMIN */, "CUSTOMER" /* CUSTOMER */];
    const adminUser = {
      id: adminId,
      firstName: "Amara",
      lastName: "Eze",
      email: "admin@beyondfinancials.ng",
      phone: "+2348098765432",
      country: "NG",
      countryCode: "+234",
      timezone: "Africa/Lagos",
      locale: "en",
      passwordHash: adminPasswordHash,
      status: "ACTIVE" /* ACTIVE */,
      roles: adminRoles,
      permissions: RbacService.getPermissionsForRoles(adminRoles),
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifiedAt: now,
      phoneVerifiedAt: now,
      lastLoginAt: now,
      lastPasswordChangeAt: now,
      termsAcceptedAt: now,
      termsVersion: "2026.1",
      createdAt: new Date(Date.now() - 60 * 864e5).toISOString(),
      updatedAt: now
    };
    this.users.set(adminUser.id, adminUser);
  }
  // ==========================================
  // USER OPERATIONS
  // ==========================================
  /**
   * Registers a new user account.
   */
  async createUser(data) {
    const normalizedEmail = CryptoService.normalizeEmail(data.email);
    const countryCode = data.countryCode || "+234";
    const normalizedPhone = CryptoService.normalizePhone(data.phone, countryCode);
    if (this.findByEmail(normalizedEmail)) {
      throw new Error("An account with this email address already exists.");
    }
    const passwordValidation = CryptoService.validatePasswordStrength(data.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(". "));
    }
    if (!data.termsAccepted) {
      throw new Error("You must review and accept the Terms of Service to register.");
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const userId = CryptoService.generateId("usr");
    const passwordHash = CryptoService.hashPassword(data.password);
    const roles = ["CUSTOMER" /* CUSTOMER */];
    const permissions = RbacService.getPermissionsForRoles(roles);
    const newUser = {
      id: userId,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      country: data.country || "NG",
      countryCode,
      timezone: data.timezone || "Africa/Lagos",
      locale: data.locale || "en",
      passwordHash,
      status: "ACTIVE" /* ACTIVE */,
      // Initial foundation status
      roles,
      permissions,
      failedLoginAttempts: 0,
      lockedUntil: null,
      emailVerifiedAt: null,
      phoneVerifiedAt: null,
      lastLoginAt: now,
      lastPasswordChangeAt: now,
      termsAcceptedAt: now,
      termsVersion: "2026.1",
      createdAt: now,
      updatedAt: now
    };
    this.users.set(userId, newUser);
    this.recordSecurityEvent(
      "REGISTRATION_SUCCESS",
      userId,
      userId,
      data.ipAddress,
      data.userAgent,
      { email: normalizedEmail, country: newUser.country }
    );
    const session = this.createSession(userId, data.ipAddress, data.userAgent);
    return {
      user: this.toPublicProfile(newUser),
      session
    };
  }
  /**
   * Retrieves user by normalized email.
   */
  findByEmail(email) {
    const normalized = CryptoService.normalizeEmail(email);
    for (const user of this.users.values()) {
      if (user.email === normalized) {
        return user;
      }
    }
    return void 0;
  }
  /**
   * Retrieves user by internal ID.
   */
  findById(id) {
    return this.users.get(id);
  }
  /**
   * Updates public profile attributes.
   */
  updateProfile(userId, updates, ipAddress, userAgent) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (updates.firstName) user.firstName = updates.firstName.trim();
    if (updates.lastName) user.lastName = updates.lastName.trim();
    if (updates.phone) {
      user.phone = CryptoService.normalizePhone(updates.phone, user.countryCode);
    }
    if (updates.country) user.country = updates.country;
    if (updates.timezone) user.timezone = updates.timezone;
    if (updates.locale) user.locale = updates.locale;
    user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.recordSecurityEvent("PROFILE_UPDATED", userId, userId, ipAddress, userAgent);
    return this.toPublicProfile(user);
  }
  /**
   * Changes user password securely.
   */
  changePassword(userId, currentPassword, newPassword, currentSessionId, ipAddress, userAgent) {
    const user = this.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (!CryptoService.verifyPassword(currentPassword, user.passwordHash)) {
      this.recordSecurityEvent("LOGIN_FAILURE", userId, userId, ipAddress, userAgent, {
        reason: "Password change invalid current password"
      });
      throw new Error("The current password provided is incorrect.");
    }
    const validation = CryptoService.validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(". "));
    }
    if (CryptoService.verifyPassword(newPassword, user.passwordHash)) {
      throw new Error("Your new password cannot be the same as your current password.");
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    user.passwordHash = CryptoService.hashPassword(newPassword);
    user.lastPasswordChangeAt = now;
    user.updatedAt = now;
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    this.revokeAllUserSessions(userId, currentSessionId);
    this.recordSecurityEvent("PASSWORD_CHANGED", userId, userId, ipAddress, userAgent);
  }
  // ==========================================
  // AUTHENTICATION & ACCOUNT LOCKING
  // ==========================================
  /**
   * Checks if user account is currently locked.
   */
  isAccountLocked(user) {
    if (user.status === "LOCKED" /* LOCKED */ || user.lockedUntil) {
      if (user.lockedUntil) {
        const lockExpiry = new Date(user.lockedUntil).getTime();
        const now = Date.now();
        if (now < lockExpiry) {
          const remainingMinutes = Math.ceil((lockExpiry - now) / (60 * 1e3));
          return { isLocked: true, remainingMinutes };
        } else {
          user.lockedUntil = null;
          user.failedLoginAttempts = 0;
          if (user.status === "LOCKED" /* LOCKED */) {
            user.status = "ACTIVE" /* ACTIVE */;
          }
          user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
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
  recordFailedLogin(user, ipAddress, userAgent) {
    user.failedLoginAttempts += 1;
    user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.recordSecurityEvent("LOGIN_FAILURE", null, user.id, ipAddress, userAgent, {
      attemptNumber: user.failedLoginAttempts
    });
    if (user.failedLoginAttempts >= _UserStore.MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + _UserStore.LOCKOUT_DURATION_MS).toISOString();
      user.lockedUntil = lockUntil;
      user.status = "LOCKED" /* LOCKED */;
      this.recordSecurityEvent("ACCOUNT_LOCKED", null, user.id, ipAddress, userAgent, {
        reason: "Maximum failed login attempts exceeded",
        lockedUntil: lockUntil
      });
    }
  }
  /**
   * Records a successful login and clears failure counters.
   */
  recordSuccessfulLogin(user, ipAddress, userAgent) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    if (user.status === "LOCKED" /* LOCKED */) {
      user.status = "ACTIVE" /* ACTIVE */;
    }
    user.lastLoginAt = now;
    user.updatedAt = now;
    this.recordSecurityEvent("LOGIN_SUCCESS", user.id, user.id, ipAddress, userAgent);
  }
  // ==========================================
  // SESSION MANAGEMENT
  // ==========================================
  /**
   * Creates a new authenticated session for a user.
   */
  createSession(userId, ipAddress, userAgent) {
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + _UserStore.SESSION_DURATION_MS).toISOString();
    const sessionId = CryptoService.generateSessionToken();
    const session = {
      id: sessionId,
      userId,
      ipAddress: CryptoService.anonymizeIp(ipAddress),
      userAgent: userAgent ? userAgent.substring(0, 200) : "Unknown Browser",
      createdAt: now.toISOString(),
      lastActiveAt: now.toISOString(),
      expiresAt,
      isRevoked: false
    };
    this.sessions.set(sessionId, session);
    this.recordSecurityEvent("SESSION_CREATED", userId, userId, ipAddress, userAgent, {
      sessionId: sessionId.substring(0, 10) + "..."
    });
    return session;
  }
  /**
   * Validates session token and returns associated UserEntity.
   */
  validateSession(sessionId) {
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
    if (user.status === "SUSPENDED" /* SUSPENDED */ || user.status === "DEACTIVATED" /* DEACTIVATED */) {
      return null;
    }
    const lastActive = new Date(session.lastActiveAt).getTime();
    if (now - lastActive > 5 * 60 * 1e3) {
      session.lastActiveAt = new Date(now).toISOString();
    }
    return { user, session };
  }
  /**
   * Revokes a specific session.
   */
  revokeSession(sessionId, actorUserId, ipAddress, userAgent) {
    const session = this.sessions.get(sessionId);
    if (!session || session.isRevoked) return false;
    if (actorUserId && session.userId !== actorUserId) return false;
    session.isRevoked = true;
    this.recordSecurityEvent("SESSION_REVOKED", actorUserId || session.userId, session.userId, ipAddress, userAgent, {
      sessionId: sessionId.substring(0, 10) + "..."
    });
    return true;
  }
  /**
   * Revokes all active sessions for a user, optionally exempting current session.
   */
  revokeAllUserSessions(userId, exceptSessionId) {
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
  getUserSessions(userId, currentSessionId) {
    const now = Date.now();
    const results = [];
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
            isCurrent: session.id === currentSessionId
          });
        }
      }
    }
    return results.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
  }
  // ==========================================
  // PASSWORD RECOVERY & EMAIL VERIFICATION
  // ==========================================
  /**
   * Creates a password reset token. Always returns safe token object regardless of whether
   * the email exists (preventing timing attacks).
   */
  createPasswordResetToken(email, ipAddress, userAgent) {
    const normalizedEmail = CryptoService.normalizeEmail(email);
    const user = this.findByEmail(normalizedEmail);
    const token = CryptoService.generateToken("reset");
    const now = /* @__PURE__ */ new Date();
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1e3).toISOString();
    if (user) {
      for (const [hash, record] of this.passwordResetTokens) {
        if (record.userId === user.id && !record.isUsed) {
          this.passwordResetTokens.delete(hash);
        }
      }
      const tokenHash = CryptoService.hashToken(token);
      this.passwordResetTokens.set(tokenHash, {
        tokenHash,
        userId: user.id,
        email: normalizedEmail,
        expiresAt,
        isUsed: false,
        createdAt: now.toISOString()
      });
      this.recordSecurityEvent("PASSWORD_RESET_REQUESTED", null, user.id, ipAddress, userAgent);
      return { token, emailExists: true, userId: user.id, firstName: user.firstName };
    }
    CryptoService.hashToken(token);
    return { token: "", emailExists: false };
  }
  /**
   * Resets password using a valid reset token.
   */
  resetPasswordWithToken(token, newPassword, ipAddress, userAgent) {
    if (!token || typeof token !== "string") {
      return { success: false, message: "Invalid or expired password reset token." };
    }
    const record = this.passwordResetTokens.get(CryptoService.hashToken(token));
    if (!record || record.isUsed) {
      return { success: false, message: "Invalid or expired password reset token." };
    }
    const now = Date.now();
    const expiry = new Date(record.expiresAt).getTime();
    if (now > expiry) {
      record.isUsed = true;
      return { success: false, message: "Invalid or expired password reset token." };
    }
    const user = this.findById(record.userId);
    if (!user) {
      return { success: false, message: "Invalid or expired password reset token." };
    }
    const validation = CryptoService.validatePasswordStrength(newPassword);
    if (!validation.isValid) {
      return { success: false, message: validation.errors.join(". ") };
    }
    user.passwordHash = CryptoService.hashPassword(newPassword);
    user.lastPasswordChangeAt = (/* @__PURE__ */ new Date()).toISOString();
    user.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    if (user.status === "LOCKED" /* LOCKED */) {
      user.status = "ACTIVE" /* ACTIVE */;
    }
    record.isUsed = true;
    for (const [hash, pending] of this.passwordResetTokens) {
      if (pending.userId === user.id) {
        this.passwordResetTokens.delete(hash);
      }
    }
    this.revokeAllUserSessions(user.id);
    this.recordSecurityEvent("PASSWORD_RESET_COMPLETED", user.id, user.id, ipAddress, userAgent);
    return {
      success: true,
      message: "Password has been successfully reset. Please log in.",
      email: user.email,
      firstName: user.firstName,
      userId: user.id
    };
  }
  /**
   * Issues a single-use email verification token. Does not mark the address verified.
   */
  createEmailVerificationToken(userId, ipAddress, userAgent) {
    const user = this.findById(userId);
    if (!user || user.emailVerifiedAt) return null;
    for (const [hash, record] of this.emailVerificationTokens) {
      if (record.userId === userId && !record.isUsed) {
        this.emailVerificationTokens.delete(hash);
      }
    }
    const token = CryptoService.generateToken("verify");
    const now = /* @__PURE__ */ new Date();
    const tokenHash = CryptoService.hashToken(token);
    this.emailVerificationTokens.set(tokenHash, {
      tokenHash,
      userId: user.id,
      email: user.email,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1e3).toISOString(),
      isUsed: false,
      createdAt: now.toISOString()
    });
    this.recordSecurityEvent("EMAIL_VERIFICATION_REQUESTED", userId, userId, ipAddress, userAgent);
    return { token, email: user.email, firstName: user.firstName };
  }
  /**
   * Consumes a verification token and records emailVerifiedAt.
   * Failure messages are identical so the endpoint does not reveal account state.
   */
  consumeEmailVerificationToken(token, ipAddress, userAgent) {
    const invalid = { success: false, message: "This verification link is invalid or has expired." };
    if (!token || typeof token !== "string") return invalid;
    const record = this.emailVerificationTokens.get(CryptoService.hashToken(token));
    if (!record || record.isUsed) return invalid;
    if (Date.now() > new Date(record.expiresAt).getTime()) return invalid;
    const user = this.findById(record.userId);
    if (!user) return invalid;
    record.isUsed = true;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    user.emailVerifiedAt = now;
    user.updatedAt = now;
    this.recordSecurityEvent("EMAIL_VERIFIED", user.id, user.id, ipAddress, userAgent);
    return { success: true, message: "Your email address has been verified." };
  }
  // ==========================================
  // SECURITY AUDIT TRAIL
  // ==========================================
  /**
   * Appends an auditable security event.
   */
  recordSecurityEvent(eventType, actorUserId, targetUserId, ipAddress, userAgent, metadata) {
    const event = {
      id: CryptoService.generateId("evt"),
      eventType,
      actorUserId: actorUserId || null,
      targetUserId: targetUserId || null,
      ipAddress: CryptoService.anonymizeIp(ipAddress),
      userAgent: userAgent ? userAgent.substring(0, 150) : void 0,
      metadata: metadata || {},
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.securityEvents.unshift(event);
    if (this.securityEvents.length > 2e3) {
      this.securityEvents.pop();
    }
    return event;
  }
  /**
   * Retrieves security events for a specific user.
   */
  getSecurityEventsForUser(userId, limit = 20) {
    return this.securityEvents.filter((evt) => evt.targetUserId === userId || evt.actorUserId === userId).slice(0, limit);
  }
  /**
   * Retrieves all security events (admin audit log).
   */
  getAllSecurityEvents(limit = 100) {
    return this.securityEvents.slice(0, limit);
  }
  // ==========================================
  // SERIALIZATION & SANITIZATION
  // ==========================================
  /**
   * Sanitizes UserEntity into public-safe UserProfile.
   * Strips passwordHash, salts, failed attempts, and sensitive recovery internals.
   */
  toPublicProfile(user) {
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
      createdAt: user.createdAt
    };
  }
};
var userStore = new UserStore();

// server/middleware/auth.ts
function extractSessionId(req) {
  const authHeader = req.headers["authorization"];
  if (authHeader && typeof authHeader === "string") {
    if (authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7).trim();
    }
    return authHeader.trim();
  }
  const customHeader = req.headers["x-session-id"];
  if (customHeader && typeof customHeader === "string") {
    return customHeader.trim();
  }
  return void 0;
}
function requireAuth(req, _res, next) {
  try {
    const sessionId = extractSessionId(req);
    if (!sessionId) {
      throw new AppError(
        "Authentication required. Please log in to access this resource.",
        401,
        "AUTH_REQUIRED"
      );
    }
    const validation = userStore.validateSession(sessionId);
    if (!validation) {
      throw new AppError(
        "Session expired or invalid. Please log in again.",
        401,
        "INVALID_SESSION"
      );
    }
    const { user, session } = validation;
    if (user.status === "SUSPENDED" /* SUSPENDED */) {
      throw new AppError(
        "Your account has been suspended. Please contact Beyond Financials support.",
        403,
        "ACCOUNT_SUSPENDED"
      );
    }
    if (user.status === "DEACTIVATED" /* DEACTIVATED */) {
      throw new AppError(
        "This account has been deactivated.",
        403,
        "ACCOUNT_DEACTIVATED"
      );
    }
    const lockCheck = userStore.isAccountLocked(user);
    if (lockCheck.isLocked) {
      throw new AppError(
        `Account temporarily locked due to security attempts. Please try again in ${lockCheck.remainingMinutes || 15} minutes.`,
        423,
        "ACCOUNT_LOCKED"
      );
    }
    req.user = user;
    req.userProfile = userStore.toPublicProfile(user);
    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
}

// server/middleware/authRateLimit.ts
var buckets = /* @__PURE__ */ new Map();
var rateLimitSweep = setInterval(() => {
  const now = Date.now();
  for (const [key, tracker] of buckets.entries()) {
    if (now > tracker.resetTime) {
      buckets.delete(key);
    }
  }
}, 5 * 60 * 1e3);
rateLimitSweep.unref();
function createAuthRateLimiter(options) {
  const { windowMs, maxRequests, endpointName } = options;
  return (req, _res, next) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
      const key = `${endpointName}:${clientIp}`;
      const now = Date.now();
      let tracker = buckets.get(key);
      if (!tracker || now > tracker.resetTime) {
        tracker = {
          count: 1,
          resetTime: now + windowMs
        };
        buckets.set(key, tracker);
        return next();
      }
      tracker.count += 1;
      const effectiveMax = process.env.NODE_ENV === "test" ? Math.max(maxRequests, 1e4) : maxRequests;
      if (tracker.count > effectiveMax) {
        const retryAfterSeconds = Math.ceil((tracker.resetTime - now) / 1e3);
        throw new AppError(
          `Too many authentication requests for ${endpointName}. Please wait ${retryAfterSeconds} seconds before trying again.`,
          429,
          "RATE_LIMIT_EXCEEDED"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
var loginRateLimiter = createAuthRateLimiter({
  windowMs: 15 * 60 * 1e3,
  // 15 mins
  maxRequests: 10,
  // 10 login attempts per 15 min per IP
  endpointName: "login"
});
var registerRateLimiter = createAuthRateLimiter({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  maxRequests: 10,
  // 10 registrations per hour per IP
  endpointName: "register"
});
var passwordRecoveryRateLimiter = createAuthRateLimiter({
  windowMs: 30 * 60 * 1e3,
  // 30 mins
  maxRequests: 5,
  // 5 requests per 30 mins per IP
  endpointName: "recovery"
});
var passwordChangeRateLimiter = createAuthRateLimiter({
  windowMs: 15 * 60 * 1e3,
  // 15 mins
  maxRequests: 6,
  // 6 attempts per 15 mins
  endpointName: "password-change"
});

// server/routes/auth.ts
var authRouter = (0, import_express5.Router)();
authRouter.post("/register", registerRateLimiter, async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword, termsAccepted, country, countryCode } = req.body;
    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
      throw new AppError("First name is required (minimum 2 characters).", 400, "INVALID_FIRST_NAME");
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
      throw new AppError("Last name is required (minimum 2 characters).", 400, "INVALID_LAST_NAME");
    }
    if (!email || !CryptoService.isValidEmail(email)) {
      throw new AppError("A valid email address is required.", 400, "INVALID_EMAIL");
    }
    if (!phone || !CryptoService.isValidPhone(phone)) {
      throw new AppError("A valid international phone number is required.", 400, "INVALID_PHONE");
    }
    if (!password || typeof password !== "string") {
      throw new AppError("Password is required.", 400, "PASSWORD_REQUIRED");
    }
    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match.", 400, "PASSWORDS_MISMATCH");
    }
    if (!termsAccepted) {
      throw new AppError("You must acknowledge and accept the Terms of Service to register.", 400, "TERMS_REQUIRED");
    }
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    try {
      const result = await userStore.createUser({
        firstName,
        lastName,
        email,
        phone,
        password,
        country: country || "NG",
        countryCode: countryCode || "+234",
        termsAccepted: Boolean(termsAccepted),
        ipAddress: clientIp,
        userAgent
      });
      const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
      const verification = userStore.createEmailVerificationToken(result.user.id, clientIp, userAgent);
      let emailVerification = "skipped";
      if (verification) {
        emailVerification = await notifyEmailVerification({
          userId: result.user.id,
          email: verification.email,
          firstName: verification.firstName,
          token: verification.token,
          correlationId
        });
      }
      res.status(201).json({
        success: true,
        message: "Account successfully created. Welcome to Beyond Financials.",
        data: {
          user: result.user,
          session: {
            sessionId: result.session.id,
            expiresAt: result.session.expiresAt,
            createdAt: result.session.createdAt
          },
          emailVerification,
          ...allowsDevTokenDisclosure() && verification ? { devVerificationToken: verification.token } : {}
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      throw new AppError(errorMessage, 400, "REGISTRATION_FAILED");
    }
  } catch (error) {
    next(error);
  }
});
authRouter.post("/login", loginRateLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required.", 400, "MISSING_CREDENTIALS");
    }
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const normalizedEmail = CryptoService.normalizeEmail(email);
    const user = userStore.findByEmail(normalizedEmail);
    if (!user) {
      CryptoService.verifyPassword(
        password,
        "scrypt:00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
      );
      userStore.recordSecurityEvent("LOGIN_FAILURE", null, null, clientIp, userAgent, {
        reason: "Account not found (enumerated safely)"
      });
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }
    if (user.status === "SUSPENDED" /* SUSPENDED */) {
      throw new AppError(
        "Your account has been suspended. Please contact Beyond Financials compliance support.",
        403,
        "ACCOUNT_SUSPENDED"
      );
    }
    if (user.status === "DEACTIVATED" /* DEACTIVATED */) {
      throw new AppError(
        "This account has been deactivated.",
        403,
        "ACCOUNT_DEACTIVATED"
      );
    }
    const lockStatus = userStore.isAccountLocked(user);
    if (lockStatus.isLocked) {
      throw new AppError(
        `Account temporarily locked due to multiple failed login attempts. Please try again in ${lockStatus.remainingMinutes || 15} minutes.`,
        423,
        "ACCOUNT_LOCKED"
      );
    }
    const isPasswordValid = CryptoService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      userStore.recordFailedLogin(user, clientIp, userAgent);
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }
    userStore.recordSuccessfulLogin(user, clientIp, userAgent);
    const session = userStore.createSession(user.id, clientIp, userAgent);
    const publicProfile = userStore.toPublicProfile(user);
    res.json({
      success: true,
      message: "Login successful.",
      data: {
        user: publicProfile,
        session: {
          sessionId: session.id,
          expiresAt: session.expiresAt,
          createdAt: session.createdAt
        }
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/logout", requireAuth, (req, res, next) => {
  try {
    if (req.session) {
      const clientIp = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers["user-agent"];
      userStore.revokeSession(req.session.id, req.user?.id, clientIp, userAgent);
    }
    res.json({
      success: true,
      message: "Logged out successfully.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.get("/session", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.userProfile,
      session: {
        sessionId: req.session?.id,
        expiresAt: req.session?.expiresAt,
        createdAt: req.session?.createdAt,
        lastActiveAt: req.session?.lastActiveAt
      }
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
authRouter.get("/profile", requireAuth, (req, res) => {
  res.json({
    success: true,
    data: req.userProfile,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
authRouter.patch("/profile", requireAuth, (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { firstName, lastName, phone, country, timezone, locale } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const updatedProfile = userStore.updateProfile(
      req.user.id,
      { firstName, lastName, phone, country, timezone, locale },
      clientIp,
      userAgent
    );
    res.json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedProfile,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/change-password", requireAuth, passwordChangeRateLimiter, async (req, res, next) => {
  try {
    if (!req.user || !req.session) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required.", 400, "MISSING_FIELDS");
    }
    if (newPassword !== confirmPassword) {
      throw new AppError("New passwords do not match.", 400, "PASSWORDS_MISMATCH");
    }
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
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
      const message = err instanceof Error ? err.message : "Unable to change password.";
      throw new AppError(message, 400, "PASSWORD_CHANGE_FAILED");
    }
    const changedAt = (/* @__PURE__ */ new Date()).toISOString();
    const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
    const securityNotice = await notifyPasswordChanged({
      userId: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      changedAt,
      correlationId
    });
    res.json({
      success: true,
      message: "Password changed successfully. Other active sessions have been signed out for security.",
      data: { securityNotice },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/forgot-password", passwordRecoveryRateLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !CryptoService.isValidEmail(email)) {
      throw new AppError("A valid email address is required.", 400, "INVALID_EMAIL");
    }
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const recovery = userStore.createPasswordResetToken(email, clientIp, userAgent);
    if (recovery.emailExists && recovery.token && recovery.userId) {
      const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
      await notifyPasswordReset({
        userId: recovery.userId,
        email: CryptoService.normalizeEmail(email),
        firstName: recovery.firstName || "there",
        token: recovery.token,
        correlationId
      });
    }
    res.json({
      success: true,
      message: "If an account exists for this email address, a password reset request has been recorded.",
      data: {
        // Local development helper only. Never returned in production.
        ...allowsDevTokenDisclosure() && recovery.emailExists ? { devResetToken: recovery.token } : {}
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/reset-password", passwordRecoveryRateLimiter, async (req, res, next) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || typeof token !== "string") {
      throw new AppError("Reset token is required.", 400, "TOKEN_REQUIRED");
    }
    if (!newPassword || typeof newPassword !== "string") {
      throw new AppError("New password is required.", 400, "PASSWORD_REQUIRED");
    }
    if (newPassword !== confirmPassword) {
      throw new AppError("Passwords do not match.", 400, "PASSWORDS_MISMATCH");
    }
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const result = userStore.resetPasswordWithToken(token, newPassword, clientIp, userAgent);
    if (!result.success) {
      throw new AppError(result.message, 400, "RESET_FAILED");
    }
    let securityNotice = "skipped";
    if (result.userId && result.email) {
      const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
      securityNotice = await notifyPasswordChanged({
        userId: result.userId,
        email: result.email,
        firstName: result.firstName || "there",
        changedAt: (/* @__PURE__ */ new Date()).toISOString(),
        correlationId
      });
    }
    res.json({
      success: true,
      message: result.message,
      data: { securityNotice },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/verify-email", passwordRecoveryRateLimiter, (req, res, next) => {
  try {
    const token = typeof req.body?.token === "string" ? req.body.token : "";
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const result = userStore.consumeEmailVerificationToken(token, clientIp, userAgent);
    if (!result.success) {
      throw new AppError(result.message, 400, "VERIFICATION_FAILED");
    }
    res.json({
      success: true,
      message: result.message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.post("/resend-verification", requireAuth, passwordRecoveryRateLimiter, async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    if (req.user.emailVerifiedAt) {
      res.json({
        success: true,
        message: "This email address is already verified.",
        data: { emailVerification: "skipped" },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return;
    }
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const verification = userStore.createEmailVerificationToken(req.user.id, clientIp, userAgent);
    if (!verification) {
      res.json({
        success: true,
        message: "This email address is already verified.",
        data: { emailVerification: "skipped" },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      return;
    }
    const correlationId = typeof req.headers["x-request-id"] === "string" ? req.headers["x-request-id"].slice(0, 80) : CryptoService.generateId("req", 8);
    const emailVerification = await notifyEmailVerification({
      userId: req.user.id,
      email: verification.email,
      firstName: verification.firstName,
      token: verification.token,
      correlationId
    });
    const accepted = emailVerification === "accepted";
    res.json({
      success: true,
      message: accepted ? "A verification email was submitted to your email provider. This does not confirm it has reached your inbox." : "We could not send a verification email just now. Your account is unchanged.",
      data: {
        emailVerification,
        ...allowsDevTokenDisclosure() ? { devVerificationToken: verification.token } : {}
      },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.get("/sessions", requireAuth, (req, res, next) => {
  try {
    if (!req.user || !req.session) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const sessions = userStore.getUserSessions(req.user.id, req.session.id);
    res.json({
      success: true,
      data: sessions,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.delete("/sessions/:sessionId", requireAuth, (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const { sessionId } = req.params;
    const clientIp = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const revoked = userStore.revokeSession(sessionId, req.user.id, clientIp, userAgent);
    if (!revoked) {
      throw new AppError("Session not found.", 404, "SESSION_NOT_FOUND");
    }
    res.json({
      success: true,
      message: "Session revoked successfully.",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.delete("/sessions", requireAuth, (req, res, next) => {
  try {
    if (!req.user || !req.session) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const revokedCount = userStore.revokeAllUserSessions(req.user.id, req.session.id);
    res.json({
      success: true,
      message: `${revokedCount} other active session(s) revoked successfully.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});
authRouter.get("/security-events", requireAuth, (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    }
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);
    const events = userStore.getSecurityEventsForUser(req.user.id, limit);
    res.json({
      success: true,
      data: events,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// server/app.ts
function createApp() {
  const app = (0, import_express6.default)();
  app.use(import_express6.default.json({ limit: "1mb" }));
  app.use(import_express6.default.urlencoded({ extended: true }));
  app.use(requestLogger);
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    next();
  });
  app.use("/api", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/waitlist", waitlistRouter);
  app.use("/api/contact", contactRouter);
  app.use("/api/admin", adminRouter);
  app.all("/api/*", (_req, res) => {
    res.status(404).json({
      success: false,
      message: "API endpoint not found on Beyond Financials gateway.",
      error: { code: "NOT_FOUND" },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use(errorHandler);
  return app;
}

// server/vercelHandler.ts
function restoreApiPath(req) {
  const current = req.url || "/";
  let parsed;
  try {
    parsed = new URL(current, "http://localhost");
  } catch {
    return;
  }
  const forwarded = parsed.searchParams.get("bfpath");
  if (forwarded) {
    parsed.searchParams.delete("bfpath");
    const search2 = parsed.searchParams.toString();
    const path = forwarded.replace(/^\/+/, "");
    req.url = `/api/${path}${search2 ? `?${search2}` : ""}`;
    return;
  }
  if (parsed.pathname === "/api" || parsed.pathname.startsWith("/api/")) return;
  const segments = parsed.searchParams.getAll("path").flatMap((value) => value.split("/")).filter(Boolean);
  if (segments.length === 0) return;
  parsed.searchParams.delete("path");
  const search = parsed.searchParams.toString();
  req.url = `/api/${segments.join("/")}${search ? `?${search}` : ""}`;
}
function createVercelApp() {
  const root = (0, import_express7.default)();
  root.use((req, _res, next) => {
    restoreApiPath(req);
    next();
  });
  root.use(createApp());
  return root;
}
var vercelHandler_default = createVercelApp();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createVercelApp,
  restoreApiPath
});
module.exports = module.exports.default;
