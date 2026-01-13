/**
 * Helper for populating empty recipes with ingredients
 */

import { logger } from '@/lib/logger';
import {
    getDefaultIngredientsForRecipe,
    getIngredientName,
    recipeHasIngredients,
} from '@/lib/populate-helpers/populate-empty-dishes-helpers';
import { supabaseAdmin } from '@/lib/supabase';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import type {
    IngredientRecord,
    PopulateRecipesResult,
    PopulatedRecipe,
    RecipeError,
    RecipeRecord,
    SkippedRecipe,
} from '../types';

/**
 * Populates empty recipes with default ingredients
 *
 * @param {RecipeRecord[]} recipes - Array of recipe objects
 * @param {IngredientRecord[]} ingredients - Array of available ingredients
 * @returns {Promise<PopulateRecipesResult>} Result of population operation
 */
export async function populateRecipes(
  recipes: RecipeRecord[],
  ingredients: IngredientRecord[],
): Promise<PopulateRecipesResult> {
  const populated: PopulatedRecipe[] = [];
  const skipped: SkippedRecipe[] = [];
  const errors: RecipeError[] = [];

  for (const recipe of recipes) {
    try {
      const recipeName = recipe.name || 'Unknown';
      const hasIngredients = await recipeHasIngredients(recipe.id);
      if (hasIngredients) {
        skipped.push({
          recipe_id: recipe.id,
          recipe_name: recipeName,
          reason: 'Recipe already has ingredients',
        });
        continue;
      }

      // Get default ingredients based on recipe name
      const ingredientsToAdd = getDefaultIngredientsForRecipe(recipeName, ingredients);

      if (ingredientsToAdd.length === 0) {
        skipped.push({
          recipe_id: recipe.id,
          recipe_name: recipeName,
          reason: 'No matching ingredients found in database',
        });
        continue;
      }

      // Insert recipe_ingredients
      const recipeIngredientsToInsert = ingredientsToAdd.map(ing => ({
        recipe_id: recipe.id,
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit,
      }));

      if (!supabaseAdmin) {
        throw ApiErrorHandler.createError(
          'Supabase admin client not initialized',
          'DATABASE_ERROR',
          500,
        );
      }

      const { error: insertError } = await supabaseAdmin
        .from('recipe_ingredients')
        .insert(recipeIngredientsToInsert);

      if (insertError) {
        errors.push({
          recipe_id: recipe.id,
          recipe_name: recipeName,
          error: insertError.message,
        });
        logger.error('[Populate Empty Dishes] Error inserting recipe ingredients:', {
          recipeId: recipe.id,
          recipeName,
          error: insertError.message,
        });
        continue;
      }

      const ingredientNames = ingredientsToAdd.map(ing =>
        getIngredientName(ing.ingredient_id, ingredients),
      );

      populated.push({
        recipe_id: recipe.id,
        recipe_name: recipeName,
        ingredients_added: ingredientsToAdd.length,
        ingredient_names: ingredientNames,
      });

      logger.dev('[Populate Empty Dishes] Populated recipe:', {
        recipeId: recipe.id,
        recipeName,
        ingredientsAdded: ingredientsToAdd.length,
        ingredientNames,
      });
    } catch (err) {
      const recipeName = recipe.name || 'Unknown';
      errors.push({
        recipe_id: recipe.id,
        recipe_name: recipeName,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
      logger.error('[Populate Empty Dishes] Error processing recipe:', {
        recipeId: recipe.id,
        recipeName: recipe.name,
        error: err,
      });
    }
  }

  return { populated, skipped, errors };
}
