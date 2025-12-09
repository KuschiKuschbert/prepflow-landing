/**
 * Hook for managing support tickets
 */

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
