/**
 * Hook for fetching error logs
 */

import { useState, useCallback, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { logger } from '@/lib/logger';
import type { ErrorLog } from '../types';

const PAGE_SIZE = 20;

interface UseErrorLogsFilters {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  categoryFilter: string;
  page: number;
}

export function useErrorLogsFetch(filters: UseErrorLogsFilters) {
  const { showError } = useNotification();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [severityCounts, setSeverityCounts] = useState<Record<string, number>>({});
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const fetchErrors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        pageSize: PAGE_SIZE.toString(),
        ...(filters.searchQuery && { search: filters.searchQuery }),
        ...(filters.severityFilter !== 'all' && { severity: filters.severityFilter }),
        ...(filters.statusFilter !== 'all' && { status: filters.statusFilter }),
        ...(filters.categoryFilter !== 'all' && { category: filters.categoryFilter }),
      });
      const response = await fetch(`/api/admin/errors?${params}`);
      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
        setSeverityCounts(data.severityCounts || {});
        setStatusCounts(data.statusCounts || {});
      }
    } catch (error) {
      logger.error('Failed to fetch errors:', error);
      showError('Failed to load errors');
    } finally {
      setLoading(false);
    }
  }, [filters, showError]);

  useEffect(() => {
    fetchErrors();
    const interval = setInterval(fetchErrors, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchErrors]);

  return {
    errors,
    loading,
    totalPages,
    total,
    severityCounts,
    statusCounts,
    refresh: fetchErrors,
  };
}
