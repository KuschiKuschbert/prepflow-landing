'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import type { SupportTicket } from '../types';
import { SEVERITY_COLORS, STATUS_COLORS, TYPE_COLORS } from '../constants';
import { logger } from '@/lib/logger';

interface TicketDetailModalProps {
  ticket: SupportTicket | null;
  updatingStatus: string | null;
  onClose: () => void;
  onSaveNotes: (ticketId: string, notes: string) => Promise<SupportTicket | null>;
  onLinkError: (ticketId: string, errorId: string) => Promise<SupportTicket | null>;
}

/**
 * Ticket detail modal component for admin dashboard.
 * Displays detailed information about a support ticket with admin notes and error linking.
 *
 * @component
 * @param {TicketDetailModalProps} props - Component props
 * @param {SupportTicket | null} props.ticket - Support ticket to display
 * @param {string | null} props.updatingStatus - ID of ticket being updated
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onSaveNotes - Callback to save admin notes
 * @param {Function} props.onLinkError - Callback to link ticket to error log
 * @returns {JSX.Element} Ticket detail modal component
 */
export function TicketDetailModal({
  ticket,
  updatingStatus,
  onClose,
  onSaveNotes,
  onLinkError,
}: TicketDetailModalProps) {
  const [adminNotes, setAdminNotes] = useState('');
  const [linkErrorId, setLinkErrorId] = useState('');

  useEffect(() => {
    if (ticket) {
      setAdminNotes(ticket.admin_notes || '');
      setLinkErrorId(ticket.related_error_id || '');
    }
  }, [ticket]);

  if (!ticket) return null;

  const handleSaveNotes = async () => {
    try {
      const updated = await onSaveNotes(ticket.id, adminNotes);
      if (updated) {
        // Notes saved successfully, modal will update via parent
      }
    } catch (err) {
      logger.error('[TicketDetailModal] Error saving notes:', {
        error: err instanceof Error ? err.message : String(err),
        ticketId: ticket.id,
      });
    }
  };

  const handleLinkError = async () => {
    if (!linkErrorId) return;
    try {
      const updated = await onLinkError(ticket.id, linkErrorId);
      if (updated) {
        setLinkErrorId('');
      }
    } catch (err) {
      logger.error('[TicketDetailModal] Error linking error:', {
        error: err instanceof Error ? err.message : String(err),
        ticketId: ticket.id,
        errorId: linkErrorId,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-50 max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Ticket Details</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">User Email</label>
              <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-white">
                {ticket.user_email}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Type</label>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${TYPE_COLORS[ticket.type] || TYPE_COLORS.other}`}
              >
                {ticket.type}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-400">Severity</label>
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${SEVERITY_COLORS[ticket.severity] || SEVERITY_COLORS.medium}`}
              >
                {ticket.severity}
              </span>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-400">Status</label>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}
              >
                {ticket.status}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Subject</label>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-white">
              {ticket.subject}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-400">Message</label>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 whitespace-pre-wrap text-white">
              {ticket.message}
            </div>
          </div>
          {ticket.related_error_id && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Related Error</label>
              <Link
                href={`/admin/errors?search=${ticket.related_error_id}`}
                className="inline-flex items-center gap-2 text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
              >
                <Icon icon={LinkIcon} size="sm" />
                View Error Log
              </Link>
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">
              Link to Error Log
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkErrorId}
                onChange={e => setLinkErrorId(e.target.value)}
                placeholder="Error log ID (UUID)"
                className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:outline-none"
              />
              <button
                onClick={handleLinkError}
                disabled={updatingStatus === ticket.id || !linkErrorId}
                className="rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Link
              </button>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-400">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="Add notes about this ticket..."
              className="min-h-[100px] w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-white placeholder-gray-500 focus:border-[#29E7CD] focus:outline-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={updatingStatus === ticket.id}
              className="mt-2 rounded-lg bg-gradient-to-r from-[#29E7CD] to-[#D925C7] px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {updatingStatus === ticket.id ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-400">Created At</label>
              <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-white">
                {new Date(ticket.created_at).toLocaleString()}
              </div>
            </div>
            {ticket.resolved_at && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-400">Resolved At</label>
                <div className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] p-4 text-white">
                  {new Date(ticket.resolved_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
