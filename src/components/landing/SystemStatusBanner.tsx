import React, { useState, useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { Activity, Server, ShieldCheck, Terminal, RefreshCw } from 'lucide-react';
import { SystemHealthStatus } from '../../types/domain';

interface SystemStatusBannerProps {
  onStatusChange?: (healthy: boolean) => void;
}

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = ({ onStatusChange }) => {
  const [healthData, setHealthData] = useState<SystemHealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      const json = await res.json();
      if (res.ok && json.success) {
        setHealthData(json.data);
        onStatusChange?.(true);
      } else {
        setError('Gateway returned non-healthy status.');
        onStatusChange?.(false);
      }
    } catch (err: any) {
      setError('Unable to connect to Express backend.');
      onStatusChange?.(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-mono text-slate-400">
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <strong className="text-slate-200">Gateway:</strong> {healthData?.service || 'beyond-financials-api'}
          </span>
          <span className="hidden sm:inline-block text-slate-600">&bull;</span>
          <span className="hidden sm:inline-flex items-center gap-1 font-mono text-slate-400">
            <strong>Target:</strong> beyondfinancials.ng
          </span>
          <span className="hidden md:inline-block text-slate-600">&bull;</span>
          <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
            <strong>Phase 1:</strong> ₦3.5M / 8–10 Weeks Scope
          </span>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <span className="flex items-center gap-1.5 text-slate-400 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
              <span>Verifying gateway...</span>
            </span>
          ) : error ? (
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{error}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">Full-Stack Server Active</span>
              <span className="text-slate-400 font-mono text-[11px]">(Mock Adapters)</span>
            </span>
          )}

          <button
            onClick={fetchHealth}
            title="Refresh System Status"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Refresh gateway status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
