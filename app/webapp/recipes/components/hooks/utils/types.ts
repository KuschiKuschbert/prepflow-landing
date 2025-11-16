import { Recipe, RecipeIngredientWithDetails } from '../../../types';

/**
 * Parameters for useRecipeHandlers hook.
 */
export interface UseRecipeHandlersParams {
  selectedRecipe: Recipe | null;
  previewYield: number;
  recipeIngredients: RecipeIngredientWithDetails[];
  aiInstructions: string;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setRecipeIngredients: (ingredients: RecipeIngredientWithDetails[]) => void;
  setPreviewYield: (yieldValue: number) => void;
  setShowUnifiedModal: (show: boolean) => void;
  setEditingRecipe: (recipe: Recipe | null) => void;
  setShowRecipeEditDrawer: (show: boolean) => void;
  setError: (error: string) => void;
  clearChangedFlag: (recipeId: string) => void;
  generateAIInstructions: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => Promise<void>;
  handleDuplicateRecipe: (recipe: Recipe) => Promise<Recipe | null>;
  handleShareRecipe: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
    aiInstructions: string,
  ) => void;
}
