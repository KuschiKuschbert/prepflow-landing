import { useSupportTicketsFetch } from './useSupportTicketsFetch';
import { useSupportTicketsMutations } from './useSupportTicketsMutations';
import { useSupportTicketsLink } from './useSupportTicketsLink';

interface UseSupportTicketsFilters {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  typeFilter: string;
  page: number;
}

/**
 * Orchestrator hook for managing support tickets.
 * Combines fetching, mutation, and linking logic for support ticket management.
 *
 * @param {UseSupportTicketsFilters} filters - Filter parameters for support tickets
 * @param {string} filters.searchQuery - Search query string
 * @param {string} filters.severityFilter - Filter by severity (all, low, medium, high, critical)
 * @param {string} filters.statusFilter - Filter by status (all, new, in_progress, resolved, closed)
 * @param {string} filters.typeFilter - Filter by type (all, bug, feature, question, other)
 * @param {number} filters.page - Current page number
 * @returns {Object} Support tickets data and mutation functions
 * @returns {SupportTicket[]} returns.tickets - Array of support tickets
 * @returns {boolean} returns.loading - Loading state
 * @returns {Function} returns.updateStatus - Function to update ticket status
 * @returns {Function} returns.saveNotes - Function to save admin notes
 * @returns {Function} returns.linkError - Function to link ticket to error log
 */
export function useSupportTickets(filters: UseSupportTicketsFilters) {
  const fetchData = useSupportTicketsFetch(filters);
  const mutations = useSupportTicketsMutations(fetchData.refresh);
  const link = useSupportTicketsLink();

  return {
    ...fetchData,
    ...mutations,
    ...link,
  };
}
