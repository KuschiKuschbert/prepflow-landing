'use client';

import React from 'react';

interface EquipmentTablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function EquipmentTablePagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
}: EquipmentTablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div className="text-sm text-[var(--foreground-muted)]">
        Showing {startIndex + 1} to {endIndex} of {totalItems} equipment
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--border)] disabled:hover:bg-[var(--muted)]"
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .map((page, index, array) => {
              const showEllipsisBefore = index > 0 && array[index - 1] < page - 1;
              return (
                <React.Fragment key={`equipment-table-page-${page}`}>
                  {showEllipsisBefore && (
                    <span className="px-2 text-sm text-[var(--foreground-subtle)]">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`min-w-[40px] rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-[var(--button-active-text)]'
                        : 'border border-[var(--border)] bg-[var(--muted)] text-[var(--foreground-secondary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--button-active-text)]'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              );
            })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--border)] disabled:hover:bg-[var(--muted)]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
