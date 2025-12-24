'use client';

/**
 * Mobile card view for allergen overview
 */

import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';
import { AllergenOverviewMobileCard } from '../../AllergenOverviewMobileCard';
import type { AllergenItem } from '../types';

interface AllergenCardsProps {
  items: AllergenItem[];
  hasActiveFilters: boolean;
  totalItems: number;
  onClearFilters: () => void;
}

export function AllergenCards({
  items,
  hasActiveFilters,
  totalItems,
  onClearFilters,
}: AllergenCardsProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20">
            <Icon icon={Search} size="lg" className="text-[var(--primary)]" aria-hidden={true} />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[var(--foreground)]">
          {hasActiveFilters ? 'No Items Match Your Filters' : 'No Items Found'}
        </h3>
        <p className="mb-4 text-sm text-[var(--foreground-muted)]">
          {hasActiveFilters
            ? 'Try adjusting your filters or clearing them to see all items.'
            : totalItems === 0
              ? 'Start by adding recipes or dishes to track allergen information.'
              : 'All items have been filtered out.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-4 py-2 text-sm font-medium text-[var(--foreground-secondary)] transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--primary)]"
          >
            Clear All Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <AllergenOverviewMobileCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
