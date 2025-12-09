/**
 * Hook for fetching support tickets
 */

import { useState, useCallback, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { SupportTicket } from '../types';

const PAGE_SIZE = 20;

interface UseSupportTicketsFilters {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  typeFilter: string;
  page: number;
}

export function useSupportTicketsFetch(filters: UseSupportTicketsFilters) {
  const { showError } = useNotification();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        pageSize: PAGE_SIZE.toString(),
        ...(filters.searchQuery && { search: filters.searchQuery }),
        ...(filters.severityFilter !== 'all' && { severity: filters.severityFilter }),
        ...(filters.statusFilter !== 'all' && { status: filters.statusFilter }),
        ...(filters.typeFilter !== 'all' && { type: filters.typeFilter }),
      });
      const response = await fetch(`/api/admin/support-tickets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      logger.error('Failed to fetch tickets:', error);
      showError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    totalPages,
    total,
    refresh: fetchTickets,
  };
}
