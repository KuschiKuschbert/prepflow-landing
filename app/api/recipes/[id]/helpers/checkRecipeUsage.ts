import { supabaseAdmin } from '@/lib/supabase';

/**
 * Check if a recipe is used in menu_dishes or dish_recipes.
 *
 * @param {string} recipeId - Recipe ID to check
 * @returns {Promise<Object>} Results from both queries
 * @throws {Error} If database connection is not available
 */
export async function checkRecipeUsage(recipeId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');
  const [menuDishesResult, dishRecipesResult] = await Promise.all([
    supabaseAdmin
      .from('menu_dishes')
      .select('id, name, recipe_id, created_at, updated_at')
      .eq('recipe_id', recipeId),
    supabaseAdmin.from('dish_recipes').select('dish_id, recipe_id').eq('recipe_id', recipeId),
  ]);
  return { menuDishesResult, dishRecipesResult };
}
