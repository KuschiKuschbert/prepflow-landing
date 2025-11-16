import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Backfill missing nested ingredients by fetching from ingredients table.
 *
 * @param {Array} rows - Recipe ingredient rows with potentially missing nested ingredients
 * @param {string} recipeId - Recipe ID for logging
 * @returns {Promise<Array>} Rows with backfilled ingredients
 */
export async function backfillMissingIngredients(rows: any[], recipeId: string): Promise<any[]> {
  const missingNested = rows.some(r => !r.ingredients);
  if (!missingNested) return rows;

  logger.debug('[Recipes API] Missing nested ingredients join; applying backfill', {
    context: { endpoint: '/api/recipes/[id]/ingredients', recipeId },
  });

  const uniqueIds = Array.from(
    new Set(rows.map(r => r.ingredient_id).filter((v: any) => Boolean(v))),
  );

  if (uniqueIds.length === 0) return rows;

  if (!supabaseAdmin) return rows;

  const { data: ingRows, error: ingError } = await supabaseAdmin
    .from('ingredients')
    .select(
      'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
    )
    .in('id', uniqueIds);

  if (ingError || !ingRows) return rows;

  const byId: Record<string, any> = {};
  ingRows.forEach(ir => {
    byId[ir.id] = ir;
  });

  return rows.map(r => ({ ...r, ingredients: r.ingredients || byId[r.ingredient_id] }));
}
