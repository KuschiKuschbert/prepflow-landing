'use client';

import { formatRecipeName } from '@/lib/text-utils';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { Recipe } from '../types';
import { RecipeError } from '../types/errors';
import { useRecipeIngredients } from './useRecipeIngredients';
import { useRecipePricing } from './useRecipePricing';
import { buildOptimisticUpdates } from './utils/buildOptimisticUpdates';
import { buildRecipeManagementReturn } from './utils/buildRecipeManagementReturn';
import { fetchRecipesWithErrorHandling } from './utils/fetchRecipesWithErrorHandling';
import { handleEditRecipe as handleEditRecipeUtil } from './utils/handleEditRecipe';
import { setupRecipeSubscriptions } from './utils/setupRecipeSubscriptions';
import { useRecipeInitialization } from './utils/useRecipeInitialization';

export function useRecipeManagement(onIngredientsChange?: (recipeId: string) => void) {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeError, setRecipeError] = useState<RecipeError | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const pricesCalculatedRef = useRef<Set<string>>(new Set());

  const capitalizeRecipeName = formatRecipeName;
  const {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices,
  } = useRecipePricing();
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError);

  const fetchRecipes = useCallback(async () => {
    await fetchRecipesWithErrorHandling(
      setLoading,
      setError,
      setRecipeError,
      setRecipes,
      setIsHydrated,
      updateVisibleRecipePrices,
      fetchRecipeIngredients,
      fetchBatchRecipeIngredients,
      pricesCalculatedRef,
    );
  }, [updateVisibleRecipePrices, fetchRecipeIngredients, fetchBatchRecipeIngredients]);

  const handleEditRecipe = useCallback(
    (recipe: Recipe) => handleEditRecipeUtil(recipe, fetchRecipeIngredients, setError, router),
    [fetchRecipeIngredients, router, setError],
  );
  // Unified subscription for all recipe-related changes
  setupRecipeSubscriptions({
    recipes,
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    onIngredientsChange,
    fetchRecipes,
  });

  // Initialize recipes from cache and pre-calculate prices
  useRecipeInitialization({
    setRecipes,
    setIsHydrated,
    pricesCalculatedRef,
    updateVisibleRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    fetchRecipes,
  });

  const { optimisticallyUpdateRecipes, rollbackRecipes } = buildOptimisticUpdates(
    setRecipes,
    fetchRecipes,
    setError,
  );

  return buildRecipeManagementReturn({
    recipes,
    loading,
    error,
    recipeError,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
    handleEditRecipe,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices,
    optimisticallyUpdateRecipes,
    rollbackRecipes,
    setError,
  });
}
