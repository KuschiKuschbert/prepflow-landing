import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { DishRelationIngredient } from '../../helpers/schemas';

interface RawDishIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    cost_per_unit_incl_trim: number;
    trim_peel_waste_percentage: number;
    yield_percentage: number;
    unit: string;
    supplier: string | null;
    supplier_name?: string; // Sometimes aliased or joined
    category: string | null;
    brand: string | null;
    allergens: string[] | null;
    allergen_source: Record<string, unknown> | null;
  } | null;
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

  if (ingredientsError) {
    logger.warn('[Dishes API] Error fetching dish ingredients (non-fatal):', {
      error: ingredientsError.message,
      code: ingredientsError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

  // Normalize and clean ingredients data
  const validDishIngredients: DishRelationIngredient[] = ((dishIngredients as unknown as RawDishIngredient[]) || [])
    .filter(di => di.ingredients !== null && di.ingredients !== undefined)
    .map(di => {
      const ing = Array.isArray(di.ingredients) ? di.ingredients[0] : di.ingredients;
      if (!ing) return null;

      return {
        id: di.id,
        dish_id: di.dish_id,
        ingredient_id: di.ingredient_id,
        quantity: di.quantity,
        unit: di.unit,
        ingredients: {
          ...ing,
          supplier_name: ing.supplier || ing.supplier_name || 'Unknown',
        },
      } as DishRelationIngredient;
    })
    .filter((di): di is DishRelationIngredient => di !== null);

  return validDishIngredients;
}
