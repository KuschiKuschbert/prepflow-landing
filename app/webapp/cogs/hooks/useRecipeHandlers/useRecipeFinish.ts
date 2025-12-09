/**
 * Hook for recipe finish handler
 */

import { useCallback } from 'react';
import type { Recipe } from '../../types';
import { useNotification } from '@/contexts/NotificationContext';

interface RecipeFinishParams {
  recipes: Recipe[];
  selectedRecipe: string;
  calculations: import('../../types').COGSCalculation[];
  saveNow?: () => Promise<void>;
  setSaveError?: (error: string) => void;
}

/**
 * Hook for recipe finish handler
 *
 * @param {RecipeFinishParams} params - Handler parameters
 * @returns {Function} Recipe finish handler
 */
export function useRecipeFinishHandler({
  recipes,
  selectedRecipe,
  calculations,
  saveNow,
  setSaveError,
}: RecipeFinishParams) {
  const { showSuccess, showError } = useNotification();

  return useCallback(async () => {
    const selectedRecipeData = recipes.find(r => r.id === selectedRecipe);
    if (!selectedRecipeData || calculations.length === 0) return;
    try {
      if (saveNow) await saveNow();
      showSuccess(`Recipe "${selectedRecipeData.recipe_name}" is complete! 🎉`);
    } catch (err) {
      const errorMsg = 'Failed to save recipe. Please try again.';
      if (setSaveError) setSaveError(errorMsg);
      showError(errorMsg);
    }
  }, [recipes, selectedRecipe, calculations, saveNow, showSuccess, showError, setSaveError]);
}
