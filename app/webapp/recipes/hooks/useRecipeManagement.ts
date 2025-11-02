'use client';

import { formatRecipeName } from '@/lib/text-utils';
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
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use centralized formatting utility
  const capitalizeRecipeName = formatRecipeName;

  // Use pricing hook
  const { recipePrices, calculateRecommendedPrice, calculateAllRecipePrices, refreshRecipePrices } =
    useRecipePricing();

  // Use ingredients hook
  const { fetchRecipeIngredients } = useRecipeIngredients(setError);

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/recipes', {
        cache: 'no-store',
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to fetch recipes');
      } else {
        setRecipes(result.recipes || []);

        // Calculate prices for each recipe
        await calculateAllRecipePrices(result.recipes || [], fetchRecipeIngredients);
      }
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, [calculateAllRecipePrices, fetchRecipeIngredients]);

  const handleEditRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        const ingredients = await fetchRecipeIngredients(recipe.id);
        const calculations = convertToCOGSCalculations(ingredients);
        storeRecipeForEditing(recipe, calculations);
        router.push('/webapp/cogs');
      } catch (err) {
        setError('Failed to load recipe for editing');
      }
    },
    [fetchRecipeIngredients, router, setError],
  );

  // Listen for ingredient price changes and update recipe prices automatically
  useRecipePriceSubscription(recipes, refreshRecipePrices, fetchRecipeIngredients);

  useEffect(() => {
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
    refreshRecipePrices: () => refreshRecipePrices(recipes, fetchRecipeIngredients),
    setError,
  };
}
