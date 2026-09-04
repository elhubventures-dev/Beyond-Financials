/**
 * Beyond Financials - Lead Detail Inspector & Status Management Drawer
 * 
 * Provides full acquisition profile inspection, UTM attribution breakdown,
 * and server-validated status transitions.
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { WaitlistLead, LeadStatus } from '../../types/domain';
import {
  Mail,
  Phone,
  Calendar,
  Globe,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Edit3,
  Save,
  Clock,
  Sparkles,
  UserCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: WaitlistLead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (leadId: string, newStatus: LeadStatus, note?: string) => Promise<void>;
  onNotesUpdate: (leadId: string, notes: string) => Promise<void>;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onStatusUpdate,
  onNotesUpdate,
}) => {
  if (!lead) return null;

  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status);
  const [statusNote, setStatusNote] = useState<string>(lead.statusNotes || '');
  const [adminNotes, setAdminNotes] = useState<string>(lead.notes || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingNotes, setIsUpdatingNotes] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveStatus = async () => {
    setIsUpdatingStatus(true);
    setFeedbackMessage(null);
    try {
      await onStatusUpdate(lead.id, selectedStatus, statusNote);
      setFeedbackMessage({ type: 'success', text: `Status successfully updated to ${selectedStatus}.` });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to update status.' });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsUpdatingNotes(true);
    setFeedbackMessage(null);
    try {
      await onNotesUpdate(lead.id, adminNotes);
      setFeedbackMessage({ type: 'success', text: 'Internal administrative notes saved.' });
    } catch (err: any) {
      setFeedbackMessage({ type: 'error', text: err.message || 'Failed to update notes.' });
    } finally {
      setIsUpdatingNotes(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="blue" size="sm">NEW LEAD</Badge>;
      case 'CONTACTED':
        return <Badge variant="warning" size="sm">CONTACTED</Badge>;
      case 'QUALIFIED':
        return <Badge variant="info" size="sm">QUALIFIED</Badge>;
      case 'CONVERTED':
        return <Badge variant="success" size="sm">CONVERTED (EARLY ACCESS)</Badge>;
      case 'UNSUBSCRIBED':
        return <Badge variant="default" size="sm">UNSUBSCRIBED</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${lead.firstName} ${lead.lastName}`}
      subtitle={`Acquisition Reference: ${lead.id}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Feedback Alert */}
        {feedbackMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Top Header Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold font-display text-slate-900">
                {lead.firstName} {lead.lastName}
              </span>
              {getStatusBadge(lead.status)}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Customer Segment: <strong className="capitalize text-slate-800">{lead.customerSegment?.replace('_', ' ')}</strong> • Country: <strong className="text-slate-800">{lead.country || 'NG'}</strong>
            </p>
          </div>

          <div className="text-right text-[11px] text-slate-500">
            <div>Registered: <strong>{new Date(lead.createdAt).toLocaleString()}</strong></div>
            <div>Last Activity: <strong>{new Date(lead.updatedAt).toLocaleString()}</strong></div>
          </div>
        </div>

        {/* 2-Column Grid: Contact & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Details */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              Contact Information
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email Address</span>
                <span className="font-mono text-slate-800 font-medium">{lead.email}</span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phone Number</span>
                <span className="font-mono text-slate-800 font-medium">
                  {lead.phoneNumber || 'Not provided'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consent Verification</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Explicit opt-in recorded on {new Date(lead.consentRecordedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Status Lifecycle Controller */}
          <div className="bg-white border border-blue-100 rounded-xl p-4 space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Manage Lead Status
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Controlled Lifecycle Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as LeadStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="NEW">NEW - Newly registered lead</option>
                  <option value="CONTACTED">CONTACTED - Outreach commenced</option>
                  <option value="QUALIFIED">QUALIFIED - High readiness / validated need</option>
                  <option value="CONVERTED">CONVERTED - Early access invitation issued</option>
                  <option value="UNSUBSCRIBED">UNSUBSCRIBED - Opted out</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Status Transition Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sent early discovery survey link..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveStatus}
                isLoading={isUpdatingStatus}
                className="w-full"
                rightIcon={<Save className="w-3.5 h-3.5" />}
              >
                Update Lead Status
              </Button>
            </div>
          </div>
        </div>

        {/* Product Interests & Expressed Demand */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            Product Interests & Intent
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="blue" size="md">
              Primary: {lead.primaryInterest}
            </Badge>
            {lead.interests.map((int, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                {int}
              </span>
            ))}
          </div>
        </div>

        {/* Marketing Attribution & Inbound Metadata */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            Acquisition Attribution
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Source</span>
              <span className="font-mono font-medium text-slate-800">{lead.source}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Landing Page</span>
              <span className="font-mono font-medium text-slate-800 truncate block" title={lead.landingPage || '/'}>
                {lead.landingPage || '/'}
              </span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">UTM Campaign</span>
              <span className="font-mono font-medium text-slate-800">{lead.utmCampaign || 'None'}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Referral Code</span>
              <span className="font-mono font-medium text-slate-800">{lead.referralCode || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Administrative Internal Notes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-purple-600" />
              Administrative Internal Notes
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveNotes}
              isLoading={isUpdatingNotes}
              rightIcon={<Save className="w-3 h-3" />}
            >
              Save Notes
            </Button>
          </div>

          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about lead requirements, conversation points, or onboarding priority..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Data Privacy Disclaimer */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Data Privacy Rule:</strong> Waitlist records strictly contain non-sensitive acquisition leads. Sensitive financial credentials (BVN, NIN, PINs, passwords) are prohibited.
          </span>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Close Detail
          </Button>
        </div>
      </div>
    </Modal>
  );
};
