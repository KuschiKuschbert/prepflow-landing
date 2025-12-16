'use client';

import { Recipe, RecipeIngredientWithDetails } from '../types';
import { Package } from 'lucide-react';
import { Icon } from '@/components/ui/Icon';

import { logger } from '@/lib/logger';
interface RecipeIngredientsListProps {
  recipeIngredients: RecipeIngredientWithDetails[];
  selectedRecipe: Recipe;
  previewYield: number;
  formatQuantity: (
    quantity: number,
    unit: string,
  ) => {
    value: string;
    unit: string;
    original: string;
  };
}

export function RecipeIngredientsList({
  recipeIngredients,
  selectedRecipe,
  previewYield,
  formatQuantity,
}: RecipeIngredientsListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]/50 bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)]/50 bg-gradient-to-r from-[var(--muted)]/50 to-[var(--muted)]/20 px-4 py-3">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-[var(--foreground-secondary)]">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-8">Ingredient</div>
          <div className="col-span-3 text-center">Quantity</div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[var(--muted)]/30">
        {recipeIngredients.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="mb-2 flex justify-center text-[var(--foreground-muted)]">
              <Icon icon={Package} size="xl" className="text-[var(--foreground-muted)]" aria-hidden={true} />
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">No ingredients found for this recipe</p>
            <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
              Add ingredients in the COGS Calculator and save as recipe
            </p>
          </div>
        ) : (
          recipeIngredients.map((ri, index) => {
            if (!ri.ingredients) {
              logger.warn('⚠️ Recipe ingredient missing nested data:', {
                ingredient: JSON.stringify(ri),
              });
              return (
                <div key={ri.id || index} className="px-4 py-3 text-center text-sm text-[var(--color-warning)]">
                  ⚠️ Ingredient data incomplete (ID: {ri.ingredient_id || 'unknown'})
                </div>
              );
            }

            const ingredient = ri.ingredients;
            const quantity = ri.quantity || 0;

            if (!ingredient.ingredient_name) {
              logger.warn('⚠️ Recipe ingredient missing ingredient_name:', {
                ingredient: JSON.stringify(ingredient),
              });
              return (
                <div key={ri.id || index} className="px-4 py-3 text-center text-sm text-[var(--color-warning)]">
                  ⚠️ Ingredient name missing (ID: {ingredient.id || 'unknown'})
                </div>
              );
            }

            return (
              <div key={ri.id} className="px-4 py-3 transition-colors hover:bg-[var(--muted)]/20">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-1 text-center">
                    <span className="font-mono text-sm text-[var(--foreground-muted)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="col-span-8">
                    <div className="font-medium text-[var(--foreground)]">{ingredient.ingredient_name}</div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="font-medium text-[var(--foreground)]">
                      {(() => {
                        const formatted = formatQuantity(quantity, ri.unit || '');
                        const isConverted = formatted.unit !== (ri.unit || '').toLowerCase();
                        return (
                          <>
                            {formatted.value} {formatted.unit}
                            {isConverted && (
                              <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                ({formatted.original})
                              </div>
                            )}
                            {previewYield !== selectedRecipe.yield && !isConverted && (
                              <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                (orig: {quantity} {ri.unit})
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
