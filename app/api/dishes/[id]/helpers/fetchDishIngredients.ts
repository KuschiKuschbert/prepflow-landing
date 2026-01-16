import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
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

  // If join fails or returns empty but we know rows exist, fetch without join and manually join
  const pgError = ingredientsError as PostgrestError | null;
  if (
    (!dishIngredients || dishIngredients.length === 0) &&
    (!pgError || pgError.code !== '42703')
  ) {
    logger.dev('[Dishes API] Join returned empty, fetching dish_ingredients without join', {
      dishId,
    });

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
    } else if (rawDishIngredients && rawDishIngredients.length > 0) {
      // Manually fetch ingredients and join
      const ingredientIds = rawDishIngredients.map(di => di.ingredient_id).filter(Boolean);
      if (ingredientIds.length > 0) {
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
        } else if (ingredientsData) {
          // Create a map for quick lookup
          const ingredientsMap = new Map(ingredientsData.map(ing => [ing.id, ing]));

          // Manually join the data
          dishIngredients = rawDishIngredients.map((di: Record<string, any>) => {
            const ingredient = ingredientsMap.get(di.ingredient_id) as Record<string, any> | undefined;
            return {
              ...di,
              ingredients: ingredient
                ? [
                    {
                      ...ingredient,
                      supplier_name: ingredient.supplier || (ingredient as Record<string, any>).supplier_name,
                    },
                  ]
                : [],
            };
          }) as unknown as typeof dishIngredients;

          logger.dev('[Dishes API] Manually joined dish ingredients', {
            dishId,
            count: dishIngredients?.length || 0,
            joinedCount: Array.isArray(dishIngredients)
              ? dishIngredients.filter((di: any) => di.ingredients !== null).length
              : 0,
          });
        }
      }
    }
  }

  // If category column doesn't exist, retry without it
  const retryError = ingredientsError as PostgrestError | null;
  if (retryError && retryError.code === '42703' && retryError.message?.includes('category')) {
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
    const retryData = (retryResult.data || []) as unknown as Record<string, any>[];
    dishIngredients = retryData.map((item) => ({
      ...item,
      ingredients: Array.isArray(item.ingredients)
        ? item.ingredients.map((ing: Record<string, any>) => ({ ...ing, category: null }))
        : item.ingredients
          ? { ...item.ingredients, category: null }
          : null,
    })) as unknown as typeof dishIngredients;
    ingredientsError = retryResult.error;
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
  const rawIngredients = (dishIngredients || []) as unknown as Record<string, any>[];

  const validDishIngredients = rawIngredients
    .filter(di => di.ingredients !== null && di.ingredients !== undefined)
    .map((di) => {
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
