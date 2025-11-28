/**
 * Helper functions for populating dishes without ingredients.
 * Re-exports all functions from the refactored modules.
 */

export {
  type IngredientMatch,
  dishHasDirectIngredients,
  dishHasIngredients,
  getIngredientName,
  getDefaultIngredientsForDish,
  getDefaultIngredientsForRecipe,
  recipeHasIngredients,
  getIngredientsFromRecipes,
} from './populate-empty-dishes-helpers/index';
