import { logger } from '@/lib/logger';
import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '@/lib/types/recipes';

type CalculatorFn = (
  recipe: Recipe,
  ingredients: RecipeIngredientWithDetails[],
) => RecipePriceData | null;

export async function executeBatchCalculation({
  recipesData,
  fetchBatchRecipeIngredients,
  calculateRecommendedPrice,
  fetchBatchWithDeduplication,
}: {
  recipesData: Recipe[];
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  calculateRecommendedPrice: CalculatorFn;
  fetchBatchWithDeduplication: (
    recipeIds: string[],
    fetchBatchFn: (recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
}): Promise<Record<string, RecipePriceData> | null> {
  try {
    const recipeIds = recipesData.map(r => r.id);
    const batchIngredients = await fetchBatchWithDeduplication(
      recipeIds,
      fetchBatchRecipeIngredients,
    );

    if (Object.keys(batchIngredients).length === 0) {
      return null;
    }

    const prices: Record<string, RecipePriceData> = {};
    for (const recipe of recipesData) {
      try {
        const ingredients = batchIngredients[recipe.id] || [];
        const priceData = calculateRecommendedPrice(recipe, ingredients);
        if (priceData) prices[recipe.id] = priceData;
      } catch (err) {
        logger.dev(`Failed to calculate price for recipe ${recipe.id}:`, {
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    return prices;
  } catch (err) {
    logger.dev('Batch fetch failed, falling back to parallel individual calls:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

export async function executeIndividualCalculation({
  recipesData,
  fetchRecipeIngredients,
  calculateRecommendedPrice,
}: {
  recipesData: Recipe[];
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  calculateRecommendedPrice: CalculatorFn;
}): Promise<Record<string, RecipePriceData>> {
  const prices: Record<string, RecipePriceData> = {};

  try {
    const results = await Promise.all(
      recipesData.map(async recipe => {
        try {
          const ingredients = await fetchRecipeIngredients(recipe.id);
          const priceData = calculateRecommendedPrice(recipe, ingredients);
          return { recipeId: recipe.id, priceData };
        } catch (err) {
          logger.dev(`Failed to calculate price for recipe ${recipe.id}:`, {
            error: err instanceof Error ? err.message : String(err),
          });
          return { recipeId: recipe.id, priceData: null };
        }
      }),
    );

    results.forEach(({ recipeId, priceData }) => {
      if (priceData) prices[recipeId] = priceData;
    });
  } catch (err) {
    logger.error('Failed to calculate recipe prices:', err);
  }

  return prices;
}
