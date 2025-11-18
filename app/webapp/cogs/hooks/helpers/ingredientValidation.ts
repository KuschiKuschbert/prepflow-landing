interface NewIngredient {
  ingredient_id?: string;
  quantity?: number;
  unit?: string;
}

/**
 * Validate ingredient addition input.
 *
 * @param {NewIngredient} newIngredient - Ingredient to validate
 * @param {Function} setSaveError - Error setter
 * @returns {boolean} True if valid, false otherwise
 */
export function validateIngredientInput(
  newIngredient: NewIngredient,
  setSaveError: (error: string) => void,
): boolean {
  if (!newIngredient.ingredient_id) {
    setSaveError('Please select an ingredient');
    return false;
  }
  if (!newIngredient.quantity || newIngredient.quantity <= 0) {
    setSaveError('Please enter a quantity greater than 0');
    return false;
  }
  return true;
}
