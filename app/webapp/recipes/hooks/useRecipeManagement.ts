'use client';

import { formatRecipeName } from '@/lib/text-utils';
import { cacheRecipes, getCachedRecipes, prefetchRecipes } from '@/lib/cache/recipe-cache';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Recipe } from '../types';
import { useRecipeIngredients } from './useRecipeIngredients';
import { useRecipePricing } from './useRecipePricing';
import { useRecipePriceSubscription } from './useRecipePriceSubscription';
import { convertToCOGSCalculations } from './utils/recipeCalculationHelpers';
import { storeRecipeForEditing } from './utils/recipeEditHelpers';

export function useRecipeManagement() {
  const router = useRouter();
  // Initialize with cached recipes for instant display
  const [recipes, setRecipes] = useState<Recipe[]>(() => getCachedRecipes() || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use centralized formatting utility
  const capitalizeRecipeName = formatRecipeName;

  // Use pricing hook
  const { recipePrices, calculateRecommendedPrice, calculateAllRecipePrices, refreshRecipePrices } =
    useRecipePricing();

  // Use ingredients hook
  const { fetchRecipeIngredients, fetchBatchRecipeIngredients } = useRecipeIngredients(setError);

  const fetchRecipes = useCallback(async () => {
    const cached = getCachedRecipes();
    if (cached && cached.length > 0) setRecipes(cached);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/recipes', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Failed to fetch recipes');
        setLoading(false);
      } else {
        const recipesList = result.recipes || [];
        cacheRecipes(recipesList);
        setRecipes(recipesList);
        setLoading(false);
        calculateAllRecipePrices(
          recipesList,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        ).catch(err => {
          console.error('Background price calculation failed:', err);
        });
      }
    } catch (err) {
      setError('Failed to fetch recipes');
      setLoading(false);
    }
  }, [calculateAllRecipePrices, fetchRecipeIngredients, fetchBatchRecipeIngredients]);

  const handleEditRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        const ingredients = await fetchRecipeIngredients(recipe.id);
        const calculations = convertToCOGSCalculations(ingredients, recipe.id);
        storeRecipeForEditing(recipe, calculations);
        router.push('/webapp/cogs');
      } catch (err) {
        setError('Failed to load recipe for editing');
      }
    },
    [fetchRecipeIngredients, router, setError],
  );

  useRecipePriceSubscription(
    recipes,
    refreshRecipePrices,
    fetchRecipeIngredients,
    fetchBatchRecipeIngredients,
  );
  useEffect(() => {
    prefetchRecipes();
    fetchRecipes();
  }, [fetchRecipes]);

  return {
    recipes,
    loading,
    error,
    recipePrices,
    capitalizeRecipeName,
    fetchRecipes,
    fetchRecipeIngredients,
    handleEditRecipe,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    refreshRecipePrices: () =>
      refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients),
    setError,
  };
}
