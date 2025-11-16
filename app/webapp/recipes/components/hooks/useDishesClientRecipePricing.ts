import { useEffect, useRef } from 'react';
import { Recipe, RecipePriceData } from '../../types';

interface UseDishesClientRecipePricingProps {
  paginatedRecipesList: Recipe[];
  recipePrices: Record<string, RecipePriceData>;
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<any>,
    fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<any>,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<any>;
  fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<any>;
}

export function useDishesClientRecipePricing({
  paginatedRecipesList,
  recipePrices,
  updateVisibleRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
}: UseDishesClientRecipePricingProps) {
  const calculatingPricesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (paginatedRecipesList.length === 0) return;

    const recipesNeedingPrices = paginatedRecipesList.filter(
      recipe => !recipePrices[recipe.id] && !calculatingPricesRef.current.has(recipe.id),
    );

    if (recipesNeedingPrices.length > 0) {
      recipesNeedingPrices.forEach(recipe => {
        calculatingPricesRef.current.add(recipe.id);
      });

      updateVisibleRecipePrices(
        recipesNeedingPrices,
        fetchRecipeIngredients,
        fetchBatchRecipeIngredients,
      )
        .then(() => {
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        })
        .catch(err => {
          console.error('Failed to calculate visible recipe prices:', err);
          recipesNeedingPrices.forEach(recipe => {
            calculatingPricesRef.current.delete(recipe.id);
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedRecipesList.map(r => r.id).join(',')]);
}
