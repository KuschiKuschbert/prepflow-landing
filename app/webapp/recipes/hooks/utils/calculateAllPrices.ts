import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';
import {
  executeBatchCalculation,
  executeIndividualCalculation,
} from './price-calculation-strategies';

/**
 * Calculate prices for all recipes using batch fetch or fallback to parallel individual fetches.
 *
 * @param {Object} params - Calculation parameters
 * @returns {Promise<Record<string, RecipePriceData>>} Prices by recipe ID
 */
export async function calculateAllPrices({
  recipesData,
  fetchRecipeIngredients,
  fetchBatchRecipeIngredients,
  calculateRecommendedPrice,
  fetchBatchWithDeduplication,
}: {
  recipesData: Recipe[];
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients?: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
  fetchBatchWithDeduplication: (
    recipeIds: string[],
    fetchBatchRecipeIngredients: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
}): Promise<Record<string, RecipePriceData>> {
  if (recipesData.length === 0) {
    return {};
  }

  // Try batch strategy first if available
  if (fetchBatchRecipeIngredients) {
    const batchPrices = await executeBatchCalculation({
      recipesData,
      fetchBatchRecipeIngredients,
      calculateRecommendedPrice,
      fetchBatchWithDeduplication,
    });

    if (batchPrices) {
      return batchPrices;
    }
  }

  // Fallback or default to individual strategy
  return executeIndividualCalculation({
    recipesData,
    fetchRecipeIngredients,
    calculateRecommendedPrice,
  });
}
