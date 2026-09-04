/**
 * Beyond Financials - Waitlist & Lead Acquisition Data Store Service
 * 
 * CORE RESPONSIBILITIES:
 * - Structured lead lifecycle management (NEW -> CONTACTED -> QUALIFIED -> CONVERTED -> UNSUBSCRIBED)
 * - Safe deduplication via normalized email hash
 * - Explicit consent verification and timestamp auditing
 * - Acquisition channel attribution (UTM parameters, landing pages, source tags)
 * - CSV export with formula injection prevention
 * - PII-minimizing administrative audit trails
 */

import {
  WaitlistLead,
  LeadStatus,
  InterestCategory,
  AcquisitionSource,
  LeadFilterParams,
  LeadAnalyticsSummary,
  AuditLogEntry,
} from '../types';

// Normalized interest mapping helper
export const INTEREST_MAP: Record<string, InterestCategory> = {
  banking: 'BANKING',
  digital_banking: 'BANKING',
  savings: 'SAVINGS',
  smart_savings: 'SAVINGS',
  disciplined_savings: 'SAVINGS',
  loans: 'LOANS',
  personal_loans: 'LOANS',
  business_financing: 'LOANS',
  sme: 'LOANS',
  payments: 'PAYMENTS',
  bill_payments: 'PAYMENTS',
  bills: 'PAYMENTS',
  investments: 'INVESTMENTS',
  investments_future: 'INVESTMENTS',
  crypto: 'CRYPTO',
  crypto_future: 'CRYPTO',
  merchants: 'MERCHANTS',
  merchant_services: 'MERCHANTS',
  agents: 'AGENTS',
  agency_banking: 'AGENTS',
  other: 'OTHER',
};

// Normalized acquisition source mapping helper
export const SOURCE_MAP: Record<string, AcquisitionSource> = {
  direct: 'DIRECT',
  homepage: 'HOMEPAGE',
  home: 'HOMEPAGE',
  services: 'SERVICES',
  banking: 'BANKING',
  savings: 'SAVINGS',
  loans: 'LOANS',
  payments: 'PAYMENTS',
  investments: 'INVESTMENTS',
  crypto: 'CRYPTO',
  contact: 'CONTACT',
  campaign: 'CAMPAIGN',
  referral: 'REFERRAL',
  web_portal_foundation: 'HOMEPAGE',
  web_portal_contact_form: 'CONTACT',
};

// Controlled Status List
export const VALID_LEAD_STATUSES: LeadStatus[] = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CONVERTED',
  'UNSUBSCRIBED',
];

// Controlled Interest List
export const VALID_INTEREST_CATEGORIES: InterestCategory[] = [
  'BANKING',
  'SAVINGS',
  'LOANS',
  'PAYMENTS',
  'INVESTMENTS',
  'CRYPTO',
  'MERCHANTS',
  'AGENTS',
  'OTHER',
];

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizePhoneNumber(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digitsOnly = phone.replace(/[^\d+]/g, '');
  if (!digitsOnly) return undefined;

  // Convert Nigerian 080... to +23480...
  if (digitsOnly.startsWith('0') && digitsOnly.length === 11) {
    return `+234${digitsOnly.slice(1)}`;
  }
  if (digitsOnly.startsWith('234') && digitsOnly.length === 13) {
    return `+${digitsOnly}`;
  }
  return digitsOnly;
}

export function normalizeInterest(interestStr: string): InterestCategory {
  const key = interestStr.toLowerCase().trim();
  return INTEREST_MAP[key] || 'OTHER';
}

export function normalizeSource(sourceStr?: string): AcquisitionSource {
  if (!sourceStr) return 'DIRECT';
  const key = sourceStr.toLowerCase().trim();
  return SOURCE_MAP[key] || sourceStr.toUpperCase().slice(0, 30);
}

export interface CreateLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  primaryInterest: string;
  interests?: string[];
  customerSegment?: 'individual' | 'salary_earner' | 'business_owner' | 'student' | 'agent' | 'other';
  notes?: string;
  consent: boolean;
  source?: string;
  country?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPage?: string;
  ip?: string;
}

