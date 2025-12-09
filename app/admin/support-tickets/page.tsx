'use client';

import { TablePagination } from '@/components/ui/TablePagination';
import { useState } from 'react';
import { TicketDetailModal } from './components/TicketDetailModal';
import { TicketFilters } from './components/TicketFilters';
import { TicketsTable } from './components/TicketsTable';
import { useSupportTickets } from './hooks/useSupportTickets';
import type { SupportTicket } from './types';

/**
 * Support tickets page component for admin dashboard.
 * Manages support tickets with filtering, pagination, and status updates.
 *
 * @component
 * @returns {JSX.Element} Support tickets admin page
 */
export default function SupportTicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const {
    tickets,
    loading,
    totalPages,
    total,
    updatingStatus,
    updateStatus,
    saveNotes,
    linkError,
  } = useSupportTickets({
    searchQuery,
    severityFilter,
    statusFilter,
    typeFilter,
    page,
  });

  const handleFilterChange = (
    filterType: 'search' | 'severity' | 'status' | 'type',
    value: string,
  ) => {
    setPage(1);
    switch (filterType) {
      case 'search':
        setSearchQuery(value);
        break;
      case 'severity':
        setSeverityFilter(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'type':
        setTypeFilter(value);
        break;
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    const success = await updateStatus(ticketId, newStatus);
    if (success && selectedTicket?.id === ticketId) {
      setSelectedTicket(null);
    }
  };

  const handleSaveNotes = async (ticketId: string, notes: string) => {
    const updated = await saveNotes(ticketId, notes);
    if (updated) {
      setSelectedTicket(updated);
    }
    return updated;
  };

  const handleLinkError = async (ticketId: string, errorId: string) => {
    const updated = await linkError(ticketId, errorId);
    if (updated) {
      setSelectedTicket(updated);
    }
    return updated;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
        <p className="mt-2 text-gray-400">Manage user-reported issues and feedback</p>
      </div>

      {/* Filters */}
      <TicketFilters
        searchQuery={searchQuery}
        severityFilter={severityFilter}
        statusFilter={statusFilter}
        typeFilter={typeFilter}
        onSearchChange={value => handleFilterChange('search', value)}
        onSeverityChange={value => handleFilterChange('severity', value)}
        onStatusChange={value => handleFilterChange('status', value)}
        onTypeChange={value => handleFilterChange('type', value)}
      />

      {/* Tickets Table */}
      {loading ? (
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-8">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 rounded bg-[#2a2a2a]"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            className="mb-4"
          />
          <TicketsTable
            tickets={tickets}
            updatingStatus={updatingStatus}
            onStatusUpdate={handleStatusUpdate}
            onViewDetails={setSelectedTicket}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        ticket={selectedTicket}
        updatingStatus={updatingStatus}
        onClose={() => setSelectedTicket(null)}
        onSaveNotes={handleSaveNotes}
        onLinkError={handleLinkError}
      />
    </div>
  );
}
