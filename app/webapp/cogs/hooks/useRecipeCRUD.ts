// PrepFlow - Recipe CRUD Operations Hook
// Extracted from useRecipeSaving.ts to meet file size limits

'use client';

import { logger } from '@/lib/logger';
import { formatDishName } from '@/lib/text-utils';
import { useCallback } from 'react';

interface RecipeIngredientInsert {
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
}

interface UseRecipeCRUDProps {
  setError: (error: string) => void;
}

export function useRecipeCRUD({ setError }: UseRecipeCRUDProps) {
  const createOrUpdateRecipe = useCallback(
    async (recipeName: string, dishPortions: number) => {
      const formattedName = formatDishName(recipeName);

      try {
        const response = await fetch('/api/recipes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formattedName,
            yield: dishPortions || 1,
            yield_unit: 'servings',
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || result.error || 'Failed to save recipe');
          return null;
        }

        return { recipe: result.recipe, isNew: result.isNew };
      } catch (err) {
        logger.error('[useRecipeCRUD.ts] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        const errorMessage = err instanceof Error ? err.message : 'Failed to save recipe';
        setError(errorMessage);
        return null;
      }
    },
    [setError],
  );

  const saveRecipeIngredients = useCallback(
    async (
      recipeId: string,
      recipeIngredientInserts: RecipeIngredientInsert[],
      isUpdate: boolean,
    ) => {
      try {
        const response = await fetch(`/api/recipes/${recipeId}/ingredients`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ingredients: recipeIngredientInserts,
            isUpdate,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          return { error: result.message || result.error || 'Failed to save recipe ingredients' };
        }

        return { success: true };
      } catch (err) {
        logger.error('[useRecipeCRUD.ts] Error in catch block:', {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });

        const errorMessage =
          err instanceof Error ? err.message : 'Failed to save recipe ingredients';
        return { error: errorMessage };
      }
    },
    [],
  );

  return {
    createOrUpdateRecipe,
    saveRecipeIngredients,
  };
}
