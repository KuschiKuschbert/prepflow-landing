import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get dish names by their IDs.
 *
 * @param {string[]} dishIds - Array of dish IDs
 * @returns {Promise<string[]>} Array of dish names
 */
export async function getDishNames(dishIds: string[]): Promise<string[]> {
  if (dishIds.length === 0) return [];
  if (!supabaseAdmin) throw new Error('Database connection not available');
  const { data: dishes } = await supabaseAdmin.from('dishes').select('dish_name').in('id', dishIds);
  return dishes ? dishes.map((d: { dish_name: string }) => d.dish_name || 'Unknown') : [];
}
