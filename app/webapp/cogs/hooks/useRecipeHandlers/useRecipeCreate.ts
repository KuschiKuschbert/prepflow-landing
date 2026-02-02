/**
 * Hook for recipe creation handler
 */

import { useCallback } from 'react';
import type { Recipe } from '@/lib/types/cogs';
import { useNotification } from '@/contexts/NotificationContext';
import { useOnRecipeCreated } from '@/lib/personality/hooks';
import { logger } from '@/lib/logger';

interface RecipeCreateParams {
  dishPortions: number;
  recipes: Recipe[];
  createOrUpdateRecipe: (
    name: string,
    portions: number,
  ) => Promise<{ recipe: Recipe; isNew: boolean } | null>;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setSelectedRecipe: (id: string) => void;
  setDishPortions: (portions: number) => void;
}

/**
 * Hook for recipe creation handler
 *
 * @param {RecipeCreateParams} params - Handler parameters
 * @returns {Function} Recipe creation handler
 */
export function useRecipeCreateHandler({
  dishPortions,
  recipes,
  createOrUpdateRecipe,
  setRecipes,
  setSelectedRecipe,
  setDishPortions,
}: RecipeCreateParams) {
  const { showSuccess, showError } = useNotification();
  const onRecipeCreated = useOnRecipeCreated();

  return useCallback(
    async (name: string) => {
      // Store original state for rollback
      const originalRecipes = [...recipes];

      try {
        const result = await createOrUpdateRecipe(name, dishPortions);
        if (result && result.recipe) {
          // Optimistically add recipe to list immediately
          setRecipes(prev => [...prev, result.recipe!]);

          setSelectedRecipe(result.recipe.id);
          setDishPortions(result.recipe.yield || 1);
          showSuccess(`Recipe "${result.recipe.recipe_name}" created successfully!`);

          // Trigger personality hook for new recipes
          if (result.isNew) {
            onRecipeCreated();
          }
          return result.recipe;
        }
        return null;
      } catch (error) {
        // Rollback on error
        setRecipes(originalRecipes);
        logger.error('[useRecipeCreate] Error creating recipe:', {
          error: error instanceof Error ? error.message : String(error),
          name,
        });
        showError("Couldn't create that recipe, chef. Give it another shot.");
        throw error; // Re-throw to let caller handle
      }
    },
    [
      dishPortions,
      recipes,
      createOrUpdateRecipe,
      setRecipes,
      setSelectedRecipe,
      setDishPortions,
      showSuccess,
      showError,
      onRecipeCreated,
    ],
  );
}
