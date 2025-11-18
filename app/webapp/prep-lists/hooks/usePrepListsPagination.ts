/**
 * Hook for managing prep list pagination.
 */

import { useState, useMemo, useCallback } from 'react';

interface UsePrepListsPaginationProps {
  total: number;
  pageSize: number;
}

/**
 * Hook for managing prep list pagination.
 *
 * @param {UsePrepListsPaginationProps} props - Hook dependencies
 * @returns {Object} Pagination state and handlers
 */
export function usePrepListsPagination({ total, pageSize }: UsePrepListsPaginationProps) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  const goToPreviousPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const goToNextPage = useCallback(() => {
    setPage(p => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return {
    page,
    setPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
  };
}
