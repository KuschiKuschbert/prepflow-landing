import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import { DishRelationIngredient } from '../../helpers/schemas';
import { manualFetchAndJoinIngredients, retryFetchWithoutCategory } from './fetch-ingredients-utils';

/** Fetches ingredients for a dish with fallback logic */
export async function fetchDishIngredients(dishId: string): Promise<DishRelationIngredient[]> {
  if (!supabaseAdmin) {
    logger.error('[Dishes API] Database connection not available for fetchDishIngredients');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // First, try to fetch with join to ingredients table
  let { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
      id,
      dish_id,
      ingredient_id,
      quantity,
      unit,
      ingredients (
        id,
        ingredient_name,
        cost_per_unit,
        cost_per_unit_incl_trim,
        trim_peel_waste_percentage,
        yield_percentage,
        unit,
        supplier,
        category,
        brand,
        allergens,
        allergen_source
      )
    `,
    )
    .eq('dish_id', dishId);

  // If join fails or returns empty but we know rows exist, fetch without join and manually join
  const pgError = ingredientsError as PostgrestError | null;
  if (
    (!dishIngredients || dishIngredients.length === 0) &&
    (!pgError || pgError.code !== '42703')
  ) {
    const manualResult = await manualFetchAndJoinIngredients(dishId);
    if (manualResult) {
      // @ts-expect-error - Complex nested type mismatches during migration we expect even if types are tricky
      dishIngredients = manualResult;
    }
  }

  // If category column doesn't exist, retry without it
  const retryError = ingredientsError as PostgrestError | null;
  if (retryError && retryError.code === '42703' && retryError.message?.includes('category')) {
    const { data, error } = await retryFetchWithoutCategory(dishId);
    // @ts-expect-error - Recursive type mismatches in ingredient graph
    dishIngredients = data;
    ingredientsError = error;
  }

  // Log error if still present (but don't fail the whole request)
  if (ingredientsError) {
    logger.warn('[Dishes API] Error fetching dish ingredients (non-fatal):', {
      error: ingredientsError.message,
      code: ingredientsError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

  // Filter out dish_ingredients entries where the ingredients relation is null (deleted ingredients)
  // Also map 'supplier' to 'supplier_name' to match frontend types
  const rawIngredients = (dishIngredients || []) as unknown as Record<string, unknown>[];

  const validDishIngredients = rawIngredients
    .filter(di => di.ingredients !== null && di.ingredients !== undefined)
    .map(di => {
      const ingredients = di.ingredients;
      const ing = Array.isArray(ingredients)
        ? (ingredients[0] as Record<string, unknown>)
        : (ingredients as Record<string, unknown>);

      if (!ing) return null;

      return {
        id: di.id as string,
        dish_id: di.dish_id as string,
        ingredient_id: di.ingredient_id as string | null,
        quantity: di.quantity as number,
        unit: di.unit as string,
        ingredients: {
          ...ing,
          supplier_name: (ing.supplier as string) || (ing.supplier_name as string) || 'Unknown',
        },
      } as DishRelationIngredient;
    })
    .filter((di): di is DishRelationIngredient => di !== null);

  return validDishIngredients;
}
