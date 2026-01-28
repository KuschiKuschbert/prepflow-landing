'use client';

import { Icon } from '@/components/ui/Icon';
import { logger } from '@/lib/logger';
import { CheckCircle2, Circle, Package } from 'lucide-react';
import { useState } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../types';
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
  interactive?: boolean;
}

export function RecipeIngredientsList({
  recipeIngredients,
  selectedRecipe,
  previewYield,
  formatQuantity,
  interactive = false,
}: RecipeIngredientsListProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
      if (!interactive) return;
      const newSet = new Set(checkedItems);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setCheckedItems(newSet);
  };
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
              <Icon
                icon={Package}
                size="xl"
                className="text-[var(--foreground-muted)]"
                aria-hidden={true}
              />
            </div>
            <p className="text-sm text-[var(--foreground-muted)]">
              No ingredients found for this recipe
            </p>
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
                <div
                  key={ri.id || index}
                  className="px-4 py-3 text-center text-sm text-[var(--color-warning)]"
                >
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
                <div
                  key={ri.id || index}
                  className="px-4 py-3 text-center text-sm text-[var(--color-warning)]"
                >
                  ⚠️ Ingredient name missing (ID: {ingredient.id || 'unknown'})
                </div>
              );
            }

            const isMissing = ri.is_missing;
            const isChecked = checkedItems.has(ri.id);

            return (
              <div
                key={ri.id}
                onClick={() => toggleItem(ri.id)}
                className={`px-4 py-3 transition-all duration-200 ${
                    interactive ? 'cursor-pointer' : ''
                } ${
                    isChecked
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10'
                    : isMissing
                    ? 'bg-rose-500/5 hover:bg-rose-500/10'
                    : 'hover:bg-[var(--muted)]/20'
                }`}
              >
                <div className={`grid grid-cols-12 items-center gap-4 transition-opacity duration-200 ${isChecked ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="col-span-1 text-center flex justify-center">
                    {interactive ? (
                         <Icon
                            icon={isChecked ? CheckCircle2 : Circle}
                            size="sm"
                            className={isChecked ? 'text-emerald-500' : 'text-[var(--foreground-muted)]'}
                         />
                    ) : (
                        <span className={`font-mono text-sm ${isMissing ? 'text-rose-400' : 'text-[var(--foreground-muted)]'}`}>
                        {String(index + 1).padStart(2, '0')}
                        </span>
                    )}
                  </div>
                  <div className="col-span-8">
                    <div className="flex items-center gap-2">
                        <div className={`font-medium transition-all ${
                            isChecked
                            ? 'line-through text-[var(--foreground-muted)]'
                            : isMissing
                            ? 'text-rose-200'
                            : 'text-[var(--foreground)]'
                        }`}>
                          {ingredient.ingredient_name}
                        </div>
                        {isMissing && !isChecked && (
                            <span className="inline-flex items-center rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-medium text-rose-300 ring-1 ring-inset ring-rose-500/20">
                                Missing
                            </span>
                        )}
                    </div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className={`font-medium transition-all ${
                         isChecked
                         ? 'line-through text-[var(--foreground-muted)]'
                         : isMissing
                         ? 'text-rose-200'
                         : 'text-[var(--foreground)]'
                    }`}>
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
