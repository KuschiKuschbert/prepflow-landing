import { Recipe } from '../../types';
import { RecipePriceData } from '../../types';

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
  recipeError: any;
  recipePrices: Record<string, RecipePriceData>;
  capitalizeRecipeName: (name: string) => string;
  fetchRecipes: () => Promise<void>;
  fetchRecipeIngredients: (recipeId: string) => Promise<any[]>;
  fetchBatchRecipeIngredients: (recipeIds: string[]) => Promise<Record<string, any[]>>;
  handleEditRecipe: (recipe: Recipe) => Promise<void>;
  calculateRecommendedPrice: (recipe: Recipe, ingredients: any[]) => any;
  calculateAllRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: any,
    fetchBatchRecipeIngredients?: any,
  ) => Promise<void>;
  calculateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: any,
    fetchBatchRecipeIngredients?: any,
  ) => Promise<Record<string, any>>;
  updateVisibleRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: any,
    fetchBatchRecipeIngredients?: any,
  ) => Promise<void>;
  refreshRecipePrices: (
    recipes: Recipe[],
    fetchRecipeIngredients: any,
    fetchBatchRecipeIngredients?: any,
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
