import { useMemo } from 'react';

interface UsePaginationProps {
  filteredTotal: number;
  itemsPerPage: number;
  page: number;
}

/**
 * Calculate pagination values
 */
export function usePagination({ filteredTotal, itemsPerPage, page }: UsePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(filteredTotal / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;

  return {
    totalPages,
    startIndex,
  };
}


