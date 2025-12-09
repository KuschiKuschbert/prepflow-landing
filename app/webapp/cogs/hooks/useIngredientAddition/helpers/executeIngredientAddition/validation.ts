/**
 * Validation logic for ingredient addition
 */

import { logger } from '@/lib/logger';
import { validateIngredientInput } from '../../../helpers/ingredientValidation';
import type { Ingredient } from '../../../../types';

interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

/**
 * Validate and find ingredient data
 *
 * @param {NewIngredient} newIngredient - New ingredient data
 * @param {Ingredient[]} ingredients - Available ingredients
 * @param {Function} setSaveError - Set error message
 * @returns {Ingredient | null} Selected ingredient data or null if invalid
 */
export function validateAndFindIngredient(
  newIngredient: NewIngredient,
  ingredients: Ingredient[],
  setSaveError: (error: string) => void,
): Ingredient | null {
  // Clear any previous errors
  setSaveError('');

  // Validate input
  if (!validateIngredientInput(newIngredient, setSaveError)) {
    logger.warn('[useIngredientAddition] Validation failed:', {
      ingredient_id: newIngredient.ingredient_id,
      quantity: newIngredient.quantity,
    });
    return null;
  }

  const selectedIngredientData = ingredients.find(ing => ing.id === newIngredient.ingredient_id);
  if (!selectedIngredientData) {
    logger.error('[useIngredientAddition] Ingredient not found in list:', {
      ingredient_id: newIngredient.ingredient_id,
      availableIngredients: ingredients.length,
    });
    setSaveError('Ingredient not found. Please select an ingredient from the list.');
    return null;
  }

  return selectedIngredientData;
}
