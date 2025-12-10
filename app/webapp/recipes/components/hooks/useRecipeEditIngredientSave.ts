import { useCallback, useState } from 'react';
import { Recipe } from '../../types';
import { COGSCalculation } from '../../../cogs/types';
import { logger } from '@/lib/logger';

interface UseRecipeEditIngredientSaveProps {
  recipe: Recipe | null;
  calculations: COGSCalculation[];
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export function useRecipeEditIngredientSave({
  recipe,
  calculations,
  showError,
  showSuccess,
}: UseRecipeEditIngredientSaveProps) {
  const [savingIngredients, setSavingIngredients] = useState(false);

  const handleSaveIngredients = useCallback(async () => {
    if (!recipe || !recipe.id) {
      showError('Recipe not found');
      return false;
    }

    if (calculations.length === 0) {
      showError('Recipe must contain at least one ingredient');
      return false;
    }

    setSavingIngredients(true);
    try {
      const recipeYield = recipe.yield || 1;
      const recipeIngredients = calculations.map(calc => ({
        ingredient_id: calc.ingredientId,
        quantity: calc.quantity * recipeYield,
        unit: calc.unit,
      }));

      const response = await fetch(`/api/recipes/${recipe.id}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: recipeIngredients, isUpdate: true }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({ error: 'Unknown error' }));
        logger.error('Failed to save recipe ingredients:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error || result.message,
          recipeId: recipe.id,
          ingredientsCount: recipeIngredients.length,
        });
        showError(
          result.error ||
            result.message ||
            `Failed to save recipe ingredients (${response.status})`,
        );
        return false;
      }

      await response.json();
      logger.dev('Recipe ingredients saved successfully');
      showSuccess('Recipe ingredients saved successfully');
      return true;
    } catch (err) {
      logger.error('Failed to save recipe ingredients:', err);
      showError('Failed to save recipe ingredients');
      return false;
    } finally {
      setSavingIngredients(false);
    }
  }, [calculations, recipe, showError, showSuccess]);

  return { savingIngredients, handleSaveIngredients };
}



