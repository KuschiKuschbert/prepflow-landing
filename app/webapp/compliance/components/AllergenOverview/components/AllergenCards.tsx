/**
 * Mobile card view for allergen overview
 */

import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';
import { AllergenOverviewMobileCard } from './AllergenOverviewMobileCard';
import type { AllergenItem } from '../AllergenOverview';

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
      <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#29E7CD]/20 to-[#D925C7]/20">
            <Icon icon={Search} size="lg" className="text-[#29E7CD]" aria-hidden={true} />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          {hasActiveFilters ? 'No Items Match Your Filters' : 'No Items Found'}
        </h3>
        <p className="mb-4 text-sm text-gray-400">
          {hasActiveFilters
            ? 'Try adjusting your filters or clearing them to see all items.'
            : totalItems === 0
              ? 'Start by adding recipes or dishes to track allergen information.'
              : 'All items have been filtered out.'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a]/80 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-[#29E7CD]/50 hover:bg-[#1f1f1f] hover:text-[#29E7CD]"
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
