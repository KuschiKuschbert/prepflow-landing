import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';

/**
 * Build return object for useRecipePricing hook.
 *
 * @param {Object} params - Return object parameters
 * @returns {Object} Hook return object
 */
export function buildPricingReturn({
  recipePrices,
  calculateRecommendedPrice,
  calculateAllRecipePrices,
  calculateVisibleRecipePrices,
  updateVisibleRecipePrices,
  refreshRecipePrices,
}: {
  recipePrices: Record<string, RecipePriceData>;
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
  calculateAllRecipePrices: (
    recipesData: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  calculateVisibleRecipePrices: (
    visibleRecipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipePriceData>>;
  updateVisibleRecipePrices: (
    visibleRecipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      recipeIds: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
}) {
  return {
    recipePrices,
    calculateRecommendedPrice,
    calculateAllRecipePrices,
    calculateVisibleRecipePrices,
    updateVisibleRecipePrices,
    refreshRecipePrices,
  };
}
