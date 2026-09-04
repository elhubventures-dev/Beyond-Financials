/**
 * Beyond Financials - Public Contact & Enquiry API Route
 * 
 * SECURITY & PRIVACY CONTROLS:
 * - Server-side validation and sanitization
 * - Sensitive credential rejection (detects and rejects BVN, NIN, card PANs, PINs, passwords, seed phrases)
 * - Rate limiting / flood prevention
 * - PII-sanitized audit logging
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { AuditLogEntry } from '../types';

export const contactRouter = Router();

export interface StoredContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  category: string;
  subject?: string;
  message: string;
  consentAccepted: boolean;
  status: 'PENDING_REVIEW' | 'ROUTED' | 'RESOLVED';
  submittedAt: string;
  ipHash?: string;
  source: string;
}

const contactStore: StoredContactMessage[] = [];
const auditLogs: AuditLogEntry[] = [];

// Rate limiting map: records timestamps per IP/Email (in-memory)
const submissionRateMap = new Map<string, number[]>();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIGERIAN_PHONE_REGEX = /^(?:\+234|0)[789][01]\d{8}$/;

// Regex detection for sensitive financial keywords / numbers
const SENSITIVE_KEYWORDS = [
  /\bbvn\b[\s\S]{0,15}\d{11}/i,
  /\bnin\b[\s\S]{0,15}\d{11}/i,
  /\b(?:\d[ -]*?){13,19}\b/, // Potential card PAN
  /\bpassword\b/i,
  /\bcvv\b[\s\S]{0,10}\d{3,4}/i,
  /\b(?:card|atm|secret)\s+pin\b/i,
  /\bseed\s*phrase\b/i,
  /\bprivate\s*key\b/i,
];

const VALID_CATEGORIES = [
  'general',
  'partnership',
  'banking',
  'savings',
  'loans',
  'payments',
  'investments',
  'crypto',
  'merchants',
  'agents',
  'support',
  'other',
];

// Flood protection helper: max 5 messages per 10 minutes per IP/email
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 5;

  const timestamps = submissionRateMap.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxAttempts) {
    return false;
  }

  validTimestamps.push(now);
  submissionRateMap.set(key, validTimestamps);
  return true;
}

contactRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      category = 'general',
      subject,
      message,
      consentAccepted,
    } = req.body;

    const validationErrors: Record<string, string[]> = {};

    // 1. Rate Limiting Check
    const ipKey = req.ip || 'anonymous';
    const emailKey = typeof email === 'string' ? email.trim().toLowerCase() : ipKey;
    if (!checkRateLimit(ipKey) || !checkRateLimit(emailKey)) {
      throw new AppError(
        'Too many contact requests submitted recently. Please wait a few minutes before submitting another enquiry.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    // 2. First Name Validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
      validationErrors.firstName = ['First name is required (minimum 2 characters).'];
    }

    // 3. Last Name Validation
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
      validationErrors.lastName = ['Last name is required (minimum 2 characters).'];
    }

    // 4. Email Validation
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      validationErrors.email = ['A valid email address is required.'];
    }

    // 5. Phone Validation (Optional)
    if (phoneNumber && typeof phoneNumber === 'string' && phoneNumber.trim().length > 0) {
      const sanitizedPhone = phoneNumber.replace(/[\s-]/g, '');
      if (!NIGERIAN_PHONE_REGEX.test(sanitizedPhone) && sanitizedPhone.length < 10) {
        validationErrors.phoneNumber = ['Please provide a valid phone number (e.g. 08012345678 or +2348012345678).'];
      }
    }

    // 6. Category Validation
    if (!category || !VALID_CATEGORIES.includes(category)) {
      validationErrors.category = ['Please select a valid enquiry category.'];
    }

    // 7. Message Validation
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      validationErrors.message = ['Please provide a descriptive message of at least 10 characters.'];
    } else if (message.trim().length > 2000) {
      validationErrors.message = ['Message exceeds the maximum allowable length of 2,000 characters.'];
    }

    // 8. Sensitive Data Guard (Rejection of BVN, NIN, Card PANs, PINs, Passwords)
    const combinedText = `${subject || ''} ${message || ''}`;
    for (const pattern of SENSITIVE_KEYWORDS) {
      if (pattern.test(combinedText)) {
        validationErrors.message = [
          'Security Notice: For your safety, do NOT include BVN, NIN, card details, PINs, passwords, or recovery phrases in contact enquiries. Beyond Financials representatives will never ask for your confidential financial secrets.',
        ];
        break;
      }
    }

    // 9. Consent Validation
    if (!consentAccepted) {
      validationErrors.consentAccepted = ['You must agree to our communication terms and privacy practices.'];
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new AppError('Contact submission failed validation.', 422, 'VALIDATION_FAILED', validationErrors);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanMessage = message.trim();
    const cleanSubject = subject && typeof subject === 'string' ? subject.trim().slice(0, 150) : undefined;

    const referenceId = `BF-CNT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newContactEntry: StoredContactMessage = {
      id: referenceId,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: cleanEmail,
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      category,
      subject: cleanSubject,
      message: cleanMessage,
      consentAccepted: Boolean(consentAccepted),
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      ipHash: req.ip ? Buffer.from(req.ip).toString('base64').slice(0, 10) : undefined,
      source: 'web_portal_contact_form',
    };

    contactStore.push(newContactEntry);

    // Audit Logging
    auditLogs.push({
      id: `AUD-CNT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: 'CONTACT_ENQUIRY_RECORDED',
      actor: 'PUBLIC_PROSPECT',
      ipHash: newContactEntry.ipHash,
      details: {
        enquiryId: newContactEntry.id,
        category: newContactEntry.category,
      },
      level: 'INFO',
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to Beyond Financials. Your enquiry has been received and routed to our team.',
      data: {
        referenceId: newContactEntry.id,
        firstName: newContactEntry.firstName,
        category: newContactEntry.category,
        submittedAt: newContactEntry.submittedAt,
        expectedResponseTime: '1 to 2 business days',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Category definition metadata endpoint
contactRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'general', label: 'General Information & Questions' },
      { id: 'partnership', label: 'Institutional & Ecosystem Partnerships' },
      { id: 'banking', label: 'Digital Banking & Virtual Accounts' },
      { id: 'savings', label: 'Disciplined & Goal Savings' },
      { id: 'loans', label: 'Structured Loans & Credit Facilities' },
      { id: 'payments', label: 'Utility & Everyday Bill Payments' },
      { id: 'investments', label: 'Investments & Capital Markets (Future Scope)' },
      { id: 'crypto', label: 'Digital Assets & Web3 (Future Scope)' },
      { id: 'merchants', label: 'Merchant & POS Settlement Solutions' },
      { id: 'agents', label: 'Agency Banking & Float Management' },
      { id: 'support', label: 'Waitlist & Early Access Support' },
      { id: 'other', label: 'Other Enquiries' },
    ],
    timestamp: new Date().toISOString(),
  });
});
