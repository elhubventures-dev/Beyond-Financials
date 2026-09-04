/**
 * Beyond Financials - Responsive Mobile & Tablet Lead Card List
 * 
 * Provides touch-friendly, card-based rendering for smaller screen sizes.
 */

import React from 'react';
import { Badge } from '../ui/Badge';
import { WaitlistLead, LeadStatus } from '../../types/domain';
import { Mail, Phone, Calendar, ChevronRight, Globe } from 'lucide-react';

interface LeadCardListProps {
  leads: WaitlistLead[];
  isLoading: boolean;
  onSelectLead: (lead: WaitlistLead) => void;
}

export const LeadCardList: React.FC<LeadCardListProps> = ({
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
        <Mail className="w-8 h-8 text-slate-400 mx-auto" />
        <p className="text-sm font-bold text-slate-800">No matching leads found</p>
        <p className="text-xs text-slate-500">Try adjusting your active filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <div
          key={lead.id}
          onClick={() => onSelectLead(lead)}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-blue-300 transition-all cursor-pointer active:bg-slate-50 space-y-3"
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {lead.firstName} {lead.lastName}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{lead.id}</p>
            </div>
            {getStatusBadge(lead.status)}
          </div>

          {/* Contact Details */}
          <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
            {lead.phoneNumber && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span>{lead.phoneNumber}</span>
              </div>
            )}
          </div>

          {/* Footer Attributes */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="blue" size="sm">
                {lead.primaryInterest}
              </Badge>
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono uppercase">
                {lead.source}
              </span>
            </div>

            <span className="flex items-center text-blue-700 font-semibold gap-0.5">
              View <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
