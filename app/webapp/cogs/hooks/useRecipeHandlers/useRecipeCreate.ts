/**
 * Hook for recipe creation handler
 */

import { useCallback } from 'react';
import type { Recipe } from '../../types';
import { useNotification } from '@/contexts/NotificationContext';
import { useOnRecipeCreated } from '@/lib/personality/hooks';
import { logger } from '@/lib/logger';

interface RecipeCreateParams {
  dishPortions: number;
  createOrUpdateRecipe: (
    name: string,
    portions: number,
  ) => Promise<{ recipe: Recipe; isNew: boolean } | null>;
  fetchData: () => Promise<void>;
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
  createOrUpdateRecipe,
  fetchData,
  setSelectedRecipe,
  setDishPortions,
}: RecipeCreateParams) {
  const { showSuccess } = useNotification();
  const onRecipeCreated = useOnRecipeCreated();

  return useCallback(
    async (name: string) => {
      try {
        const result = await createOrUpdateRecipe(name, dishPortions);
        if (result) {
          await fetchData();
          if (result.recipe) {
            setSelectedRecipe(result.recipe.id);
            setDishPortions(result.recipe.yield || 1);
            showSuccess(`Recipe "${result.recipe.recipe_name}" created successfully!`);

            // Trigger personality hook for new recipes
            if (result.isNew) {
              onRecipeCreated();
            }
          }
          return result.recipe;
        }
        return null;
      } catch (error) {
        logger.error('[useRecipeCreate] Error creating recipe:', {
          error: error instanceof Error ? error.message : String(error),
          name,
        });
        // Optionally show a toast or alert to the user
        throw error; // Re-throw to let caller handle
      }
    },
    [
      dishPortions,
      createOrUpdateRecipe,
      fetchData,
      setSelectedRecipe,
      setDishPortions,
      showSuccess,
      onRecipeCreated,
    ],
  );
}
