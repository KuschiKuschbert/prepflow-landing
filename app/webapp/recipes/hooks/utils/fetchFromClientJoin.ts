import { supabase } from '@/lib/supabase';
import { RecipeIngredientWithDetails } from '@/lib/types/recipes';

import { logger } from '@/lib/logger';
/**
 * Fetch recipe ingredients using client-side join as fallback.
 *
 * @param {string} recipeId - Recipe ID to fetch
 * @param {Function} setError - Error setter function
 * @returns {Promise<RecipeIngredientWithDetails[]>} Recipe ingredients
 */
export async function fetchFromClientJoin(
  recipeId: string,
  setError: (error: string) => void,
): Promise<RecipeIngredientWithDetails[]> {
  const { data: ingredientsData, error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .select(
      'id, recipe_id, ingredient_id, quantity, unit, ingredients ( id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage )',
    )
    .eq('recipe_id', recipeId);

  if (ingredientsError) {
    logger.error('❌ Error fetching recipe ingredients:', ingredientsError);
    setError(ingredientsError.message);
    return [];
  }

  let rows: RecipeIngredientWithDetails[] = (ingredientsData ||
    []) as unknown as RecipeIngredientWithDetails[];
  if (rows.some(r => !r.ingredients) && rows.length > 0) {
    const uniqueIds = Array.from(new Set(rows.map(r => r.ingredient_id).filter(Boolean)));
    if (uniqueIds.length > 0) {
      const { data: ingRows } = await supabase
        .from('ingredients')
        .select(
          'id, ingredient_name, cost_per_unit, unit, trim_peel_waste_percentage, yield_percentage',
        )
        .in('id', uniqueIds);
      const byId: Record<string, RecipeIngredientWithDetails['ingredients']> = {};
      (ingRows || []).forEach(ir => {
        byId[ir.id] = ir as RecipeIngredientWithDetails['ingredients'];
      });
      rows = rows.map(r => ({ ...r, ingredients: byId[r.ingredient_id] || r.ingredients }));
    }
  }
  return rows;
}
