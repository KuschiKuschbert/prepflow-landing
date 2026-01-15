/**
 * Create optimistic ingredient update for UI.
 *
 * @param {any} normalized - Normalized ingredient data
 * @returns {any} Temporary ingredient with temp ID
 */
export function createOptimisticIngredient<T extends { id: string }>(normalized: Partial<T>): T {
  const tempId = `temp-${Date.now()}`;
  return { ...normalized, id: tempId } as unknown as T;
}

/**
 * Replace temporary ingredient with server response.
 *
 * @param {T[]} ingredients - Current ingredients array
 * @param {string} tempId - Temporary ingredient ID
 * @param {T} serverIngredient - Ingredient from server
 * @returns {T[]} Updated ingredients array
 */
export function replaceTempIngredient<T extends { id: string }>(
  ingredients: T[],
  tempId: string,
  serverIngredient: T,
): T[] {
  return ingredients.map(ing => (ing.id === tempId ? serverIngredient : ing));
}
