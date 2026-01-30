import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

// Define types for raw database rows
export interface RawDishIngredientRow {
  id: string;
  dish_id: string;
  ingredient_id: string | null;
  quantity: number;
  unit: string;
}

export interface RawIngredientRow {
  id: string;
  ingredient_name: string;
  cost_per_unit: number;
  cost_per_unit_incl_trim: number | null;
  trim_peel_waste_percentage: number | null;
  yield_percentage: number | null;
  unit: string;
  supplier: string | null;
  supplier_name?: string; // Sometimes aliased or joined
  category: string | null;
  brand: string | null;
  allergens: string[] | null;
  allergen_source: Record<string, unknown> | null;
}

/**
 * Helper to manually fetch ingredients and join them with dish_ingredients
 */
export async function manualFetchAndJoinIngredients(dishId: string) {
  logger.dev('[Dishes API] Join returned empty, fetching dish_ingredients without join', {
    dishId,
  });

  if (!supabaseAdmin) {
    logger.error('[Dishes API] Database connection not available for manual fetch');
    return null;
  }

  const { data: rawDishIngredients, error: rawError } = await supabaseAdmin
    .from('dish_ingredients')
    .select('id, ingredient_id, quantity, unit')
    .eq('dish_id', dishId);

  if (rawError) {
    const rawPgError = rawError as PostgrestError;
    logger.warn('[Dishes API] Error fetching raw dish_ingredients:', {
      error: rawPgError.message,
      code: rawPgError.code,
    });
    return null;
  }

  if (!rawDishIngredients || rawDishIngredients.length === 0) {
    return [];
  }

  // Manually fetch ingredients and join
  const ingredientIds = rawDishIngredients
    .map(di => di.ingredient_id)
    .filter((id): id is string => Boolean(id));

  if (ingredientIds.length === 0) return [];

  const { data: ingredientsData, error: ingFetchError } = await supabaseAdmin
    .from('ingredients')
    .select(
      'id, ingredient_name, cost_per_unit, cost_per_unit_incl_trim, trim_peel_waste_percentage, yield_percentage, unit, supplier, category, brand, allergens, allergen_source',
    )
    .in('id', ingredientIds);

  if (ingFetchError) {
    logger.warn('[Dishes API] Error fetching ingredients for manual join:', {
      error: ingFetchError.message,
    });
    return null;
  }

  if (!ingredientsData) return null;

  // Create a map for quick lookup
  const ingredientsMap = new Map<string, RawIngredientRow>(
    (ingredientsData as RawIngredientRow[]).map(ing => [ing.id, ing]),
  );

  // Manually join the data
  const joinedData = rawDishIngredients.map(di => {
    const ingredient = di.ingredient_id ? ingredientsMap.get(di.ingredient_id) : undefined;
    return {
      ...di,
      ingredients: ingredient
        ? [
            {
              ...ingredient,
              supplier_name: ingredient.supplier || ingredient.supplier_name,
            },
          ]
        : [],
    };
  });

  logger.dev('[Dishes API] Manually joined dish ingredients', {
    dishId,
    count: joinedData.length,
    joinedCount: joinedData.filter(di => di.ingredients.length > 0).length,
  });

  return joinedData;
}

/**
 * Helper to retry fetching without the category column (schema drift coverage)
 */
export async function retryFetchWithoutCategory(dishId: string) {
  if (!supabaseAdmin) {
    return { data: [], error: { message: 'DB not available' } as PostgrestError };
  }

  logger.warn('[Dishes API] Category column not found, retrying without category', {
    context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
  });

  const retryResult = await supabaseAdmin
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
        brand,
        allergens,
        allergen_source
      )
    `,
    )
    .eq('dish_id', dishId);

  // Normalize the retry result to include category as null/undefined for type compatibility
  const retryData = (retryResult.data || []) as unknown as Record<string, unknown>[];
  const normalizedData = retryData.map(item => ({
    ...item,
    ingredients: Array.isArray(item.ingredients)
      ? item.ingredients.map((ing: Record<string, unknown>) => ({ ...ing, category: null }))
      : item.ingredients
        ? { ...(item.ingredients as Record<string, unknown>), category: null }
        : null,
  }));

  return { data: normalizedData, error: retryResult.error };
}
