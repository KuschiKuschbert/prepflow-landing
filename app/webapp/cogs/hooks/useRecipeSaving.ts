'use client';

import { useState, useCallback } from 'react';
import { COGSCalculation } from '../types';
import { useRecipeValidation } from './useRecipeValidation';
import { useRecipeCRUD } from './useRecipeCRUD';
import { useNotification } from '@/contexts/NotificationContext';
import { usePrompt } from '@/hooks/usePrompt';
import { useOnRecipeCreated } from '@/lib/personality/hooks';

import { logger } from '@/lib/logger';
export const useRecipeSaving = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess } = useNotification();
  const { showPrompt, InputDialog } = usePrompt();
  const { validateCalculations } = useRecipeValidation();
  const { createOrUpdateRecipe, saveRecipeIngredients } = useRecipeCRUD({ setError });
  const onRecipeCreated = useOnRecipeCreated();

  const saveAsRecipe = useCallback(
    async (calculations: COGSCalculation[], dishName: string, dishPortions: number) => {
      if (calculations.length === 0) {
        setError('No calculations to save. Please calculate COGS first.');
        return;
      }

      let rawRecipeName = dishName;
      if (!rawRecipeName) {
        const promptResult = await showPrompt({
          title: 'Save Recipe',
          message: 'What should we call this recipe?',
          placeholder: 'Recipe name',
          type: 'text',
          validation: v => (v.trim().length > 0 ? null : 'Recipe name is required'),
        });
        if (!promptResult) return;
        rawRecipeName = promptResult;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await createOrUpdateRecipe(rawRecipeName, dishPortions);
        if (!result) return;

        const { recipe, isNew } = result;

        const validCalculations = validateCalculations(calculations);
        if (validCalculations.length === 0) {
          setError(
            'No valid ingredients to save. Please ensure all ingredients have valid IDs and quantities.',
          );
          return;
        }

        const recipeIngredientInserts = validCalculations.map(calc => ({
          recipe_id: recipe.id,
          ingredient_id: calc.ingredientId,
          quantity: calc.quantity,
          unit: calc.unit,
        }));

        const saveResult = await saveRecipeIngredients(recipe.id, recipeIngredientInserts, !isNew);
        if (saveResult.error) {
          setError(saveResult.error);
          return;
        }

        setError(null);
        const actionText = isNew ? 'saved' : 'updated';
        showSuccess(`Recipe "${recipe.recipe_name}" ${actionText} successfully to Recipe Book!`);

        // Trigger personality hook for new recipes
        if (isNew) {
          onRecipeCreated();
        }
      } catch (err: any) {
        logger.error('Recipe save error:', err);
        const errorMessage =
          err?.message || (err?.code ? `Database error (${err.code})` : 'Failed to save recipe');
        setError(`Failed to save recipe: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
    [validateCalculations, createOrUpdateRecipe, saveRecipeIngredients, showSuccess, showPrompt, onRecipeCreated],
  );

  const clearMessages = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    saveAsRecipe,
    clearMessages,
    setError,
    InputDialog,
  };
};
