/**
 * Beyond Financials - Server Shared Types & Schemas
 */

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

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetId?: string;
  ipHash?: string;
  details?: Record<string, unknown>;
  level: 'INFO' | 'WARN' | 'SECURITY';
}

