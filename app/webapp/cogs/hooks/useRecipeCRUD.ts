// PrepFlow - Recipe CRUD Operations Hook
// Extracted from useRecipeSaving.ts to meet file size limits

'use client';

import { logger } from '@/lib/logger';
import { formatDishName } from '@/lib/text-utils';
import { useCallback } from 'react';
import type { Recipe } from '@/lib/types/cogs';

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

        interface RecipeApiResponse {
          success: boolean;
          recipe?: Recipe;
          isNew?: boolean;
          message?: string;
          error?: string;
        }

        const result = (await response.json()) as RecipeApiResponse;

        if (!response.ok) {
          setError(result.message || result.error || 'Failed to save recipe');
          return null;
        }

        return { recipe: result.recipe as Recipe, isNew: !!result.isNew };
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error('[useRecipeCRUD.ts] Error in catch block:', {
          error: error.message,
          stack: error.stack,
        });

        setError(error.message || 'Failed to save recipe');
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

        interface IngredientsApiResponse {
          success: boolean;
          message?: string;
          error?: string;
        }

        const result = (await response.json()) as IngredientsApiResponse;

        if (!response.ok) {
          return { error: result.message || result.error || 'Failed to save recipe ingredients' };
        }

        return { success: true };
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        logger.error('[useRecipeCRUD.ts] Error in catch block:', {
          error: error.message,
          stack: error.stack,
        });

        return { error: error.message || 'Failed to save recipe ingredients' };
      }
    },
    [],
  );

  return {
    createOrUpdateRecipe,
    saveRecipeIngredients,
  };
}
