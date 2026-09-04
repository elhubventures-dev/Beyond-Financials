/**
 * Beyond Financials - Administrative Workspace Header
 * 
 * Provides global navigation, export triggers, and security controls.
 */

import React from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BrandLogo } from '../ui/BrandLogo';
import {
  ShieldCheck,
  Download,
  RefreshCw,
  Lock,
  ExternalLink,
  Activity,
  Key,
  Layers,
} from 'lucide-react';
import { Link } from '../../router/Router';

interface AdminHeaderProps {
  onExport: () => void;
  onRefresh: () => void;
  onToggleAudit: () => void;
  isAuditOpen: boolean;
  onOpenAuth: () => void;
  isExporting: boolean;
  isRefreshing: boolean;
  totalLeadsCount: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onExport,
  onRefresh,
  onToggleAudit,
  isAuditOpen,
  onOpenAuth,
  isExporting,
  isRefreshing,
  totalLeadsCount,
}) => {
  return (
    <div className="bg-[#001B40] text-white border-b border-blue-900/60 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <BrandLogo variant="icon-only" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-tight text-white group-hover:text-blue-200 transition-colors">
                  Beyond Financials
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-semibold uppercase tracking-wider border border-blue-400/30">
                  Lead Desk
                </span>
              </div>
              <p className="text-[11px] text-blue-200/70">
                Pre-Launch Prospective User Acquisition System
              </p>
            </div>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Audit Toggle */}
          <Button
            variant={isAuditOpen ? 'accent' : 'ghost'}
            size="sm"
            onClick={onToggleAudit}
            className={isAuditOpen ? '' : 'text-blue-200 hover:text-white hover:bg-blue-900/50'}
            leftIcon={<Activity className="w-3.5 h-3.5" />}
          >
            Audit Trail
          </Button>

          {/* Refresh Action */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            isLoading={isRefreshing}
            className="text-blue-200 hover:text-white hover:bg-blue-900/50"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>

          {/* Export CSV Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={onExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="bg-[#0046AD] hover:bg-blue-600 text-white"
          >
            Export CSV
          </Button>

          {/* Security Key Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAuth}
            className="border-blue-700/60 text-blue-200 hover:text-white hover:bg-blue-900/40 text-xs"
            leftIcon={<Key className="w-3.5 h-3.5 text-[#FBBF24]" />}
          >
            Access Key
          </Button>

          {/* Return to Public Website */}
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-900/40 transition-colors font-medium ml-1"
          >
            Public Site <ExternalLink className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
