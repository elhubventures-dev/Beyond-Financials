/**
 * Beyond Financials - Public Waitlist & Early Acquisition API Route
 * 
 * DATA PRIVACY PRINCIPLE:
 * Strictly captures only privacy-safe contact and interest categorization.
 * Rejects and strips any sensitive identifiers (BVN, NIN, card data, passwords).
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { leadStore } from '../services/leadStore';

export const waitlistRouter = Router();

// Rate limiting map: records timestamps per IP/Email (in-memory)
const waitlistRateMap = new Map<string, number[]>();

// Validation regex helpers
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CLEAN_REGEX = /^(?:\+234|0)[789][01]\d{8}$/;

// Sensitive keyword detection to prevent accidental submission of financial secrets
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

// Flood protection helper: max 6 submissions per 10 minutes per IP/email
function checkWaitlistRateLimit(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 6;

  const timestamps = waitlistRateMap.get(key) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxAttempts) {
    return false;
  }

  validTimestamps.push(now);
  waitlistRateMap.set(key, validTimestamps);
  return true;
}

waitlistRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      primaryInterest,
      customerSegment = 'individual',
      notes,
      consentAccepted,
      consent,
      source = 'HOMEPAGE',
      country = 'NG',
      referralCode,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      landingPage,
    } = req.body;

    const validationErrors: Record<string, string[]> = {};

    // 1. Rate Limiting Check
    const ipKey = req.ip || 'anonymous';
    const emailKey = typeof email === 'string' ? email.trim().toLowerCase() : ipKey;
    if (!checkWaitlistRateLimit(ipKey) || !checkWaitlistRateLimit(emailKey)) {
      throw new AppError(
        'Too many waitlist submissions received recently. Please wait a few minutes before trying again.',
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    // 2. First Name validation
    if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
      validationErrors.firstName = ['First name is required (minimum 2 characters).'];
    }

    // 3. Last Name validation
    if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
      validationErrors.lastName = ['Last name is required (minimum 2 characters).'];
    }

    // 4. Email validation & normalization
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      validationErrors.email = ['A valid email address is required.'];
    }

    // 5. Phone validation (optional, but if provided, must be valid format)
    if (phoneNumber && typeof phoneNumber === 'string' && phoneNumber.trim().length > 0) {
      const sanitizedPhone = phoneNumber.replace(/[\s-]/g, '');
      if (!PHONE_CLEAN_REGEX.test(sanitizedPhone) && sanitizedPhone.length < 10) {
        validationErrors.phoneNumber = ['Please provide a valid Nigerian phone number (e.g. 08012345678 or +2348012345678).'];
      }
    }

    // 6. Primary interest validation
    if (!primaryInterest || typeof primaryInterest !== 'string' || primaryInterest.trim().length === 0) {
      validationErrors.primaryInterest = ['Please select a valid area of interest.'];
    }

    // 7. Sensitive data rejection
    const combinedText = `${notes || ''} ${referralCode || ''}`;
    for (const pattern of SENSITIVE_KEYWORDS) {
      if (pattern.test(combinedText)) {
        validationErrors.notes = [
          'Security Notice: For your safety, do NOT include BVN, NIN, card details, PINs, passwords, or recovery phrases in waitlist forms.',
        ];
        break;
      }
    }

    // 8. Explicit Consent validation (accepts either consentAccepted or consent)
    const isConsentGiven = Boolean(consentAccepted !== undefined ? consentAccepted : consent);
    if (!isConsentGiven) {
      validationErrors.consentAccepted = ['You must agree to receive early access updates and communications.'];
    }

    if (Object.keys(validationErrors).length > 0) {
      throw new AppError('Waitlist registration failed validation.', 422, 'VALIDATION_FAILED', validationErrors);
    }

    // Pass to Lead Store
    const { lead, isDuplicate } = leadStore.createOrUpdateLead({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      primaryInterest,
      customerSegment,
      notes: notes ? String(notes).trim().slice(0, 300) : undefined,
      consent: isConsentGiven,
      source: String(source),
      country,
      referralCode: referralCode ? String(referralCode).trim().slice(0, 50) : undefined,
      utmSource: utmSource ? String(utmSource).trim().slice(0, 50) : undefined,
      utmMedium: utmMedium ? String(utmMedium).trim().slice(0, 50) : undefined,
      utmCampaign: utmCampaign ? String(utmCampaign).trim().slice(0, 50) : undefined,
      utmContent: utmContent ? String(utmContent).trim().slice(0, 50) : undefined,
      landingPage: landingPage ? String(landingPage).trim().slice(0, 100) : undefined,
      ip: req.ip,
    });

    if (isDuplicate) {
      return res.status(200).json({
        success: true,
        message: "You may already be on the list. If so, we'll keep your existing registration and updated preferences.",
        data: {
          referenceId: lead.id,
          email: lead.email,
          alreadyRegistered: true,
        },
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for joining the Beyond Financials early access waitlist. We look forward to welcoming you.',
      data: {
        referenceId: lead.id,
        firstName: lead.firstName,
        email: lead.email,
        primaryInterest: lead.primaryInterest,
        submittedAt: lead.createdAt,
        alreadyRegistered: false,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

// Summary metrics route for foundation oversight
waitlistRouter.get('/stats', (_req: Request, res: Response) => {
  const stats = leadStore.getAnalyticsSummary();

  res.json({
    success: true,
    message: 'Waitlist acquisition summary statistics.',
    data: stats,
    timestamp: new Date().toISOString(),
  });
});

