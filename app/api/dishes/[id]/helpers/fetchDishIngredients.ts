/**
 * Helper for fetching dish ingredients with fallback logic
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/** Fetches ingredients for a dish with fallback logic */
export async function fetchDishIngredients(dishId: string): Promise<any[]> {
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  // First, try to fetch with join to ingredients table
  let { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
    .from('dish_ingredients')
    .select(
      `
      id,
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
  if (
    (!dishIngredients || dishIngredients.length === 0) &&
    (!ingredientsError || (ingredientsError as any).code !== '42703')
  ) {
    logger.dev('[Dishes API] Join returned empty, fetching dish_ingredients without join', {
      dishId,
    });

    const { data: rawDishIngredients, error: rawError } = await supabaseAdmin
      .from('dish_ingredients')
      .select('id, ingredient_id, quantity, unit')
      .eq('dish_id', dishId);

    if (rawError) {
      logger.warn('[Dishes API] Error fetching raw dish_ingredients:', {
        error: rawError.message,
        code: (rawError as any).code,
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
          dishIngredients = rawDishIngredients.map(di => {
            const ingredient = ingredientsMap.get(di.ingredient_id);
            return {
              ...di,
              ingredients: ingredient
                ? [
                    {
                      ...ingredient,
                      supplier_name: ingredient.supplier || (ingredient as any).supplier_name,
                    },
                  ]
                : [],
            };
          }) as unknown as typeof dishIngredients;

          logger.dev('[Dishes API] Manually joined dish ingredients', {
            dishId,
            count: dishIngredients?.length || 0,
            joinedCount: dishIngredients?.filter((di: any) => di.ingredients !== null).length || 0,
          });
        }
      }
    }
  }

  // If category column doesn't exist, retry without it
  if (
    ingredientsError &&
    (ingredientsError as any).code === '42703' &&
    (ingredientsError as any).message?.includes('category')
  ) {
    logger.warn('[Dishes API] Category column not found, retrying without category', {
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });

    const retryResult = await supabaseAdmin
      .from('dish_ingredients')
      .select(
        `
        id,
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
    dishIngredients = retryResult.data?.map((item: any) => ({
      ...item,
      ingredients: item.ingredients?.map((ing: any) => ({
        ...ing,
        category: ing.category ?? null,
      })),
    })) as typeof dishIngredients;
    ingredientsError = retryResult.error;
  }

  // Log error if still present (but don't fail the whole request)
  if (ingredientsError) {
    logger.warn('[Dishes API] Error fetching dish ingredients (non-fatal):', {
      error: ingredientsError.message,
      code: (ingredientsError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

  // Filter out dish_ingredients entries where the ingredients relation is null (deleted ingredients)
  // Also map 'supplier' to 'supplier_name' to match frontend types
  const validDishIngredients = (dishIngredients || [])
    .filter(di => di.ingredients !== null && di.ingredients !== undefined)
    .map((di: any) => ({
      ...di,
      ingredients: di.ingredients
        ? {
            ...di.ingredients,
            supplier_name: di.ingredients.supplier || di.ingredients.supplier_name,
          }
        : null,
    }));

  // Log debug info
  const rawCount = dishIngredients?.length || 0;
  const validCount = validDishIngredients.length;
  logger.dev('[Dishes API] Fetched dish ingredients:', {
    dishId,
    rawCount,
    validCount,
    filteredCount: rawCount - validCount,
    hasError: !!ingredientsError,
    sample: validCount > 0 ? validDishIngredients[0] : null,
  });

  // If all ingredient relations are null, log a warning
  if (rawCount > 0 && validCount === 0) {
    logger.warn('[Dishes API] All dish_ingredients have null ingredient relations:', {
      dishId,
      totalRows: rawCount,
      message: 'This suggests ingredient_id foreign keys are broken or ingredients were deleted',
    });
  }
  return validDishIngredients;
}
