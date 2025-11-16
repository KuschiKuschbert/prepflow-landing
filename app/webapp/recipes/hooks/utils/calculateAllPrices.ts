import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';

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
  const prices: Record<string, RecipePriceData> = {};

  if (recipesData.length === 0) {
    return prices;
  }

  if (fetchBatchRecipeIngredients) {
    try {
      const recipeIds = recipesData.map(r => r.id);
      const batchIngredients = await fetchBatchWithDeduplication(
        recipeIds,
        fetchBatchRecipeIngredients,
      );
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
        return prices;
      }
    } catch (err) {
      console.log('Batch fetch failed, falling back to parallel individual calls:', err);
    }
  }

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

  return prices;
}
