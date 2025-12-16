/**
 * Filter bar component for allergen overview
 */

import { Icon } from '@/components/ui/Icon';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedAllergenFilter: string;
  onAllergenFilterChange: (filter: string) => void;
  showOnlyWithAllergens: boolean;
  onShowOnlyWithAllergensChange: (show: boolean) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  getAllergenFilterName: (value: string) => string;
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedAllergenFilter,
  onAllergenFilterChange,
  showOnlyWithAllergens,
  onShowOnlyWithAllergensChange,
  hasActiveFilters,
  onClearFilters,
  getAllergenFilterName,
}: FilterBarProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {hasActiveFilters && (
          <>
            {selectedAllergenFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                {getAllergenFilterName(selectedAllergenFilter)}
                <button
                  onClick={() => onAllergenFilterChange('all')}
                  className="transition-colors hover:text-[var(--primary)]"
                  aria-label={`Remove ${getAllergenFilterName(selectedAllergenFilter)} filter`}
                >
                  <Icon icon={X} size="xs" aria-hidden={true} />
                </button>
              </span>
            )}
            {showOnlyWithAllergens && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                With Allergens Only
                <button
                  onClick={() => onShowOnlyWithAllergensChange(false)}
                  className="transition-colors hover:text-[var(--primary)]"
                  aria-label="Remove with allergens filter"
                >
                  <Icon icon={X} size="xs" aria-hidden={true} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-3 py-1 text-xs font-medium text-[var(--primary)]">
                Search: &quot;{searchQuery}&quot;
                <button
                  onClick={() => onSearchChange('')}
                  className="transition-colors hover:text-[var(--primary)]"
                  aria-label="Clear search"
                >
                  <Icon icon={X} size="xs" aria-hidden={true} />
                </button>
              </span>
            )}
            <button
              onClick={onClearFilters}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)]/80 px-3 py-1.5 text-xs font-medium text-[var(--foreground-secondary)] transition-colors hover:border-[var(--primary)]/50 hover:bg-[var(--surface)] hover:text-[var(--primary)]"
            >
              <Icon icon={X} size="xs" aria-hidden={true} />
              Clear All
            </button>
          </>
        )}
      </div>
      <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
        <div className="relative">
          <Icon
            icon={Search}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder="Search dishes/recipes..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pr-3 pl-10 text-sm text-[var(--foreground)] placeholder-gray-500 focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          />
        </div>

        <div className="relative">
          <Icon
            icon={Filter}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--foreground-muted)]"
            aria-hidden={true}
          />
          <select
            value={selectedAllergenFilter}
            onChange={e => onAllergenFilterChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pr-3 pl-10 text-sm text-[var(--foreground)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
          >
            <option value="all">All Items</option>
            <option value="gluten">Gluten-Free</option>
            <option value="milk">Dairy-Free</option>
            <option value="eggs">Egg-Free</option>
            <option value="nuts">Nut-Free</option>
            <option value="soy">Soy-Free</option>
            <option value="fish">Fish-Free</option>
            <option value="shellfish">Shellfish-Free</option>
            <option value="sesame">Sesame-Free</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showOnlyWithAllergens"
            checked={showOnlyWithAllergens}
            onChange={e => onShowOnlyWithAllergensChange(e.target.checked)}
            className="h-4 w-4 rounded border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]"
          />
          <label htmlFor="showOnlyWithAllergens" className="text-sm text-[var(--foreground-secondary)]">
            Show only items with allergens
          </label>
        </div>
      </div>
    </div>
  );
}




