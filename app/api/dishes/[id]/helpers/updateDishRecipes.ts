import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update dish recipes by deleting existing and inserting new ones.
 *
 * @param {string} dishId - Dish ID
 * @param {Array} recipes - Array of recipe objects with recipe_id and optional quantity
 * @throws {Error} If database connection is not available or update fails
 */
export async function updateDishRecipes(
  dishId: string,
  recipes: Array<{ recipe_id: string; quantity?: number }>,
) {
  if (!supabaseAdmin) throw new Error('Database connection not available');
  await supabaseAdmin.from('dish_recipes').delete().eq('dish_id', dishId);
  if (recipes.length > 0) {
    const dishRecipes = recipes.map(r => ({
      dish_id: dishId,
      recipe_id: r.recipe_id,
      quantity: r.quantity || 1,
    }));
    const { error } = await supabaseAdmin.from('dish_recipes').insert(dishRecipes);
    if (error) throw error;
  }
}
