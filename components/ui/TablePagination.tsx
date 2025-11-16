'use client';

import { Icon } from '@/components/ui/Icon';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}

export function TablePagination({
  page,
  totalPages,
  total,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  className = '',
}: TablePaginationProps) {
  // Show pagination if there are items and either multiple pages OR itemsPerPage selector is provided
  // Always show if itemsPerPage selector is provided (even with 1 page) so users can change page size
  const shouldShow =
    total !== undefined &&
    total > 0 &&
    (totalPages > 1 || (itemsPerPage !== undefined && onItemsPerPageChange !== undefined));

  if (!shouldShow) return null;

  // If only one page but itemsPerPage selector exists, still show pagination controls (just disable page navigation)
  const showPageControls = totalPages > 1;

  const startItem = total && itemsPerPage ? (page - 1) * itemsPerPage + 1 : undefined;
  const endItem = total && itemsPerPage ? Math.min(page * itemsPerPage, total) : undefined;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        {total !== undefined && (
          <span className="text-fluid-sm text-gray-400">
            {startItem !== undefined && endItem !== undefined
              ? `Showing ${startItem}-${endItem} of ${total}`
              : `Total: ${total}`}
          </span>
        )}
        {itemsPerPage && onItemsPerPageChange && (
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="text-fluid-sm rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-1.5 text-white focus:border-[#29E7CD] focus:ring-1 focus:ring-[#29E7CD] focus:outline-none"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        )}
      </div>
      {showPageControls && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="text-fluid-sm flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 text-white transition-colors hover:bg-[#2a2a2a]/80 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <Icon icon={ChevronLeft} size="sm" aria-hidden={true} />
            <span className="desktop:inline hidden">Previous</span>
          </button>
          <span className="text-fluid-sm px-4 py-2 text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="text-fluid-sm flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 text-white transition-colors hover:bg-[#2a2a2a]/80 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Next page"
          >
            <span className="desktop:inline hidden">Next</span>
            <Icon icon={ChevronRight} size="sm" aria-hidden={true} />
          </button>
        </div>
      )}
    </div>
  );
}
