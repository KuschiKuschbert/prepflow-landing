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
    <div className="overflow-hidden rounded-xl border border-[#2a2a2a]/50 bg-[#0a0a0a]">
      {/* Header */}
      <div className="border-b border-[#2a2a2a]/50 bg-gradient-to-r from-[#2a2a2a]/50 to-[#2a2a2a]/20 px-4 py-3">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-300">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-8">Ingredient</div>
          <div className="col-span-3 text-center">Quantity</div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-[#2a2a2a]/30">
        {recipeIngredients.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <div className="mb-2 flex justify-center text-gray-400">
              <Icon icon={Package} size="xl" className="text-gray-400" aria-hidden={true} />
            </div>
            <p className="text-sm text-gray-400">No ingredients found for this recipe</p>
            <p className="mt-1 text-xs text-gray-500">
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
                <div key={ri.id || index} className="px-4 py-3 text-center text-sm text-yellow-400">
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
                <div key={ri.id || index} className="px-4 py-3 text-center text-sm text-yellow-400">
                  ⚠️ Ingredient name missing (ID: {ingredient.id || 'unknown'})
                </div>
              );
            }

            return (
              <div key={ri.id} className="px-4 py-3 transition-colors hover:bg-[#2a2a2a]/20">
                <div className="grid grid-cols-12 items-center gap-4">
                  <div className="col-span-1 text-center">
                    <span className="font-mono text-sm text-gray-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="col-span-8">
                    <div className="font-medium text-white">{ingredient.ingredient_name}</div>
                  </div>
                  <div className="col-span-3 text-center">
                    <span className="font-medium text-white">
                      {(() => {
                        const formatted = formatQuantity(quantity, ri.unit || '');
                        const isConverted = formatted.unit !== (ri.unit || '').toLowerCase();
                        return (
                          <>
                            {formatted.value} {formatted.unit}
                            {isConverted && (
                              <div className="mt-1 text-xs text-gray-400">
                                ({formatted.original})
                              </div>
                            )}
                            {previewYield !== selectedRecipe.yield && !isConverted && (
                              <div className="mt-1 text-xs text-gray-400">
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
