'use client';

import { useState, useCallback } from 'react';
import type { COGSCalculation } from '../types';
import { useRecipeValidation } from './useRecipeValidation';
import { useRecipeCRUD } from './useRecipeCRUD';
import { useNotification } from '@/contexts/NotificationContext';
import { usePrompt } from '@/hooks/usePrompt';
import { useOnRecipeCreated } from '@/lib/personality/hooks';
import { logger } from '@/lib/logger';
import { saveRecipeWithIngredients } from './useRecipeSaving/saveLogic';

export const useRecipeSaving = () => {
  const [error, setError] = useState<string | null>(null);
  const { showSuccess } = useNotification();
  const { showPrompt, InputDialog } = usePrompt();
  const { validateCalculations } = useRecipeValidation();
  const { createOrUpdateRecipe, saveRecipeIngredients } = useRecipeCRUD({ setError });
  const onRecipeCreated = useOnRecipeCreated();

  const saveAsRecipe = useCallback(
    async (calculations: COGSCalculation[], dishName: string, dishPortions: number) => {
      try {
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

        await saveRecipeWithIngredients({
          calculations,
          dishName: rawRecipeName,
          dishPortions,
          validateCalculations,
          createOrUpdateRecipe,
          saveRecipeIngredients,
          setError,
          showSuccess,
          onRecipeCreated,
        });
      } catch (error) {
        logger.error('[useRecipeSaving] Error saving recipe:', {
          error: error instanceof Error ? error.message : String(error),
          dishName,
        });
        setError('Failed to save recipe');
        // Error is already handled by saveRecipeWithIngredients via setError
      }
    },
    [
      validateCalculations,
      createOrUpdateRecipe,
      saveRecipeIngredients,
      showSuccess,
      showPrompt,
      onRecipeCreated,
    ],
  );

  const clearMessages = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    saveAsRecipe,
    clearMessages,
    setError,
    InputDialog,
  };
};
