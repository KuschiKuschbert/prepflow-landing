/**
 * Merge dish recipe ingredients into main recipe ingredients map.
 *
 * @param {Set<string>} recipeIds - Set of recipe IDs
 * @param {Map<string, any[]>} recipeIngredientsMap - Main recipe ingredients map (will be updated)
 */
export async function mergeDishRecipeIngredients(
  recipeIds: Set<string>,
  recipeIngredientsMap: Map<string, any[]>,
) {
  if (recipeIds.size === 0) {
    return;
  }

  const { supabaseAdmin } = await import('@/lib/supabase');
  const { logger } = await import('@/lib/logger');

  if (!supabaseAdmin) {
    return;
  }

  const { data: dishRecipeIngredients, error: ingredientsError } = await supabaseAdmin
    .from('recipe_ingredients')
    .select('recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name)')
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
      const recipeId = (ri as any).recipe_id;
      if (!recipeIngredientsMap.has(recipeId)) {
        recipeIngredientsMap.set(recipeId, []);
      }
      if (
        !recipeIngredientsMap
          .get(recipeId)!
          .some(existing => existing.ingredient_id === (ri as any).ingredient_id)
      ) {
        recipeIngredientsMap.get(recipeId)!.push(ri);
      }
    }
  }
}
