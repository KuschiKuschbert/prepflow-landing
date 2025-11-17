import { Recipe, RecipeIngredientWithDetails } from '../../../types';

import { logger } from '../../lib/logger';
/**
 * Handle preview recipe action.
 *
 * @param {Object} params - Preview parameters
 */
export async function handlePreviewRecipe({
  recipe,
  fetchRecipeIngredients,
  setSelectedRecipe,
  setRecipeIngredients,
  setPreviewYield,
  setShowUnifiedModal,
  clearChangedFlag,
  generateAIInstructions,
  setError,
}: {
  recipe: Recipe;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setRecipeIngredients: (ingredients: RecipeIngredientWithDetails[]) => void;
  setPreviewYield: (yieldValue: number) => void;
  setShowUnifiedModal: (show: boolean) => void;
  clearChangedFlag: (recipeId: string) => void;
  generateAIInstructions: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => Promise<void>;
  setError: (error: string) => void;
}): Promise<void> {
  try {
    logger.dev('[RecipesClient] Opening unified modal:', recipe.id);
    const ingredients = await fetchRecipeIngredients(recipe.id);
    logger.dev('[RecipesClient] Fetched:', ingredients.length);
    setSelectedRecipe(recipe);
    setRecipeIngredients(ingredients);
    setPreviewYield(recipe.yield || 1);
    setShowUnifiedModal(true);
    clearChangedFlag(recipe.id);
    await generateAIInstructions(recipe, ingredients);
  } catch (err) {
    logger.error('❌ Error in handlePreviewRecipe:', err);
    setError('Failed to load recipe');
  }
}
