'use client';

import type { UnifiedItemTypeFilter } from '@/app/webapp/recipes/components/hooks/useDishesClientPagination/helpers/useFilterState';
import { Icon } from '@/components/ui/Icon';
import { ChefHat, Layers, Search, UtensilsCrossed, X } from 'lucide-react';

export function DishesListSearch({
  searchTerm,
  itemsPerPage,
  itemType,
  onSearchChange,
  onItemsPerPageChange,
  onItemTypeChange,
}: {
  searchTerm: string;
  itemsPerPage: number;
  itemType: UnifiedItemTypeFilter;
  onSearchChange?: (term: string) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onItemTypeChange?: (type: UnifiedItemTypeFilter) => void;
}) {
  if (!onSearchChange) return null;

  const typePills: { value: UnifiedItemTypeFilter; label: string; icon: typeof Search }[] = [
    { value: 'all', label: 'All', icon: Layers },
    { value: 'dish', label: 'Dishes', icon: UtensilsCrossed },
    { value: 'recipe', label: 'Recipes', icon: ChefHat },
  ];

  return (
    <div className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 p-3 backdrop-blur-sm">
      <div className="tablet:flex-row tablet:items-center tablet:gap-4 flex flex-col gap-3">
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
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pr-10 pl-10 text-[var(--foreground)] placeholder-gray-500 transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:outline-none"
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

        {onItemTypeChange && (
          <div className="flex shrink-0 gap-1 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-1">
            {typePills.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => onItemTypeChange(value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  itemType === value
                    ? 'bg-[var(--primary)]/20 text-[var(--primary)]'
                    : 'text-[var(--foreground-muted)] hover:bg-[var(--muted)]/50 hover:text-[var(--foreground)]'
                }`}
                aria-pressed={itemType === value}
                aria-label={`Show ${label}`}
              >
                <Icon icon={icon} size="xs" aria-hidden={true} />
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="flex shrink-0 items-center gap-1.5">
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

export function DishesListPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}) {
  if (totalItems === 0) return null;
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);
  const rangeLabel = `${start}–${end} of ${totalItems}`;

  return (
    <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 px-4 py-2">
      <span className="text-sm text-[var(--foreground-muted)]">{rangeLabel}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          Previous
        </button>
        <span className="text-sm text-[var(--foreground-muted)]">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)] disabled:opacity-40 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
