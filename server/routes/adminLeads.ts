/**
 * Beyond Financials - Protected Administrative Lead Management API Routes
 * Route Prefix: /api/admin
 * 
 * SECURITY CONTROLS:
 * - Server-enforced authentication via adminAuthMiddleware
 * - Controlled status updates (NEW | CONTACTED | QUALIFIED | CONVERTED | UNSUBSCRIBED)
 * - Safe CSV exports with formula injection neutralization
 * - PII-minimized administrative audit logging
 */

import { Router, Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';
import { adminAuthMiddleware, ADMIN_API_KEY } from '../middleware/adminAuth';
import {
  leadStore,
  VALID_LEAD_STATUSES,
  VALID_INTEREST_CATEGORIES,
} from '../services/leadStore';
import { LeadStatus, InterestCategory, AcquisitionSource } from '../types';

export const adminRouter = Router();

/**
 * Admin Authentication Verification Endpoint
 * Validates key without exposing secrets
 */
adminRouter.post('/auth/verify', (req: Request, res: Response) => {
  const { adminKey } = req.body;
  const headerKey = req.headers['x-admin-key'];
  const token = typeof adminKey === 'string' ? adminKey.trim() : (typeof headerKey === 'string' ? headerKey.trim() : '');

  const isValid = token === ADMIN_API_KEY;

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid administrator access key for Beyond Financials lead management.',
      data: { authenticated: false },
      timestamp: new Date().toISOString(),
    });
  }

  return res.json({
    success: true,
    message: 'Administrator session authenticated.',
    data: {
      authenticated: true,
      role: 'ACQUISITION_ADMIN',
      environment: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  });
});

// Enforce auth middleware on all subsequent /api/admin/* endpoints
adminRouter.use(adminAuthMiddleware);

/**
 * GET /api/admin/leads
 * Query leads with full-text search, multi-filters, and pagination
 */
adminRouter.get('/leads', (req: Request, res: Response, next: NextFunction) => {
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
      pageSize = 20,
    } = req.query;

    const filterStatus = status && VALID_LEAD_STATUSES.includes(status as LeadStatus)
      ? (status as LeadStatus)
      : status === 'ALL'
      ? 'ALL'
      : undefined;

    const filterInterest = interest && VALID_INTEREST_CATEGORIES.includes(interest as InterestCategory)
      ? (interest as InterestCategory)
      : interest === 'ALL'
      ? 'ALL'
      : undefined;

    const result = leadStore.getLeads({
      q: typeof q === 'string' ? q : undefined,
      status: filterStatus,
      interest: filterInterest,
      source: typeof source === 'string' ? (source as AcquisitionSource) : undefined,
      startDate: typeof startDate === 'string' ? startDate : undefined,
      endDate: typeof endDate === 'string' ? endDate : undefined,
      sortBy: typeof sortBy === 'string' && ['createdAt', 'updatedAt', 'name', 'status'].includes(sortBy)
        ? (sortBy as 'createdAt' | 'updatedAt' | 'name' | 'status')
        : 'createdAt',
      sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
      page: Number(page),
      pageSize: Number(pageSize),
    });

    res.json({
      success: true,
      message: 'Leads retrieved successfully.',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/leads/stats
 * Acquisition Metrics & Distribution Overview
 */
adminRouter.get('/leads/stats', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = leadStore.getAnalyticsSummary();
    res.json({
      success: true,
      message: 'Acquisition analytics summary.',
      data: summary,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/leads/export
 * Download CSV export of filtered leads
 */
adminRouter.get('/leads/export', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, status, interest, source, startDate, endDate } = req.query;

    const csvData = leadStore.exportLeadsCSV({
      q: typeof q === 'string' ? q : undefined,
      status: status as LeadStatus | 'ALL',
      interest: interest as InterestCategory | 'ALL',
      source: source as AcquisitionSource | 'ALL',
      startDate: typeof startDate === 'string' ? startDate : undefined,
      endDate: typeof endDate === 'string' ? endDate : undefined,
    });

    const filename = `beyond-financials-leads-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/leads/:id
 * Retrieve individual lead detail
 */
adminRouter.get('/leads/:id', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lead = leadStore.getLeadById(id);

    if (!lead) {
      throw new AppError(`Waitlist lead with reference ID '${id}' not found.`, 404, 'LEAD_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Lead detail retrieved.',
      data: lead,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/leads/:id/status
 * Update lead status with audit logging
 */
adminRouter.patch('/leads/:id/status', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!status || !VALID_LEAD_STATUSES.includes(status as LeadStatus)) {
      throw new AppError(
        `Invalid status. Must be one of: ${VALID_LEAD_STATUSES.join(', ')}`,
        422,
        'INVALID_STATUS'
      );
    }

    const updatedLead = leadStore.updateLeadStatus(
      id,
      status as LeadStatus,
      typeof note === 'string' ? note : undefined,
      'ADMINISTRATOR'
    );

    if (!updatedLead) {
      throw new AppError(`Waitlist lead with reference ID '${id}' not found.`, 404, 'LEAD_NOT_FOUND');
    }

    res.json({
      success: true,
      message: `Lead status updated to ${status}.`,
      data: updatedLead,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/admin/leads/:id/notes
 * Update administrative internal notes for a lead
 */
adminRouter.patch('/leads/:id/notes', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    if (typeof notes !== 'string') {
      throw new AppError('Notes content must be a string.', 422, 'INVALID_NOTES');
    }

    const updatedLead = leadStore.updateLeadNotes(id, notes, 'ADMINISTRATOR');

    if (!updatedLead) {
      throw new AppError(`Waitlist lead with reference ID '${id}' not found.`, 404, 'LEAD_NOT_FOUND');
    }

    res.json({
      success: true,
      message: 'Lead notes updated.',
      data: updatedLead,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/admin/audit-logs
 * Retrieve recent administrative audit trail entries
 */
adminRouter.get('/audit-logs', (_req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = leadStore.getAuditLogs(50);
    res.json({
      success: true,
      message: 'Administrative audit logs retrieved.',
      data: logs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});
