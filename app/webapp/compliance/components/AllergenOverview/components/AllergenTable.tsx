/**
 * Desktop table view for allergen overview
 */

import { Icon } from '@/components/ui/Icon';
import { Search } from 'lucide-react';
import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import type { AllergenItem } from '../types';

interface AllergenTableProps {
  items: AllergenItem[];
  hasActiveFilters: boolean;
  totalItems: number;
  onClearFilters: () => void;
}

export function AllergenTable({
  items,
  hasActiveFilters,
  totalItems,
  onClearFilters,
}: AllergenTableProps) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
        <div className="px-6 py-12">
          <div className="text-center">
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
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#2a2a2a]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                Allergens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                From Ingredients
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a] bg-[#1f1f1f]">
            {items.map(item => {
              // Build map of ingredient name -> allergens it contributes to
              const ingredientAllergenMap: Record<string, string[]> = {};
              if (item.allergenSources) {
                Object.entries(item.allergenSources).forEach(([allergen, ingredients]) => {
                  (ingredients as string[]).forEach((ingredientName: string) => {
                    if (!ingredientAllergenMap[ingredientName]) {
                      ingredientAllergenMap[ingredientName] = [];
                    }
                    if (!ingredientAllergenMap[ingredientName].includes(allergen)) {
                      ingredientAllergenMap[ingredientName].push(allergen);
                    }
                  });
                });
              }

              const allIngredientNames = Object.keys(ingredientAllergenMap);

              return (
                <tr
                  key={`${item.type}-${item.id}`}
                  className="transition-colors hover:bg-[#2a2a2a]/20"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.type === 'recipe'
                            ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10 text-[#29E7CD]'
                            : 'border border-[#D925C7]/20 bg-[#D925C7]/10 text-[#D925C7]'
                        }`}
                      >
                        {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                      </span>
                      <div className="text-sm font-medium text-white">{item.name}</div>
                    </div>
                    {item.description && (
                      <div className="mt-1 text-xs text-gray-400">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <AllergenDisplay
                      allergens={item.allergens}
                      showEmpty={true}
                      emptyMessage="None"
                      size="sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {allIngredientNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {allIngredientNames.map(ingredientName => {
                          const allergens = ingredientAllergenMap[ingredientName];
                          const tooltipText =
                            allergens.length > 0
                              ? `Contains: ${allergens.join(', ')}`
                              : ingredientName;
                          return (
                            <span
                              key={ingredientName}
                              title={tooltipText}
                              className="inline-flex cursor-help rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#29E7CD]/10 hover:text-[#29E7CD]"
                            >
                              {ingredientName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
