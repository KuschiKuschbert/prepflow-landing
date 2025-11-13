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
  if (totalPages <= 1) return null;

  const startItem = total && itemsPerPage ? (page - 1) * itemsPerPage + 1 : undefined;
  const endItem = total && itemsPerPage ? Math.min(page * itemsPerPage, total) : undefined;

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-4">
        {total !== undefined && (
          <span className="text-sm text-gray-400">
            {startItem !== undefined && endItem !== undefined
              ? `Showing ${startItem}-${endItem} of ${total}`
              : `Total: ${total}`}
          </span>
        )}
        {itemsPerPage && onItemsPerPageChange && (
          <select
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-[#2a2a2a] bg-[#1f1f1f] px-3 py-1.5 text-sm text-white focus:border-[#29E7CD] focus:outline-none focus:ring-1 focus:ring-[#29E7CD]"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white transition-colors hover:bg-[#2a2a2a]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <Icon icon={ChevronLeft} size="sm" aria-hidden={true} />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <span className="px-4 py-2 text-sm text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="flex items-center gap-1.5 rounded-lg bg-[#2a2a2a] px-3 py-2 text-sm text-white transition-colors hover:bg-[#2a2a2a]/80 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <Icon icon={ChevronRight} size="sm" aria-hidden={true} />
        </button>
      </div>
    </div>
  );
}
