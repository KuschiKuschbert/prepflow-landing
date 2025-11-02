'use client';

import { useCallback, useState } from 'react';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../types';
import { calculateRecipePrice } from './utils/pricingHelpers';

export function useRecipePricing() {
  const [recipePrices, setRecipePrices] = useState<Record<string, RecipePriceData>>({});

  const calculateRecommendedPrice = useCallback(
    (recipe: Recipe, ingredients: RecipeIngredientWithDetails[]) => {
      return calculateRecipePrice(recipe, ingredients);
    },
    [],
  );

  // Calculate prices for all recipes
  const calculateAllRecipePrices = useCallback(
    async (
      recipesData: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    ) => {
      const prices: Record<string, RecipePriceData> = {};

      for (const recipe of recipesData) {
        try {
          const ingredients = await fetchRecipeIngredients(recipe.id);
          const priceData = calculateRecommendedPrice(recipe, ingredients);
          if (priceData) {
            prices[recipe.id] = priceData;
          }
        } catch (err) {
          console.log(`Failed to calculate price for recipe ${recipe.id}:`, err);
        }
      }

      setRecipePrices(prices);
    },
    [calculateRecommendedPrice],
  );

  // Refresh recipe prices (for auto-updates)
  const refreshRecipePrices = useCallback(
    async (
      recipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    ) => {
      if (recipes.length === 0) return;

      try {
        await calculateAllRecipePrices(recipes, fetchRecipeIngredients);
      } catch (err) {
        console.log('Failed to refresh recipe prices:', err);
      }
    },
    [calculateAllRecipePrices],
  );

  return {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    refreshRecipePrices,
  };
}
