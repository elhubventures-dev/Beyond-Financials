/**
 * Beyond Financials - Domain Model & Type Definitions
 * 
 * Core Principles:
 * 1. Double-entry / Auditable financial ledger abstractions.
 * 2. Provider-adapter interfaces for pluggable fintech integrations.
 * 3. Privacy-safe waitlist and user acquisition types.
 * 4. Tiered KYC models adhering to Nigerian regulatory frameworks.
 */

export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR' | 'USDT' | 'BTC' | 'ETH';

export enum AccountType {
  INDIVIDUAL_RETAIL = 'INDIVIDUAL_RETAIL',
  SALARY_EARNER = 'SALARY_EARNER',
  BUSINESS_MERCHANT = 'BUSINESS_MERCHANT',
  AGENT_BANKING = 'AGENT_BANKING',
  SYSTEM_SETTLEMENT = 'SYSTEM_SETTLEMENT',
  ESCROW = 'ESCROW',
}

export enum KYCTier {
  TIER_0_WAITLIST = 'TIER_0_WAITLIST',
  TIER_1_BASIC = 'TIER_1_BASIC',       // Phone, Name, Basic Limit
  TIER_2_VERIFIED = 'TIER_2_VERIFIED', // BVN, NIN, Selfie
  TIER_3_ENHANCED = 'TIER_3_ENHANCED', // Utility bill, Proof of address
}

export enum BalanceType {
  FIAT_WALLET = 'FIAT_WALLET',
  FLEXIBLE_SAVINGS = 'FLEXIBLE_SAVINGS',
  GOAL_SAVINGS = 'GOAL_SAVINGS',
  LOCKED_SAVINGS = 'LOCKED_SAVINGS',
  LOAN_LIABILITY = 'LOAN_LIABILITY',
  MERCHANT_SETTLEMENT = 'MERCHANT_SETTLEMENT',
  AGENT_COMMISSION = 'AGENT_COMMISSION',
  INVESTMENT_PORTFOLIO = 'INVESTMENT_PORTFOLIO', // Future
  CRYPTO_ASSET = 'CRYPTO_ASSET',                 // Future
}

export enum TransactionDirection {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum LedgerEntryType {
  WALLET_FUNDING = 'WALLET_FUNDING',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  INTERBANK_TRANSFER = 'INTERBANK_TRANSFER',
  SAVINGS_DEPOSIT = 'SAVINGS_DEPOSIT',
  SAVINGS_WITHDRAWAL = 'SAVINGS_WITHDRAWAL',
  SAVINGS_INTEREST = 'SAVINGS_INTEREST',
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  BILL_PAYMENT_AIRTIME = 'BILL_PAYMENT_AIRTIME',
  BILL_PAYMENT_DATA = 'BILL_PAYMENT_DATA',
  BILL_PAYMENT_UTILITY = 'BILL_PAYMENT_UTILITY',
  MERCHANT_PAYMENT = 'MERCHANT_PAYMENT',
  MERCHANT_SETTLEMENT = 'MERCHANT_SETTLEMENT',
  AGENT_CASH_IN = 'AGENT_CASH_IN',
  AGENT_CASH_OUT = 'AGENT_CASH_OUT',
  AGENT_COMMISSION_EARNED = 'AGENT_COMMISSION_EARNED',
  SYSTEM_FEE = 'SYSTEM_FEE',
}

/**
 * Fundamental immutable Ledger Entry
 * Strict double-entry accounting model foundation.
 */
export interface LedgerEntry {
  id: string;
  transactionId: string;
  accountId: string;
  balanceType: BalanceType;
  direction: TransactionDirection;
  amount: number; // in smallest unit or decimal (e.g. kobo for NGN)
  currency: CurrencyCode;
  entryType: LedgerEntryType;
  narration: string;
  reference: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  auditTrailId: string;
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'UNSUBSCRIBED';

export type InterestCategory =
  | 'BANKING'
  | 'LOANS'
  | 'SAVINGS'
  | 'PAYMENTS'
  | 'INVESTMENTS'
  | 'CRYPTO'
  | 'MERCHANTS'
  | 'AGENTS'
  | 'OTHER';

export type AcquisitionSource =
  | 'DIRECT'
  | 'HOMEPAGE'
  | 'SERVICES'
  | 'BANKING'
  | 'SAVINGS'
  | 'LOANS'
  | 'PAYMENTS'
  | 'INVESTMENTS'
  | 'CRYPTO'
  | 'CONTACT'
  | 'CAMPAIGN'
  | 'REFERRAL'
  | string;

export interface WaitlistLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  primaryInterest: InterestCategory;
  interests: InterestCategory[];
  customerSegment: 'individual' | 'salary_earner' | 'business_owner' | 'student' | 'agent' | 'other';
  consent: boolean;
  consentRecordedAt: string;
  source: AcquisitionSource;
  status: LeadStatus;
  statusNotes?: string;
  country?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPage?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  ipHash?: string;
}

export interface LeadFilterParams {
  q?: string;
  status?: LeadStatus | 'ALL';
  interest?: InterestCategory | 'ALL';
  source?: AcquisitionSource | 'ALL';
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface LeadAnalyticsSummary {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  convertedLeads: number;
  unsubscribedLeads: number;
  byInterest: Record<InterestCategory, number>;
  bySource: Record<string, number>;
  bySegment: Record<string, number>;
  recentDailyTrend: { date: string; count: number }[];
  lastUpdated: string;
}

/**
 * Waitlist Registration Model
 * Collects only privacy-safe, non-sensitive acquisition data.
 */
export type WaitlistInterestCategory =
  | 'digital_banking'
  | 'smart_savings'
  | 'personal_loans'
  | 'business_financing'
  | 'bill_payments'
  | 'merchant_services'
  | 'investments_future'
  | 'crypto_future';

export interface WaitlistSubmission {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  primaryInterest: WaitlistInterestCategory;
  customerSegment: 'individual' | 'salary_earner' | 'business_owner' | 'student' | 'other';
  notes?: string;
  consentAccepted: boolean;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPage?: string;
}

export interface WaitlistRecord extends WaitlistSubmission {
  id: string;
  submittedAt: string;
  ipHash?: string;
  status: 'PENDING_ONBOARDING' | 'INVITED' | 'REGISTERED';
  source: string;
}

/**
 * System Health & Capabilities Envelope
 */
export interface SystemHealthStatus {
  service: string;
  status: 'PRE_LAUNCH' | 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  realTransactionsEnabled: boolean;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: string | Record<string, string[]>;
  };
  timestamp: string;
}
