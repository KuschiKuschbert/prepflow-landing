import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import { DishRelationIngredient } from '../../helpers/schemas';

// Define types for raw database rows
interface RawDishIngredientRow {
  id: string;
  dish_id: string;
  ingredient_id: string | null;
  quantity: number;
  unit: string;
}

interface RawIngredientRow {
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

/** Fetches ingredients for a dish with fallback logic */
/**
 * Helper to manually fetch ingredients and join them with dish_ingredients
 */
async function manualFetchAndJoinIngredients(dishId: string) {
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
async function retryFetchWithoutCategory(dishId: string) {
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
      // @ts-ignore - manualResult structure matches what we expect even if types are tricky
      dishIngredients = manualResult;
    }
  }

  // If category column doesn't exist, retry without it
  const retryError = ingredientsError as PostgrestError | null;
  if (retryError && retryError.code === '42703' && retryError.message?.includes('category')) {
    const { data, error } = await retryFetchWithoutCategory(dishId);
    // @ts-ignore
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
