'use client';

interface TemperaturePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number | ((p: number) => number)) => void;
}

export function TemperaturePagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: TemperaturePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm text-[var(--foreground-muted)]">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>
      <div className="space-x-2">
        <button
          onClick={() => onPageChange((p: number) => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
          className="rounded-lg bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] transition-all hover:bg-[var(--muted-hover)] disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange((p: number) => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-lg bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] transition-all hover:bg-[var(--muted-hover)] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
