/**
 * Helper to build Supabase query with filters.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { RecipeQueryParams } from './validateRequest';

/**
 * Build and execute Supabase query with filters.
 */
export async function buildQuery(
  supabase: SupabaseClient,
  params: RecipeQueryParams,
): Promise<{ data: any[] | null; error: any; count: number | null }> {
  const { category, excludeAllergens, vegetarian, vegan } = params;
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize - 1;

  let query = supabase.from('recipes').select('*', { count: 'exact' });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }
  if (excludeAllergens.length > 0) {
    excludeAllergens.forEach(allergen => {
      query = query.not('allergens', 'cs', JSON.stringify([allergen]));
    });
  }
  if (vegetarian) query = query.eq('is_vegetarian', true);
  if (vegan) query = query.eq('is_vegan', true);

  return await query.order('name').range(start, end);
}
