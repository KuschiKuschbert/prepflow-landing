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
    <div className="rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {hasActiveFilters && (
          <>
            {selectedAllergenFilter !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
                {getAllergenFilterName(selectedAllergenFilter)}
                <button
                  onClick={() => onAllergenFilterChange('all')}
                  className="transition-colors hover:text-[#29E7CD]"
                  aria-label={`Remove ${getAllergenFilterName(selectedAllergenFilter)} filter`}
                >
                  <Icon icon={X} size="xs" aria-hidden={true} />
                </button>
              </span>
            )}
            {showOnlyWithAllergens && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
                With Allergens Only
                <button
                  onClick={() => onShowOnlyWithAllergensChange(false)}
                  className="transition-colors hover:text-[#29E7CD]"
                  aria-label="Remove with allergens filter"
                >
                  <Icon icon={X} size="xs" aria-hidden={true} />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#29E7CD]/20 bg-[#29E7CD]/10 px-3 py-1 text-xs font-medium text-[#29E7CD]">
                Search: &quot;{searchQuery}&quot;
                <button
                  onClick={() => onSearchChange('')}
                  className="transition-colors hover:text-[#29E7CD]"
                  aria-label="Clear search"
                >
                  <Icon icon={X} size="xs" aria-hidden={true} />
                </button>
              </span>
            )}
            <button
              onClick={onClearFilters}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
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
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden={true}
          />
          <input
            type="text"
            placeholder="Search dishes/recipes..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-3 pl-10 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
          />
        </div>

        <div className="relative">
          <Icon
            icon={Filter}
            size="sm"
            className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            aria-hidden={true}
          />
          <select
            value={selectedAllergenFilter}
            onChange={e => onAllergenFilterChange(e.target.value)}
            className="w-full appearance-none rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] py-2 pr-3 pl-10 text-sm text-white focus:ring-2 focus:ring-[#29E7CD] focus:outline-none"
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
            className="h-4 w-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#29E7CD] focus:ring-2 focus:ring-[#29E7CD]"
          />
          <label htmlFor="showOnlyWithAllergens" className="text-sm text-gray-300">
            Show only items with allergens
          </label>
        </div>
      </div>
    </div>
  );
}
