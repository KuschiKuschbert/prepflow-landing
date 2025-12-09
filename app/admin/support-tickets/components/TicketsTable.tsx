'use client';

import { Icon } from '@/components/ui/Icon';
import { CheckCircle, Clock, Eye, MessageSquare, XCircle } from 'lucide-react';
import type { SupportTicket } from '../types';
import { SEVERITY_COLORS, STATUS_COLORS, TYPE_COLORS } from '../constants';

interface TicketsTableProps {
  tickets: SupportTicket[];
  updatingStatus: string | null;
  onStatusUpdate: (ticketId: string, newStatus: string) => void;
  onViewDetails: (ticket: SupportTicket) => void;
}

/**
 * Support tickets table component for admin dashboard.
 * Displays support tickets with severity, status, type, and action buttons.
 *
 * @component
 * @param {TicketsTableProps} props - Component props
 * @param {SupportTicket[]} props.tickets - Array of support tickets to display
 * @param {string | null} props.updatingStatus - ID of ticket currently being updated
 * @param {Function} props.onStatusUpdate - Callback when ticket status is updated
 * @param {Function} props.onViewDetails - Callback when ticket details are viewed
 * @returns {JSX.Element} Support tickets table component
 */
export function TicketsTable({
  tickets,
  updatingStatus,
  onStatusUpdate,
  onViewDetails,
}: TicketsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <table className="min-w-full divide-y divide-[#2a2a2a]">
        <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Severity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-300 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
          {tickets.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map(ticket => (
              <tr key={ticket.id} className="transition-colors hover:bg-[#2a2a2a]/20">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Icon icon={MessageSquare} size="sm" className="text-[#29E7CD]" />
                    <div className="max-w-md">
                      <div className="truncate text-sm font-medium text-white">
                        {ticket.subject}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">{ticket.user_email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[ticket.type] || TYPE_COLORS.other}`}
                  >
                    {ticket.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${SEVERITY_COLORS[ticket.severity] || SEVERITY_COLORS.medium}`}
                  >
                    {ticket.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[ticket.status] || STATUS_COLORS.open}`}
                  >
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {new Date(ticket.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {ticket.status === 'open' && (
                      <button
                        onClick={() => onStatusUpdate(ticket.id, 'investigating')}
                        disabled={updatingStatus === ticket.id}
                        className="text-yellow-400 transition-colors hover:text-yellow-300 disabled:opacity-50"
                        title="Mark as Investigating"
                      >
                        <Icon icon={Clock} size="sm" />
                      </button>
                    )}
                    {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                      <button
                        onClick={() => onStatusUpdate(ticket.id, 'resolved')}
                        disabled={updatingStatus === ticket.id}
                        className="text-green-400 transition-colors hover:text-green-300 disabled:opacity-50"
                        title="Mark as Resolved"
                      >
                        <Icon icon={CheckCircle} size="sm" />
                      </button>
                    )}
                    {ticket.status !== 'closed' && (
                      <button
                        onClick={() => onStatusUpdate(ticket.id, 'closed')}
                        disabled={updatingStatus === ticket.id}
                        className="text-gray-400 transition-colors hover:text-gray-300 disabled:opacity-50"
                        title="Close Ticket"
                      >
                        <Icon icon={XCircle} size="sm" />
                      </button>
                    )}
                    <button
                      onClick={() => onViewDetails(ticket)}
                      className="text-[#29E7CD] transition-colors hover:text-[#29E7CD]/80"
                      title="View Details"
                    >
                      <Icon icon={Eye} size="sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
