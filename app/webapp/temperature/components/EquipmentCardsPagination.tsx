'use client';

interface EquipmentCardsPaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
}

export function EquipmentCardsPagination({
  currentPage,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
}: EquipmentCardsPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
      <div className="text-sm text-[var(--foreground-muted)]">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} equipment
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-[var(--foreground-muted)]">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-xl border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
