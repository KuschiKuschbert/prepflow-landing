'use client';

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
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="px-6 py-12">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)]/20 to-[var(--accent)]/20">
                <Icon
                  icon={Search}
                  size="lg"
                  className="text-[var(--primary)]"
                  aria-hidden={true}
                />
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
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--muted)]">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                Allergens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-[var(--foreground-secondary)] uppercase">
                From Ingredients
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--muted)] bg-[var(--surface)]">
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
                  className="transition-colors hover:bg-[var(--muted)]/20"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.type === 'recipe'
                            ? 'border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]'
                            : 'border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]'
                        }`}
                      >
                        {item.type === 'recipe' ? 'Recipe' : 'Dish'}
                      </span>
                      <div className="text-sm font-medium text-[var(--foreground)]">
                        {item.name}
                      </div>
                    </div>
                    {item.description && (
                      <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                        {item.description}
                      </div>
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
                              className="inline-flex cursor-help rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                            >
                              {ingredientName}
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--foreground-subtle)]">—</span>
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
