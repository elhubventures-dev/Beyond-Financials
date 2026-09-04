/**
 * Beyond Financials - High-Contrast Desktop Lead Table
 * 
 * Provides a scannable, dense desktop table with status tags, primary interests,
 * acquisition sources, and click-to-inspect actions.
 */

import React from 'react';
import { Badge } from '../ui/Badge';
import { WaitlistLead, LeadStatus } from '../../types/domain';
import {
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface LeadTableProps {
  leads: WaitlistLead[];
  isLoading: boolean;
  onSelectLead: (lead: WaitlistLead) => void;
  onQuickStatusChange?: (leadId: string, status: LeadStatus) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  onSelectLead,
}) => {
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="blue" size="sm">NEW</Badge>;
      case 'CONTACTED':
        return <Badge variant="warning" size="sm">CONTACTED</Badge>;
      case 'QUALIFIED':
        return <Badge variant="info" size="sm">QUALIFIED</Badge>;
      case 'CONVERTED':
        return <Badge variant="success" size="sm">CONVERTED</Badge>;
      case 'UNSUBSCRIBED':
        return <Badge variant="default" size="sm">OPT-OUT</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  const getInterestBadge = (interest: string) => {
    const colors: Record<string, 'blue' | 'emerald' | 'amber' | 'indigo' | 'purple' | 'cyan' | 'default'> = {
      BANKING: 'blue',
      SAVINGS: 'emerald',
      LOANS: 'amber',
      PAYMENTS: 'indigo',
      INVESTMENTS: 'purple',
      CRYPTO: 'cyan',
    };
    return (
      <Badge variant={colors[interest] || 'default'} size="sm">
        {interest}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-medium text-slate-600">Retrieving prospective acquisition leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold font-display text-slate-800">No matching leads found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try adjusting your search criteria or clearing active filters to see all registered prospective users.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Prospect</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Interest</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
              >
                {/* Name and Segment */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-blue-900 flex items-center gap-1.5">
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {lead.id} • <span className="capitalize">{lead.customerSegment?.replace('_', ' ')}</span>
                  </div>
                </td>

                {/* Contact Email & Phone */}
                <td className="py-3.5 px-4">
                  <div className="text-slate-800 font-medium">{lead.email}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    {lead.phoneNumber ? lead.phoneNumber : <span className="text-slate-400">No phone</span>}
                  </div>
                </td>

                {/* Primary Interest */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getInterestBadge(lead.primaryInterest)}
                    {lead.interests.length > 1 && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                        +{lead.interests.length - 1}
                      </span>
                    )}
                  </div>
                </td>

                {/* Source & Attribution */}
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium uppercase tracking-tight">
                    {lead.source}
                  </span>
                  {lead.utmCampaign && (
                    <div className="text-[10px] text-blue-600 font-mono mt-0.5 truncate max-w-[120px]" title={lead.utmCampaign}>
                      {lead.utmCampaign}
                    </div>
                  )}
                </td>

                {/* Controlled Status */}
                <td className="py-3.5 px-4">
                  {getStatusBadge(lead.status)}
                </td>

                {/* Registration Date */}
                <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                  <div>{new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div className="text-[10px] text-slate-400">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </td>

                {/* View Action */}
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center text-xs font-semibold text-blue-700 group-hover:text-blue-900 gap-1">
                    Details
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
