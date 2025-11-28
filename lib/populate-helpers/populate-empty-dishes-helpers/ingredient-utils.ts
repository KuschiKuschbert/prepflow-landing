/**
 * Ingredient utility functions.
 */

/**
 * Get ingredient name from ID
 */
export function getIngredientName(
  ingredientId: string,
  availableIngredients: Array<{ id: string; ingredient_name: string }>,
): string {
  const ingredient = availableIngredients.find(ing => ing.id === ingredientId);
  return ingredient?.ingredient_name || 'Unknown';
}
