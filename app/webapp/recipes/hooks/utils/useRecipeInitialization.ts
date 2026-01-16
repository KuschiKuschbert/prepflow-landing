import { useEffect, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../../types';
import { initializeRecipes } from './initializeRecipes';
import { precalculatePrices } from './precalculatePrices';

/**
 * Hook to initialize recipes from cache and pre-calculate prices.
 *
 * @param {Object} params - Initialization parameters
 */
export function useRecipeInitialization({
  setRecipes,
  setIsHydrated,
  pricesCalculatedRef,
  updateVisibleRecipePrices,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  fetchRecipes,
}: {
  setRecipes: (recipes: Recipe[]) => void;
  setIsHydrated: (hydrated: boolean) => void;
  pricesCalculatedRef: React.MutableRefObject<Set<string>>;
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  fetchRecipes: () => Promise<void>;
}): void {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;

    const cached = initializeRecipes(setRecipes, setIsHydrated);
    if (cached.length > 0 && mounted) {
      precalculatePrices(
        cached,
        pricesCalculatedRef,
        updateVisibleRecipePrices,
        fetchRecipeIngredients,
        fetchBatchRecipeIngredients,
      );
    }

    fetchRecipes();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount
}
