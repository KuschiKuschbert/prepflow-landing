'use client';

import { DishWithDetails } from '@/lib/types/recipes';

interface DishPreviewModalRecipesListProps {
  dishDetails: DishWithDetails;
}

export function DishPreviewModalRecipesList({ dishDetails }: DishPreviewModalRecipesListProps) {
  if (!dishDetails.recipes || dishDetails.recipes.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-[var(--foreground)]">Recipes</h3>
      <div className="space-y-2">
        {dishDetails.recipes.map((dr, index) => (
          <div
            key={index}
            className="rounded-lg bg-[var(--muted)]/30 p-3 text-sm text-[var(--foreground-secondary)]"
          >
            <span className="font-medium text-[var(--foreground)]">
              {dr.recipes?.recipe_name || 'Unknown Recipe'}
            </span>
            <span className="ml-2 text-[var(--foreground-muted)]">× {dr.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
