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
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => {
      const prices: Record<string, RecipePriceData> = {};

      if (recipesData.length === 0) {
        setRecipePrices(prices);
        return;
      }

      // Try batch fetch first if available
      if (fetchBatchRecipeIngredients) {
        try {
          const recipeIds = recipesData.map(r => r.id);
          const batchIngredients = await fetchBatchRecipeIngredients(recipeIds);
          if (Object.keys(batchIngredients).length > 0) {
            for (const recipe of recipesData) {
              try {
                const ingredients = batchIngredients[recipe.id] || [];
                const priceData = calculateRecommendedPrice(recipe, ingredients);
                if (priceData) prices[recipe.id] = priceData;
              } catch (err) {
                console.log(`Failed to calculate price for recipe ${recipe.id}:`, err);
              }
            }
            setRecipePrices(prices);
            return;
          }
        } catch (err) {
          console.log('Batch fetch failed, falling back to parallel individual calls:', err);
        }
      }
      // Fallback: parallel individual fetches
      try {
        const results = await Promise.all(
          recipesData.map(async recipe => {
            try {
              const ingredients = await fetchRecipeIngredients(recipe.id);
              const priceData = calculateRecommendedPrice(recipe, ingredients);
              return { recipeId: recipe.id, priceData };
            } catch (err) {
              console.log(`Failed to calculate price for recipe ${recipe.id}:`, err);
              return { recipeId: recipe.id, priceData: null };
            }
          }),
        );
        results.forEach(({ recipeId, priceData }) => {
          if (priceData) prices[recipeId] = priceData;
        });
      } catch (err) {
        console.error('Failed to calculate recipe prices:', err);
      }

      setRecipePrices(prices);
    },
    [calculateRecommendedPrice],
  );

  const refreshRecipePrices = useCallback(
    async (
      recipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => {
      if (recipes.length === 0) return;
      try {
        await calculateAllRecipePrices(
          recipes,
          fetchRecipeIngredients,
          fetchBatchRecipeIngredients,
        );
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
