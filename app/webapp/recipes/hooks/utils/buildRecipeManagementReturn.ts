import { Recipe, RecipeIngredientWithDetails, RecipePriceData } from '../../types';
import { RecipeError } from '../../types/errors';

/**
 * Build return object for useRecipeManagement hook.
 *
 * @param {Object} params - Parameters for building return object
 * @returns {Object} Hook return object
 */
export function buildRecipeManagementReturn({
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
}: {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  recipeError: RecipeError | null;
  recipePrices: Record<string, RecipePriceData>;
  capitalizeRecipeName: (name: string) => string;
  fetchRecipes: () => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  fetchBatchRecipeIngredients: (
    recipeIds: string[],
  ) => Promise<Record<string, RecipeIngredientWithDetails[]>>;
  handleEditRecipe: (recipe: Recipe) => Promise<void>;
  calculateRecommendedPrice: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => RecipePriceData | null;
  calculateAllRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (id: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      ids: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  calculateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (id: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      ids: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<Record<string, RecipePriceData>>;
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (id: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      ids: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: (id: string) => Promise<RecipeIngredientWithDetails[]>,
    fetchBatchRecipeIngredients?: (
      ids: string[],
    ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
  ) => Promise<void>;
  optimisticallyUpdateRecipes: (updater: (recipes: Recipe[]) => Recipe[]) => void;
  rollbackRecipes: () => void;
  setError: (error: string | null) => void;
}) {
  return {
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
    refreshRecipePrices: () =>
      refreshRecipePrices(recipes, fetchRecipeIngredients, fetchBatchRecipeIngredients),
    optimisticallyUpdateRecipes,
    rollbackRecipes,
    setError,
  };
}
