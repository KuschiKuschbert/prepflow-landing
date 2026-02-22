/**
 * Function-level allergen summary.
 * Aggregates allergens and dietary flags from all meal items (dishes/recipes) in the runsheet.
 */

import { AllergenDisplay } from '@/components/ui/AllergenDisplay';
import { Icon } from '@/components/ui/Icon';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { Leaf } from 'lucide-react';
import type { RunsheetItemWithRelations } from './RunsheetPanel';

interface FunctionAllergenSummaryProps {
  items: RunsheetItemWithRelations[];
}

export function FunctionAllergenSummary({ items }: FunctionAllergenSummaryProps) {
  const mealItems = items.filter(i => i.item_type === 'meal' && (i.dish_id || i.recipe_id));

  const allergenSet = new Set<string>();
  let hasVegetarian = false;
  let hasVegan = false;

  for (const item of mealItems) {
    if (item.dishes?.allergens) {
      consolidateAllergens(item.dishes.allergens).forEach(a => allergenSet.add(a));
    }
    if (item.recipes?.allergens) {
      consolidateAllergens(item.recipes.allergens).forEach(a => allergenSet.add(a));
    }
    if (item.dishes?.is_vegetarian || item.recipes?.is_vegetarian) hasVegetarian = true;
    if (item.dishes?.is_vegan || item.recipes?.is_vegan) hasVegan = true;
  }

  const allergens = [...allergenSet];

  if (allergens.length === 0 && !hasVegetarian && !hasVegan) {
    return null;
  }

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 px-3 py-2">
      <div className="flex flex-wrap items-center gap-2">
        {allergens.length > 0 && (
          <>
            <span className="text-xs font-medium text-[var(--foreground-muted)]">
              Allergens in this event:
            </span>
            <AllergenDisplay
              allergens={allergens}
              size="sm"
              showEmpty={false}
              className="flex-wrap"
            />
          </>
        )}
        {hasVegetarian && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2 py-0.5 text-xs font-medium text-[var(--color-success)]">
            <Icon icon={Leaf} size="xs" aria-hidden />
            Vegetarian options
          </span>
        )}
        {hasVegan && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-success-border)] bg-[var(--color-success-bg)] px-2 py-0.5 text-xs font-medium text-[var(--color-success)]">
            <Icon icon={Leaf} size="xs" aria-hidden />
            Vegan options
          </span>
        )}
      </div>
    </div>
  );
}
