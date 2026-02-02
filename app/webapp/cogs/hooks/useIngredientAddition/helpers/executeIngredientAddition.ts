/**
 * Helper function to execute ingredient addition logic
 */

import { logger } from '@/lib/logger';
import { processIngredientAddition } from '../../helpers/ingredientProcessing';
import { validateAndFindIngredient } from './executeIngredientAddition/validation';

interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

interface ExecuteIngredientAdditionParams {
  newIngredient: NewIngredient;
  ingredients: import('@/lib/types/recipes').Ingredient[];
  selectedRecipe: string | null;
  currentCalculations: import('@/lib/types/recipes').COGSCalculation[];
  convertIngredientQuantity: (
    quantity: number,
    userUnit: string,
    ingredientUnit: string,
  ) => { convertedQuantity: number; convertedUnit: string; conversionNote: string };
  updateCalculation: (ingredientId: string, quantity: number) => void;
  addCalculation: (calc: import('@/lib/types/recipes').COGSCalculation) => void;
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

  try {
    const selectedIngredientData = validateAndFindIngredient(
      newIngredient,
      ingredients,
      setSaveError,
    );
    if (!selectedIngredientData) {
      return false;
    }

    const existingIngredient = currentCalculations.find(
      calc => calc.ingredientId === newIngredient.ingredient_id,
    );

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
