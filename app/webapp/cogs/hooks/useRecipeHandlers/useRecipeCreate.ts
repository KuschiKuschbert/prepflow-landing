/**
 * Hook for recipe creation handler
 */

import { useCallback } from 'react';
import type { Recipe } from '../../types';
import { useNotification } from '@/contexts/NotificationContext';
import { useOnRecipeCreated } from '@/lib/personality/hooks';

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
