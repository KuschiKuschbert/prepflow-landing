import { useCallback, useRef } from 'react';
import { Recipe, RecipeIngredientWithDetails } from '../../types';

import { logger } from '../../lib/logger';
/**
 * Hook to manage recipe modal handlers.
 *
 * @param {Object} params - Modal handler parameters
 * @returns {Object} Modal handlers
 */
export function useRecipeModalHandlers({
  fetchRecipeIngredients,
  setError,
  generateAIInstructions,
  clearChangedFlag,
  handleDuplicateRecipe,
  handleShareRecipe,
  aiInstructions,
}: {
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setError: (error: string) => void;
  generateAIInstructions: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => Promise<void>;
  clearChangedFlag: (recipeId: string) => void;
  handleDuplicateRecipe: (recipe: Recipe) => Promise<Recipe | null>;
  handleShareRecipe: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
    instructions: string,
  ) => void;
  aiInstructions: string;
}) {
  const handlePreviewRecipe = useCallback(
    async (recipe: Recipe) => {
      try {
        logger.dev('[RecipesClient] Opening unified modal:', recipe.id);
        const ingredients = await fetchRecipeIngredients(recipe.id);
        logger.dev('[RecipesClient] Fetched:', ingredients.length);
        clearChangedFlag(recipe.id);
        await generateAIInstructions(recipe, ingredients);
        return { recipe, ingredients };
      } catch (err) {
        logger.error('❌ Error in handlePreviewRecipe:', err);
        setError('Failed to load recipe');
        return null;
      }
    },
    [fetchRecipeIngredients, setError, generateAIInstructions, clearChangedFlag],
  );

  const handleDuplicateRecipeWrapper = useCallback(
    async (
      selectedRecipe: Recipe | null,
      handlePreviewRecipe: (recipe: Recipe) => Promise<any>,
    ) => {
      if (!selectedRecipe) return;
      const duplicated = await handleDuplicateRecipe(selectedRecipe);
      if (duplicated) {
        setTimeout(() => {
          handlePreviewRecipe(duplicated);
        }, 500);
        return duplicated;
      }
      return null;
    },
    [handleDuplicateRecipe],
  );

  const handleShareRecipeWrapper = useCallback(
    (selectedRecipe: Recipe | null, recipeIngredients: RecipeIngredientWithDetails[]) => {
      if (!selectedRecipe || !recipeIngredients.length) return;
      handleShareRecipe(selectedRecipe, recipeIngredients, aiInstructions);
    },
    [handleShareRecipe, aiInstructions],
  );

  return {
    handlePreviewRecipe,
    handleDuplicateRecipeWrapper,
    handleShareRecipeWrapper,
  };
}
