'use client';

import { DishWithDetails } from '@/lib/types/recipes';

interface DishPreviewModalIngredientsListProps {
  dishDetails: DishWithDetails;
}

export function DishPreviewModalIngredientsList({
  dishDetails,
}: DishPreviewModalIngredientsListProps) {
  if (!dishDetails.ingredients || dishDetails.ingredients.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-[var(--foreground)]">
        Standalone Ingredients
      </h3>
      <div className="space-y-2">
        {dishDetails.ingredients.map((di, index) => (
          <div
            key={index}
            className="rounded-lg bg-[var(--muted)]/30 p-3 text-sm text-[var(--foreground-secondary)]"
          >
            <span className="font-medium text-[var(--foreground)]">
              {di.ingredients?.ingredient_name || 'Unknown Ingredient'}
            </span>
            <span className="ml-2 text-[var(--foreground-muted)]">
              {di.quantity} {di.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
