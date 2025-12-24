'use client';

import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import type { AllergenItem } from './AllergenOverview/types';

interface AllergenOverviewMobileCardProps {
  item: AllergenItem;
}

export function AllergenOverviewMobileCard({ item }: AllergenOverviewMobileCardProps) {
  // Build map of ingredient name -> allergens it contributes to
  const ingredientAllergenMap: Record<string, string[]> = {};
  if (item.allergenSources) {
    Object.entries(item.allergenSources).forEach(([allergen, ingredients]) => {
      ingredients.forEach(ingredientName => {
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
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                item.type === 'recipe'
                  ? 'border border-[var(--primary)]/20 bg-[var(--primary)]/10 text-[var(--primary)]'
                  : 'border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]'
              }`}
            >
              {item.type === 'recipe' ? 'Recipe' : 'Dish'}
            </span>
            <h3 className="text-base font-semibold text-[var(--foreground)]">{item.name}</h3>
          </div>
          {item.description && (
            <p className="text-sm text-[var(--foreground-muted)]">{item.description}</p>
          )}
        </div>
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-3">
        <div>
          <p className="mb-1.5 text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
            Allergens
          </p>
          <AllergenDisplay
            allergens={item.allergens}
            showEmpty={true}
            emptyMessage="None"
            size="sm"
          />
        </div>

        {allIngredientNames.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wider text-[var(--foreground-muted)] uppercase">
              From Ingredients
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allIngredientNames.map(ingredientName => {
                const allergens = ingredientAllergenMap[ingredientName];
                const tooltipText =
                  allergens.length > 0 ? `Contains: ${allergens.join(', ')}` : ingredientName;
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
          </div>
        )}
      </div>
    </div>
  );
}
