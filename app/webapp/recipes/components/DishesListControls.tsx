import { Icon } from '@/components/ui/Icon';
import { Search, X } from 'lucide-react';

interface DishesListControlsProps {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  searchTerm: string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSearchChange?: (term: string) => void;
}

export function DishesListPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0 || totalPages <= 1) return null;

  return (
    <div className="mb-4 flex items-center justify-between">
      <span className="text-sm text-[var(--foreground-muted)]">
        Page {currentPage} of {totalPages} ({totalItems} items)
      </span>
      <div className="space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="rounded-lg bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-lg bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export function DishesListSearch({
  searchTerm,
  itemsPerPage,
  onSearchChange,
  onItemsPerPageChange,
}: {
  searchTerm: string;
  itemsPerPage: number;
  onSearchChange?: (term: string) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}) {
  if (!onSearchChange) return null;

  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 p-3 backdrop-blur-sm">
      <div className="tablet:flex-row tablet:items-center tablet:gap-2 flex flex-col gap-2">
        <div className="relative min-w-0 flex-1">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder="Search dishes and recipes..."
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pr-10 pl-10 text-[var(--foreground)] placeholder-gray-500 transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
            aria-label="Search dishes and recipes"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Clear search"
            >
              <Icon icon={X} size="sm" aria-hidden={true} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <label
            htmlFor="items-per-page"
            className="text-xs whitespace-nowrap text-[var(--foreground-muted)]"
          >
            Per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={e => onItemsPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-2.5 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-all duration-200 hover:border-[var(--border)] hover:bg-[var(--surface)] focus:border-[var(--primary)]/50 focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
            title="Items per page"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>
    </div>
  );
}
