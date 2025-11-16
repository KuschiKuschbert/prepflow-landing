import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update dish ingredients by deleting existing and inserting new ones.
 *
 * @param {string} dishId - Dish ID
 * @param {Array} ingredients - Array of ingredient objects with ingredient_id, quantity, and unit
 * @throws {Error} If database connection is not available or update fails
 */
export async function updateDishIngredients(
  dishId: string,
  ingredients: Array<{ ingredient_id: string; quantity: number; unit: string }>,
) {
  if (!supabaseAdmin) throw new Error('Database connection not available');
  await supabaseAdmin.from('dish_ingredients').delete().eq('dish_id', dishId);
  if (ingredients.length > 0) {
    const dishIngredients = ingredients.map(i => ({
      dish_id: dishId,
      ingredient_id: i.ingredient_id,
      quantity: typeof i.quantity === 'string' ? parseFloat(i.quantity) : i.quantity,
      unit: i.unit,
    }));
    const { error } = await supabaseAdmin.from('dish_ingredients').insert(dishIngredients);
    if (error) throw error;
  }
}
