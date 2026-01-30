import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DBRecipeIngredient } from '../types';
import { mergeSingleIngredient } from './mergeSingleIngredient';

/**
 * Merge dish recipe ingredients into main recipe ingredients map.
 *
 * @param {Set<string>} recipeIds - Set of recipe IDs
 * @param {Map<string, DBRecipeIngredient[]>} recipeIngredientsMap - Main recipe ingredients map (will be updated)
 */
export async function mergeDishRecipeIngredients(
  recipeIds: Set<string>,
  recipeIngredientsMap: Map<string, DBRecipeIngredient[]>,
) {
  if (recipeIds.size === 0) {
    return;
  }

  if (!supabaseAdmin) {
    return;
  }

  const { data: dishRecipeIngredients, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name, name)')
    .in('recipe_id', Array.from(recipeIds));

  if (ingredientsError) {
    logger.error('[Prep Lists API] Error fetching dish recipe ingredients:', {
      error: ingredientsError.message,
      recipeIds: Array.from(recipeIds),
      context: {
        endpoint: '/api/prep-lists/generate-from-menu',
        operation: 'mergeDishRecipeIngredients',
      },
    });
  }

  if (dishRecipeIngredients) {
    for (const ri of dishRecipeIngredients) {
      const recipeIngredient = ri as unknown as DBRecipeIngredient;
      mergeSingleIngredient(recipeIngredient.recipe_id, recipeIngredient, recipeIngredientsMap);
    }
  }
}
