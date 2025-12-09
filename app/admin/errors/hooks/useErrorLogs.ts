/**
 * Hook for managing error logs
 */

import { useErrorLogsFetch } from './useErrorLogsFetch';
import { useErrorLogsMutations } from './useErrorLogsMutations';

interface UseErrorLogsFilters {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  categoryFilter: string;
  page: number;
}

export function useErrorLogs(filters: UseErrorLogsFilters) {
  const fetchData = useErrorLogsFetch(filters);
  const mutations = useErrorLogsMutations(fetchData.refresh);

  return {
    ...fetchData,
    ...mutations,
  };
}
