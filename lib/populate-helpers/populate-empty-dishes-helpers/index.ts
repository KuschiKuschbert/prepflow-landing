/**
 * Helper functions for populating dishes without ingredients.
 * Main orchestrator file that exports all public functions.
 */

export type { IngredientMatch } from './types';
export { dishHasDirectIngredients, dishHasIngredients } from './dish-checks';
export { getIngredientName } from './ingredient-utils';
export { getDefaultIngredientsForDish } from './dish-ingredients';
export { getDefaultIngredientsForRecipe, recipeHasIngredients } from './recipe-helpers';
export { getIngredientsFromRecipes } from './recipe-aggregation';
