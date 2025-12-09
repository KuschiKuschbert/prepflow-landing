import { useErrorLogsFetch } from './useErrorLogsFetch';
import { useErrorLogsMutations } from './useErrorLogsMutations';

interface UseErrorLogsFilters {
  searchQuery: string;
  severityFilter: string;
  statusFilter: string;
  categoryFilter: string;
  page: number;
}

/**
 * Orchestrator hook for managing error logs.
 * Combines fetching and mutation logic for error log management.
 *
 * @param {UseErrorLogsFilters} filters - Filter parameters for error logs
 * @param {string} filters.searchQuery - Search query string
 * @param {string} filters.severityFilter - Filter by severity (all, safety, critical, etc.)
 * @param {string} filters.statusFilter - Filter by status (all, new, investigating, etc.)
 * @param {string} filters.categoryFilter - Filter by category (all, security, database, etc.)
 * @param {number} filters.page - Current page number
 * @returns {Object} Error logs data and mutation functions
 * @returns {ErrorLog[]} returns.errors - Array of error logs
 * @returns {boolean} returns.loading - Loading state
 * @returns {Function} returns.updateStatus - Function to update error status
 * @returns {Function} returns.saveNotes - Function to save error notes
 */
export function useErrorLogs(filters: UseErrorLogsFilters) {
  const fetchData = useErrorLogsFetch(filters);
  const mutations = useErrorLogsMutations(fetchData.refresh);

  return {
    ...fetchData,
    ...mutations,
  };
}
