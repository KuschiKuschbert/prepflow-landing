/**
 * Hook for managing par level pagination.
 */

import { useState, useEffect, useMemo } from 'react';
import type { ParLevel } from '../types';

interface UseParLevelsPaginationProps {
  parLevels: ParLevel[];
}

/**
 * Hook for managing par level pagination.
 *
 * @param {UseParLevelsPaginationProps} props - Hook dependencies
 * @returns {Object} Pagination state and computed values
 */
export function useParLevelsPagination({ parLevels }: UseParLevelsPaginationProps) {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const totalPages = useMemo(() => Math.ceil(parLevels.length / itemsPerPage), [parLevels.length, itemsPerPage]);

  const paginatedParLevels = useMemo(
    () => parLevels.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [parLevels, page, itemsPerPage],
  );

  // Reset page when itemsPerPage changes
  useEffect(() => {
    setPage(1);
  }, [itemsPerPage]);

  return {
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedParLevels,
  };
}
