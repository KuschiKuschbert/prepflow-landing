'use client';

import { useState, useCallback } from 'react';
import { COGSCalculation } from '../types';
import { useRecipeValidation } from './useRecipeValidation';
import { useRecipeCRUD } from './useRecipeCRUD';

import { logger } from '@/lib/logger';
export const useRecipeSaving = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { validateCalculations } = useRecipeValidation();
  const { createOrUpdateRecipe, saveRecipeIngredients } = useRecipeCRUD({ setError });

  const saveAsRecipe = useCallback(
    async (calculations: COGSCalculation[], dishName: string, dishPortions: number) => {
      if (calculations.length === 0) {
        setError('No calculations to save. Please calculate COGS first.');
        return;
      }

      const rawRecipeName = dishName || prompt('Enter a name for this recipe:');
      if (!rawRecipeName) return;

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
        setSuccessMessage(
          `Recipe "${recipe.recipe_name}" ${actionText} successfully to Recipe Book!`,
        );
        setTimeout(() => setSuccessMessage(null), 5000);
      } catch (err: any) {
        logger.error('Recipe save error:', err);
        const errorMessage =
          err?.message || (err?.code ? `Database error (${err.code})` : 'Failed to save recipe');
        setError(`Failed to save recipe: ${errorMessage}`);
        setSuccessMessage(null);
      } finally {
        setLoading(false);
      }
    },
    [validateCalculations, createOrUpdateRecipe, saveRecipeIngredients],
  );

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  return {
    loading,
    error,
    successMessage,
    saveAsRecipe,
    clearMessages,
    setError,
    setSuccessMessage,
  };
};
