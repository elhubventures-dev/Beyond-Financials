/**
 * Beyond Financials - Protected Administrative Lead Management System
 * Route: /admin/leads (and /admin)
 * 
 * SCOPE:
 * - Pre-launch prospective user acquisition workspace
 * - Search, filter, status lifecycle transitions, CSV export, and acquisition metrics
 * - Non-sensitive data collection ONLY (no banking, no KYC, no financial credentials)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { LeadAnalyticsDashboard } from '../../components/admin/LeadAnalyticsDashboard';
import { LeadFiltersToolbar } from '../../components/admin/LeadFiltersToolbar';
import { LeadTable } from '../../components/admin/LeadTable';
import { LeadCardList } from '../../components/admin/LeadCardList';
import { LeadDetailDrawer } from '../../components/admin/LeadDetailDrawer';
import { AdminAuthModal } from '../../components/admin/AdminAuthModal';
import { AdminAuditView, AuditLogEntryView } from '../../components/admin/AdminAuditView';
import { Button } from '../../components/ui/Button';
import {
  WaitlistLead,
  LeadFilterParams,
  LeadAnalyticsSummary,
  LeadStatus,
  InterestCategory,
} from '../../types/domain';
import {
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Lock,
  Download,
  Activity,
  Layers,
  Key,
} from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  // Authentication State
  const [adminKey, setAdminKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('bf_admin_key') || 'bf_admin_dev_key_2026';
    }
    return 'bf_admin_dev_key_2026';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Leads & Analytics State
  const [leads, setLeads] = useState<WaitlistLead[]>([]);
  const [summary, setSummary] = useState<LeadAnalyticsSummary | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntryView[]>([]);
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Active Filters & Pagination
  const [filters, setFilters] = useState<LeadFilterParams>({
    q: '',
    status: 'ALL',
    interest: 'ALL',
    source: 'ALL',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    pageSize: 15,
  });

  // UI / Action State
  const [isLoadingLeads, setIsLoadingLeads] = useState<boolean>(false);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(false);
  const [isLoadingAudit, setIsLoadingAudit] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<WaitlistLead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper: Get Auth Headers
  const getAuthHeaders = useCallback(() => {
    return {
      'Content-Type': 'application/json',
      'x-admin-key': adminKey,
    };
  }, [adminKey]);

  // Fetch Leads List
  const fetchLeads = useCallback(async () => {
    if (!adminKey) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsLoadingLeads(true);
    setErrorMessage(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters.q) queryParams.set('q', filters.q);
      if (filters.status && filters.status !== 'ALL') queryParams.set('status', filters.status);
      if (filters.interest && filters.interest !== 'ALL') queryParams.set('interest', filters.interest);
      if (filters.source && filters.source !== 'ALL') queryParams.set('source', filters.source);
      if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.set('sortOrder', filters.sortOrder);
      if (filters.page) queryParams.set('page', String(filters.page));
      if (filters.pageSize) queryParams.set('pageSize', String(filters.pageSize));

      const response = await fetch(`/api/admin/leads?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        setIsAuthModalOpen(true);
        throw new Error('Unauthorized: Please verify your administrator access credentials.');
      }

      const result = await response.json();
      if (response.ok && result.success) {
        setLeads(result.data.leads || []);
        setTotalLeads(result.data.total || 0);
        setTotalPages(result.data.totalPages || 1);
        setIsAuthenticated(true);
      } else {
        throw new Error(result.message || 'Failed to fetch leads.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with lead management server.');
    } finally {
      setIsLoadingLeads(false);
    }
  }, [adminKey, filters, getAuthHeaders]);

  // Fetch Analytics Summary
  const fetchSummary = useCallback(async () => {
    if (!adminKey) return;
    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/admin/leads/stats', {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSummary(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics summary:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, [adminKey, getAuthHeaders]);

  // Fetch Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    if (!adminKey) return;
    setIsLoadingAudit(true);
    try {
      const response = await fetch('/api/admin/audit-logs', {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setAuditLogs(result.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoadingAudit(false);
    }
  }, [adminKey, getAuthHeaders]);

  useEffect(() => {
    fetchLeads();
    fetchSummary();
  }, [fetchLeads, fetchSummary]);

  useEffect(() => {
    if (isAuditOpen) {
      fetchAuditLogs();
    }
  }, [isAuditOpen, fetchAuditLogs]);

  // Handle Filter Changes
  const handleFilterChange = (updated: Partial<LeadFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      status: 'ALL',
      interest: 'ALL',
      source: 'ALL',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      pageSize: 15,
    });
  };

  // Handle Lead Selection
  const handleSelectLead = (lead: WaitlistLead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  // Handle Status Update
  const handleStatusUpdate = async (leadId: string, newStatus: LeadStatus, note?: string) => {
    const response = await fetch(`/api/admin/leads/${leadId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus, note }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to update lead status.');
    }

    // Refresh lead in local list
    setLeads((prev) => prev.map((l) => (l.id === leadId ? result.data : l)));
    setSelectedLead(result.data);
    fetchSummary();
  };

  // Handle Notes Update
  const handleNotesUpdate = async (leadId: string, notes: string) => {
    const response = await fetch(`/api/admin/leads/${leadId}/notes`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ notes }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to update lead notes.');
    }

    setLeads((prev) => prev.map((l) => (l.id === leadId ? result.data : l)));
    setSelectedLead(result.data);
  };

  // Handle CSV Export
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.q) queryParams.set('q', filters.q);
      if (filters.status && filters.status !== 'ALL') queryParams.set('status', filters.status);
      if (filters.interest && filters.interest !== 'ALL') queryParams.set('interest', filters.interest);
      if (filters.source && filters.source !== 'ALL') queryParams.set('source', filters.source);

      const response = await fetch(`/api/admin/leads/export?${queryParams.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CSV export.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beyond-financials-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Header Bar */}
      <AdminHeader
        onExport={handleExportCSV}
        onRefresh={() => {
          fetchLeads();
          fetchSummary();
        }}
        onToggleAudit={() => setIsAuditOpen(!isAuditOpen)}
        isAuditOpen={isAuditOpen}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isExporting={isExporting}
        isRefreshing={isLoadingLeads}
        totalLeadsCount={totalLeads}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-bold">Authentication / Server Notice</p>
              <p>{errorMessage}</p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="font-semibold underline text-rose-800 hover:text-rose-950 mt-1 cursor-pointer"
              >
                Re-enter Administrator Credentials
              </button>
            </div>
          </div>
        )}

        {/* Analytics Overview Section */}
        <LeadAnalyticsDashboard
          summary={summary}
          isLoading={isLoadingStats}
          onFilterInterest={(int) => handleFilterChange({ interest: int, page: 1 })}
          onFilterStatus={(stat) => handleFilterChange({ status: stat as LeadStatus | 'ALL', page: 1 })}
        />

        {/* Audit Log Panel (Toggleable) */}
        {isAuditOpen && (
          <AdminAuditView logs={auditLogs} isLoading={isLoadingAudit} />
        )}

        {/* Search and Filters Toolbar */}
        <LeadFiltersToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          totalResults={totalLeads}
        />

        {/* Lead Table (Desktop) / Card List (Mobile) */}
        <div>
          <div className="hidden md:block">
            <LeadTable
              leads={leads}
              isLoading={isLoadingLeads}
              onSelectLead={handleSelectLead}
            />
          </div>
          <div className="block md:hidden">
            <LeadCardList
              leads={leads}
              isLoading={isLoadingLeads}
              onSelectLead={handleSelectLead}
            />
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div className="text-xs text-slate-500">
              Page <strong className="text-slate-900">{filters.page || 1}</strong> of <strong className="text-slate-900">{totalPages}</strong>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page || 1) <= 1 || isLoadingLeads}
                onClick={() => handleFilterChange({ page: Math.max(1, (filters.page || 1) - 1) })}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={(filters.page || 1) >= totalPages || isLoadingLeads}
                onClick={() => handleFilterChange({ page: (filters.page || 1) + 1 })}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Modal / Slide-over */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedLead(null);
        }}
        onStatusUpdate={handleStatusUpdate}
        onNotesUpdate={handleNotesUpdate}
      />

      {/* Admin Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticated={(key) => {
          setAdminKey(key);
          setIsAuthenticated(true);
          setErrorMessage(null);
        }}
      />
    </div>
  );
};