class LeadStoreService {
  private leads: WaitlistLead[] = [];
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.seedInitialLeads();
  }

  /**
   * Seed structured, realistic pre-launch acquisition prospects across Nigerian demographics
   */
  private seedInitialLeads() {
    const seedData: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      interest: InterestCategory;
      segment: WaitlistLead['customerSegment'];
      source: AcquisitionSource;
      status: LeadStatus;
      daysAgo: number;
      utmSource?: string;
      utmCampaign?: string;
      notes?: string;
    }> = [
      {
        firstName: 'Chidinma',
        lastName: 'Okonkwo',
        email: 'chidinma.okonkwo@example.com',
        phone: '+2348023456789',
        interest: 'SAVINGS',
        segment: 'salary_earner',
        source: 'HOMEPAGE',
        status: 'NEW',
        daysAgo: 1,
        utmSource: 'linkedin',
        utmCampaign: 'pre_launch_waitlist',
        notes: 'Interested in disciplined lock savings for rent.',
      },
      {
        firstName: 'Tunde',
        lastName: 'Adeleke',
        email: 'tunde.adeleke@example.com',
        phone: '+2348034567890',
        interest: 'BANKING',
        segment: 'business_owner',
        source: 'BANKING',
        status: 'QUALIFIED',
        daysAgo: 3,
        utmSource: 'google_search',
        utmCampaign: 'virtual_accounts_ng',
        notes: 'Runs a retail pharmacy chain in Ikeja, requires multiple sub-accounts.',
      },
      {
        firstName: 'Ibrahim',
        lastName: 'Musa',
        email: 'ibrahim.musa@example.com',
        phone: '+2348056789012',
        interest: 'LOANS',
        segment: 'business_owner',
        source: 'LOANS',
        status: 'CONTACTED',
        daysAgo: 5,
        utmSource: 'twitter_x',
        utmCampaign: 'sme_financing',
        notes: 'Needs inventory credit financing for seasonal supplies.',
      },
      {
        firstName: 'Ngozi',
        lastName: 'Eze',
        email: 'ngozi.eze@example.com',
        phone: '+2348078901234',
        interest: 'PAYMENTS',
        segment: 'individual',
        source: 'SERVICES',
        status: 'NEW',
        daysAgo: 2,
        utmSource: 'referral',
        utmCampaign: 'friend_share',
      },
      {
        firstName: 'Babatunde',
        lastName: 'Fashola',
        email: 'babatunde.f@example.com',
        phone: '+2348101234567',
        interest: 'INVESTMENTS',
        segment: 'salary_earner',
        source: 'INVESTMENTS',
        status: 'QUALIFIED',
        daysAgo: 6,
        utmSource: 'techcabal',
        utmCampaign: 'wealth_tech_review',
        notes: 'Inquired about capital market access and curated treasury bills.',
      },
      {
        firstName: 'Emeka',
        lastName: 'Nnamdi',
        email: 'emeka.nnamdi@example.com',
        phone: '+2348123456780',
        interest: 'CRYPTO',
        segment: 'student',
        source: 'CRYPTO',
        status: 'NEW',
        daysAgo: 4,
        utmSource: 'telegram',
        utmCampaign: 'web3_community',
      },
      {
        firstName: 'Amina',
        lastName: 'Bello',
        email: 'amina.bello@example.com',
        phone: '+2348145678901',
        interest: 'BANKING',
        segment: 'individual',
        source: 'HOMEPAGE',
        status: 'CONVERTED',
        daysAgo: 10,
        utmSource: 'direct',
        notes: 'Participated in pre-launch product discovery interview.',
      },
      {
        firstName: 'Kelechi',
        lastName: 'Nwosu',
        email: 'kelechi.nwosu@example.com',
        phone: '+2348167890123',
        interest: 'LOANS',
        segment: 'salary_earner',
        source: 'LOANS',
        status: 'NEW',
        daysAgo: 1,
        utmSource: 'facebook',
        utmCampaign: 'quick_credit',
      },
    ];

    const now = Date.now();
    for (const item of seedData) {
      const createdTime = new Date(now - item.daysAgo * 86400000).toISOString();
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
        country: 'NG',
        utmSource: item.utmSource,
        utmCampaign: item.utmCampaign,
        landingPage: item.source === 'HOMEPAGE' ? '/' : `/services/${item.source.toLowerCase()}`,
        notes: item.notes,
        createdAt: createdTime,
        updatedAt: createdTime,
        ipHash: Buffer.from('127.0.0.1').toString('base64').slice(0, 10),
      });
    }

    this.recordAudit({
      action: 'SYSTEM_INITIALIZED_SEEDED_PROSPECTS',
      actor: 'SYSTEM_BOOTSTRAP',
      details: { seededCount: this.leads.length },
      level: 'INFO',
    });
  }

  /**
   * Process Waitlist Lead (Create New or Safely Update Duplicate)
   */
  public createOrUpdateLead(input: CreateLeadInput): { lead: WaitlistLead; isDuplicate: boolean } {
    const cleanEmail = normalizeEmail(input.email);
    const cleanPhone = normalizePhoneNumber(input.phoneNumber);
    const primaryInterest = normalizeInterest(input.primaryInterest);
    const source = normalizeSource(input.source);
    const now = new Date().toISOString();
    const ipHash = input.ip ? Buffer.from(input.ip).toString('base64').slice(0, 10) : undefined;

    // Check for existing lead by normalized email
    const existingIndex = this.leads.findIndex((lead) => lead.email === cleanEmail);

    if (existingIndex !== -1) {
      const existing = this.leads[existingIndex];
      
      // Update interests list if new interest expressed
      const updatedInterests = Array.from(new Set([...existing.interests, primaryInterest]));
      
      // Update lead record
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
        action: 'LEAD_DUPLICATE_SUBMISSION_CONSOLIDATED',
        actor: 'PUBLIC_PROSPECT',
        targetId: existing.id,
        ipHash,
        details: {
          email: cleanEmail,
          primaryInterest,
          source,
        },
        level: 'INFO',
      });

      return { lead: existing, isDuplicate: true };
    }

    // Create new lead
    const leadId = `LEAD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newLead: WaitlistLead = {
      id: leadId,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: cleanEmail,
      phoneNumber: cleanPhone,
      primaryInterest,
      interests: [primaryInterest],
      customerSegment: input.customerSegment || 'individual',
      consent: Boolean(input.consent),
      consentRecordedAt: now,
      source,
      status: 'NEW',
      country: input.country || 'NG',
      referralCode: input.referralCode,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      utmContent: input.utmContent,
      landingPage: input.landingPage || '/',
      notes: input.notes?.trim(),
      createdAt: now,
      updatedAt: now,
      ipHash,
    };

    this.leads.unshift(newLead);

    this.recordAudit({
      action: 'LEAD_REGISTERED',
      actor: 'PUBLIC_PROSPECT',
      targetId: newLead.id,
      ipHash,
      details: {
        interest: newLead.primaryInterest,
        segment: newLead.customerSegment,
        source: newLead.source,
      },
      level: 'INFO',
    });

    return { lead: newLead, isDuplicate: false };
  }

  /**
   * Search and Filter Leads for Admin Management Interface
   */
  public getLeads(params: LeadFilterParams = {}): {
    leads: WaitlistLead[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    let filtered = [...this.leads];

    // 1. Full-text search (name, email, phone, id, referralCode)
    if (params.q && params.q.trim().length > 0) {
      const q = params.q.trim().toLowerCase();
      filtered = filtered.filter((lead) => {
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const email = lead.email.toLowerCase();
        const phone = (lead.phoneNumber || '').toLowerCase();
        const id = lead.id.toLowerCase();
        const referral = (lead.referralCode || '').toLowerCase();
        const notes = (lead.notes || '').toLowerCase();

        return (
          fullName.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          id.includes(q) ||
          referral.includes(q) ||
          notes.includes(q)
        );
      });
    }

    // 2. Filter by Status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((lead) => lead.status === params.status);
    }

    // 3. Filter by Interest
    if (params.interest && params.interest !== 'ALL') {
      filtered = filtered.filter(
        (lead) =>
          lead.primaryInterest === params.interest ||
          lead.interests.includes(params.interest as InterestCategory)
      );
    }

    // 4. Filter by Source
    if (params.source && params.source !== 'ALL') {
      filtered = filtered.filter((lead) => lead.source.toUpperCase() === params.source?.toUpperCase());
    }

    // 5. Date Range Filtering
    if (params.startDate) {
      const start = new Date(params.startDate).getTime();
      filtered = filtered.filter((lead) => new Date(lead.createdAt).getTime() >= start);
    }
    if (params.endDate) {
      const end = new Date(params.endDate).getTime();
      filtered = filtered.filter((lead) => new Date(lead.createdAt).getTime() <= end);
    }

    // 6. Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === 'name') {
        comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'desc' ? -comparison : comparison;
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
      totalPages,
    };
  }

  /**
   * Get single lead by ID
   */
  public getLeadById(id: string): WaitlistLead | undefined {
    return this.leads.find((lead) => lead.id === id);
  }

  /**
   * Update lead status
   */
  public updateLeadStatus(
    id: string,
    newStatus: LeadStatus,
    note?: string,
    actor = 'ADMINISTRATOR'
  ): WaitlistLead | null {
    const lead = this.leads.find((item) => item.id === id);
    if (!lead) return null;

    const previousStatus = lead.status;
    lead.status = newStatus;
    lead.updatedAt = new Date().toISOString();

    if (note) {
      lead.statusNotes = note.trim();
    }

    this.recordAudit({
      action: 'LEAD_STATUS_UPDATED',
      actor,
      targetId: lead.id,
      details: {
        previousStatus,
        newStatus,
        note: note ? note.slice(0, 100) : undefined,
      },
      level: 'INFO',
    });

    return lead;
  }

  /**
   * Update lead notes
   */
  public updateLeadNotes(id: string, notes: string, actor = 'ADMINISTRATOR'): WaitlistLead | null {
    const lead = this.leads.find((item) => item.id === id);
    if (!lead) return null;

    lead.notes = notes.trim();
    lead.updatedAt = new Date().toISOString();

    this.recordAudit({
      action: 'LEAD_NOTES_UPDATED',
      actor,
      targetId: lead.id,
      details: { noteLength: notes.length },
      level: 'INFO',
    });

    return lead;
  }

  /**
   * Compute Real-Time Acquisition & Waitlist Metrics
   */
  public getAnalyticsSummary(): LeadAnalyticsSummary {
    const totalLeads = this.leads.length;
    let newLeads = 0;
    let contactedLeads = 0;
    let qualifiedLeads = 0;
    let convertedLeads = 0;
    let unsubscribedLeads = 0;

    const byInterest: Record<InterestCategory, number> = {
      BANKING: 0,
      LOANS: 0,
      SAVINGS: 0,
      PAYMENTS: 0,
      INVESTMENTS: 0,
      CRYPTO: 0,
      MERCHANTS: 0,
      AGENTS: 0,
      OTHER: 0,
    };

    const bySource: Record<string, number> = {};
    const bySegment: Record<string, number> = {};

    for (const lead of this.leads) {
      // Status counting
      if (lead.status === 'NEW') newLeads++;
      else if (lead.status === 'CONTACTED') contactedLeads++;
      else if (lead.status === 'QUALIFIED') qualifiedLeads++;
      else if (lead.status === 'CONVERTED') convertedLeads++;
      else if (lead.status === 'UNSUBSCRIBED') unsubscribedLeads++;

      // Interest counting
      byInterest[lead.primaryInterest] = (byInterest[lead.primaryInterest] || 0) + 1;

      // Source counting
      bySource[lead.source] = (bySource[lead.source] || 0) + 1;

      // Segment counting
      bySegment[lead.customerSegment] = (bySegment[lead.customerSegment] || 0) + 1;
    }

    // Daily Trend for last 7 days
    const dailyMap = new Map<string, number>();
    const today = new Date();
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
      count,
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
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Controlled CSV Lead Export
   * Includes formula-injection sanitization (=, +, -, @ prefix protection)
   */
  public exportLeadsCSV(params: LeadFilterParams = {}): string {
    const { leads } = this.getLeads({ ...params, page: 1, pageSize: 5000 });

    const sanitizeCell = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val).replace(/"/g, '""');
      // Neutralize potential CSV formula injection
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };

    const headers = [
      'Reference ID',
      'First Name',
      'Last Name',
      'Email Address',
      'Phone Number',
      'Primary Interest',
      'All Interests',
      'Customer Segment',
      'Status',
      'Acquisition Source',
      'UTM Source',
      'UTM Campaign',
      'Consent Accepted',
      'Registration Date',
      'Last Updated',
    ];

    const rows = leads.map((lead) => [
      sanitizeCell(lead.id),
      sanitizeCell(lead.firstName),
      sanitizeCell(lead.lastName),
      sanitizeCell(lead.email),
      sanitizeCell(lead.phoneNumber || 'N/A'),
      sanitizeCell(lead.primaryInterest),
      sanitizeCell(lead.interests.join(', ')),
      sanitizeCell(lead.customerSegment),
      sanitizeCell(lead.status),
      sanitizeCell(lead.source),
      sanitizeCell(lead.utmSource || 'N/A'),
      sanitizeCell(lead.utmCampaign || 'N/A'),
      sanitizeCell(lead.consent ? 'YES' : 'NO'),
      sanitizeCell(lead.createdAt),
      sanitizeCell(lead.updatedAt),
    ]);

    this.recordAudit({
      action: 'LEAD_CSV_EXPORT_GENERATED',
      actor: 'ADMINISTRATOR',
      details: { exportCount: leads.length },
      level: 'INFO',
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    return csvContent;
  }

  /**
   * Audit Logging
   */
  public recordAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      id: `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  public getAuditLogs(limit = 50): AuditLogEntry[] {
    return this.auditLogs.slice(0, limit);
  }
}

export const leadStore = new LeadStoreService();
