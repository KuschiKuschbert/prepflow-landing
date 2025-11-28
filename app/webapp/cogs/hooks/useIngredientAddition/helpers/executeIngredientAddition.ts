/**
 * Helper function to execute ingredient addition logic
 */

import { logger } from '@/lib/logger';
import { validateIngredientInput } from '../../helpers/ingredientValidation';
import { processIngredientAddition } from '../../helpers/ingredientProcessing';
import type { Ingredient } from '../../../types';

interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

interface ExecuteIngredientAdditionParams {
  newIngredient: NewIngredient;
  ingredients: Ingredient[];
  selectedRecipe: string | null;
  currentCalculations: import('../../../types').COGSCalculation[];
  convertIngredientQuantity: (
    quantity: number,
    userUnit: string,
    ingredientUnit: string,
  ) => { convertedQuantity: number; convertedUnit: string; conversionNote: string };
  updateCalculation: (ingredientId: string, quantity: number) => void;
  addCalculation: (calc: import('../../../types').COGSCalculation) => void;
  resetForm: () => void;
  setSaveError: (error: string) => void;
}

export function executeIngredientAddition({
  newIngredient,
  ingredients,
  selectedRecipe,
  currentCalculations,
  convertIngredientQuantity,
  updateCalculation,
  addCalculation,
  resetForm,
  setSaveError,
}: ExecuteIngredientAdditionParams): boolean {
  logger.dev('[useIngredientAddition] Attempting to add ingredient:', {
    ingredient_id: newIngredient.ingredient_id,
    quantity: newIngredient.quantity,
    unit: newIngredient.unit,
  });

  // Clear any previous errors
  setSaveError('');

  // Validate input
  if (!validateIngredientInput(newIngredient, setSaveError)) {
    logger.warn('[useIngredientAddition] Validation failed:', {
      ingredient_id: newIngredient.ingredient_id,
      quantity: newIngredient.quantity,
    });
    return false;
  }

  try {
    const existingIngredient = currentCalculations.find(
      calc => calc.ingredientId === newIngredient.ingredient_id,
    );
    const selectedIngredientData = ingredients.find(ing => ing.id === newIngredient.ingredient_id);
    if (!selectedIngredientData) {
      logger.error('[useIngredientAddition] Ingredient not found in list:', {
        ingredient_id: newIngredient.ingredient_id,
        availableIngredients: ingredients.length,
      });
      setSaveError('Ingredient not found. Please select an ingredient from the list.');
      return false;
    }

    logger.dev('[useIngredientAddition] Processing ingredient addition:', {
      ingredient_name: selectedIngredientData.ingredient_name,
      quantity: newIngredient.quantity,
      unit: newIngredient.unit,
    });

    processIngredientAddition({
      newIngredient: {
        ingredient_id: newIngredient.ingredient_id!,
        quantity: newIngredient.quantity!,
        unit: newIngredient.unit,
      },
      selectedIngredientData,
      selectedRecipe,
      convertIngredientQuantity,
      existingIngredient,
      currentCalculations,
      updateCalculation,
      addCalculation,
      resetForm,
    });

    logger.dev('[useIngredientAddition] Ingredient added successfully');
    return true;
  } catch (err) {
    logger.error('[useIngredientAddition] Error adding ingredient:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to add ingredient';
    setSaveError(`Failed to add ingredient: ${errorMessage}`);
    return false;
  }
}
