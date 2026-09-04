/**
 * Beyond Financials - Administrative Audit Trail Viewer
 * 
 * Inspects system and administrative actions in real time.
 */

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, Activity, Clock, User } from 'lucide-react';

export interface AuditLogEntryView {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  targetId?: string;
  details?: Record<string, unknown>;
  level: 'INFO' | 'WARN' | 'SECURITY';
}

interface AdminAuditViewProps {
  logs: AuditLogEntryView[];
  isLoading: boolean;
}

export const AdminAuditView: React.FC<AdminAuditViewProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center animate-pulse">
        <p className="text-xs text-slate-500">Loading audit trail...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
        No administrative actions recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          Administrative & Acquisition Audit Trail
        </h4>
        <span className="text-[11px] text-slate-500 font-mono">Last 50 events</span>
      </div>

      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-slate-800">{log.action}</span>
                <Badge
                  variant={log.level === 'SECURITY' ? 'rose' : log.level === 'WARN' ? 'warning' : 'blue'}
                  size="sm"
                >
                  {log.level}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Actor: {log.actor}
              </span>
              {log.targetId && (
                <span>Target: <strong>{log.targetId}</strong></span>
              )}
            </div>

            {log.details && Object.keys(log.details).length > 0 && (
              <pre className="text-[10px] text-slate-600 bg-slate-100/80 p-1.5 rounded font-mono overflow-x-auto">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
