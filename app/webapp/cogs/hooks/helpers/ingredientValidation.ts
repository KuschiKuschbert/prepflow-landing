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
  // Check if ingredient_id is missing or empty string
  if (!newIngredient.ingredient_id || newIngredient.ingredient_id.trim() === '') {
    setSaveError('Please select an ingredient from the dropdown');
    return false;
  }
  // Check if quantity is missing, zero, or negative
  if (
    newIngredient.quantity === undefined ||
    newIngredient.quantity === null ||
    newIngredient.quantity <= 0
  ) {
    setSaveError('Please enter a quantity greater than 0');
    return false;
  }
  return true;
}
