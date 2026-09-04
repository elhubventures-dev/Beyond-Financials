/**
 * Beyond Financials - Lead Management Search & Filtering Toolbar
 * 
 * Provides responsive multi-attribute filtering for administrators.
 */

import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { LeadFilterParams, LeadStatus, InterestCategory, AcquisitionSource } from '../../types/domain';

interface LeadFiltersToolbarProps {
  filters: LeadFilterParams;
  onFilterChange: (updated: Partial<LeadFilterParams>) => void;
  onReset: () => void;
  totalResults: number;
}

export const LeadFiltersToolbar: React.FC<LeadFiltersToolbarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalResults,
}) => {
  const statusOptions: Array<{ value: LeadStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'NEW', label: 'New Lead' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'CONVERTED', label: 'Converted' },
    { value: 'UNSUBSCRIBED', label: 'Unsubscribed' },
  ];

  const interestOptions: Array<{ value: InterestCategory | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All Interests' },
    { value: 'BANKING', label: 'Digital Banking' },
    { value: 'SAVINGS', label: 'Smart Savings' },
    { value: 'LOANS', label: 'Loans & Credit' },
    { value: 'PAYMENTS', label: 'Bill Payments' },
    { value: 'INVESTMENTS', label: 'Investments (Future)' },
    { value: 'CRYPTO', label: 'Crypto Assets (Future)' },
    { value: 'MERCHANTS', label: 'Merchant Services' },
    { value: 'AGENTS', label: 'Agency Banking' },
    { value: 'OTHER', label: 'Other Interests' },
  ];

  const sourceOptions: Array<{ value: AcquisitionSource | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All Sources' },
    { value: 'HOMEPAGE', label: 'Homepage' },
    { value: 'SERVICES', label: 'Services Hub' },
    { value: 'BANKING', label: 'Banking Page' },
    { value: 'SAVINGS', label: 'Savings Page' },
    { value: 'LOANS', label: 'Loans Page' },
    { value: 'PAYMENTS', label: 'Payments Page' },
    { value: 'INVESTMENTS', label: 'Investments Page' },
    { value: 'CRYPTO', label: 'Crypto Page' },
    { value: 'CONTACT', label: 'Contact Form' },
    { value: 'CAMPAIGN', label: 'Marketing Campaign' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'DIRECT', label: 'Direct Traffic' },
  ];

  const isFiltered =
    Boolean(filters.q) ||
    (filters.status && filters.status !== 'ALL') ||
    (filters.interest && filters.interest !== 'ALL') ||
    (filters.source && filters.source !== 'ALL') ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      {/* Search and Primary Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Full Text Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="admin-lead-search"
            placeholder="Search by name, email, phone, or ID..."
            value={filters.q || ''}
            onChange={(e) => onFilterChange({ q: e.target.value, page: 1 })}
            className="w-full pl-9.5 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2">
          <select
            id="admin-filter-status"
            aria-label="Filter by Status"
            value={filters.status || 'ALL'}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as LeadStatus | 'ALL',
                page: 1,
              })
            }
            className="w-full px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Interest Filter */}
        <div className="md:col-span-2">
          <select
            id="admin-filter-interest"
            aria-label="Filter by Interest"
            value={filters.interest || 'ALL'}
            onChange={(e) =>
              onFilterChange({
                interest: e.target.value as InterestCategory | 'ALL',
                page: 1,
              })
            }
            className="w-full px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
          >
            {interestOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div className="md:col-span-2">
          <select
            id="admin-filter-source"
            aria-label="Filter by Source"
            value={filters.source || 'ALL'}
            onChange={(e) =>
              onFilterChange({
                source: e.target.value as AcquisitionSource | 'ALL',
                page: 1,
              })
            }
            className="w-full px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer"
          >
            {sourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort and Reset */}
        <div className="md:col-span-2 flex items-center gap-2 justify-end">
          <select
            id="admin-sort-by"
            aria-label="Sort Order"
            value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              onFilterChange({
                sortBy: sortBy as 'createdAt' | 'updatedAt' | 'name' | 'status',
                sortOrder: sortOrder as 'asc' | 'desc',
              });
            }}
            className="px-2.5 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="status-asc">Status</option>
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
              aria-label="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Sub-bar */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>
            Found <strong className="text-slate-900">{totalResults}</strong> prospective lead{totalResults === 1 ? '' : 's'}
          </span>
          {isFiltered && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-medium">
              <Filter className="w-3 h-3" /> Filters active
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-400">
          Showing page {filters.page || 1}
        </div>
      </div>
    </div>
  );
};
