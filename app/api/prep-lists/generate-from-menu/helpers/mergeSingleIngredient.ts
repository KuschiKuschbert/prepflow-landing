import { DBRecipeIngredient } from '../types';

/**
 * Merge a single ingredient into the recipe ingredients map.
 *
 * @param {string} recipeId - Recipe ID
 * @param {DBRecipeIngredient} ingredient - Ingredient to merge
 * @param {Map<string, DBRecipeIngredient[]>} map - Ingredients map
 */
export function mergeSingleIngredient(
  recipeId: string,
  ingredient: DBRecipeIngredient,
  map: Map<string, DBRecipeIngredient[]>,
) {
  if (!map.has(recipeId)) {
    map.set(recipeId, []);
  }

  const existingIngredients = map.get(recipeId)!;
  const isDuplicate = existingIngredients.some(
    existing => existing.ingredient_id === ingredient.ingredient_id,
  );

  if (!isDuplicate) {
    existingIngredients.push(ingredient);
  }
}
