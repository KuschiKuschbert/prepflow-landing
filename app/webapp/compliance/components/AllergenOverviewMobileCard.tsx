'use client';

import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import type { AllergenItem } from './AllergenOverview';

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
    <div className="rounded-xl border border-[#2a2a2a] bg-[#1f1f1f] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                item.type === 'recipe'
                  ? 'border border-[#29E7CD]/20 bg-[#29E7CD]/10 text-[#29E7CD]'
                  : 'border border-[#D925C7]/20 bg-[#D925C7]/10 text-[#D925C7]'
              }`}
            >
              {item.type === 'recipe' ? 'Recipe' : 'Dish'}
            </span>
            <h3 className="text-base font-semibold text-white">{item.name}</h3>
          </div>
          {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
        </div>
      </div>

      <div className="space-y-3 border-t border-[#2a2a2a] pt-3">
        <div>
          <p className="mb-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
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
            <p className="mb-1.5 text-xs font-medium tracking-wider text-gray-400 uppercase">
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
                    className="inline-flex cursor-help rounded-full bg-[#2a2a2a] px-2.5 py-0.5 text-xs font-medium text-gray-300 transition-colors hover:bg-[#29E7CD]/10 hover:text-[#29E7CD]"
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
