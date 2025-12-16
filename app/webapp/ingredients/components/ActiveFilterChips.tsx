'use client';

import { Icon } from '@/components/ui/Icon';
import { MapPin, Search, Store, Tag, X } from 'lucide-react';

interface ActiveFilterChipsProps {
  searchTerm: string;
  supplierFilter: string;
  storageFilter: string;
  categoryFilter?: string;
  onClearSearch: () => void;
  onClearSupplier: () => void;
  onClearStorage: () => void;
  onClearCategory?: () => void;
}

export function ActiveFilterChips({
  searchTerm,
  supplierFilter,
  storageFilter,
  categoryFilter,
  onClearSearch,
  onClearSupplier,
  onClearStorage,
  onClearCategory,
}: ActiveFilterChipsProps) {
  if (!searchTerm && !supplierFilter && !storageFilter && !categoryFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-[var(--foreground-muted)]">Active:</span>
      {searchTerm && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
          <Icon icon={Search} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
          <span>{searchTerm}</span>
          <button
            onClick={onClearSearch}
            className="ml-1 text-[var(--primary)]/70 transition-colors hover:text-[var(--primary)]"
            aria-label="Remove search filter"
          >
            <Icon icon={X} size="xs" className="text-current" aria-hidden={true} />
          </button>
        </div>
      )}
      {supplierFilter && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-info)]/30 bg-[var(--color-info)]/10 px-3 py-1 text-xs font-medium text-[var(--color-info)]">
          <Icon icon={Store} size="xs" className="text-[var(--color-info)]" aria-hidden={true} />
          <span>{supplierFilter}</span>
          <button
            onClick={onClearSupplier}
            className="ml-1 text-[var(--color-info)]/70 transition-colors hover:text-[var(--color-info)]"
            aria-label="Remove supplier filter"
          >
            <Icon icon={X} size="xs" className="text-current" aria-hidden={true} />
          </button>
        </div>
      )}
      {storageFilter && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-xs font-medium text-[var(--accent)]">
          <Icon icon={MapPin} size="xs" className="text-[var(--accent)]" aria-hidden={true} />
          <span>{storageFilter}</span>
          <button
            onClick={onClearStorage}
            className="ml-1 text-[var(--accent)]/70 transition-colors hover:text-[var(--accent)]"
            aria-label="Remove storage filter"
          >
            <Icon icon={X} size="xs" className="text-current" aria-hidden={true} />
          </button>
        </div>
      )}
      {categoryFilter && onClearCategory && (
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
          <Icon icon={Tag} size="xs" className="text-[var(--primary)]" aria-hidden={true} />
          <span>{categoryFilter}</span>
          <button
            onClick={onClearCategory}
            className="ml-1 text-[var(--primary)]/70 transition-colors hover:text-[var(--primary)]"
            aria-label="Remove category filter"
          >
            <Icon icon={X} size="xs" className="text-current" aria-hidden={true} />
          </button>
        </div>
      )}
    </div>
  );
}
