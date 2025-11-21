import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Fetch dish with recipes and ingredients.
 *
 * @param {string} dishId - Dish ID
 * @returns {Promise<Object>} Dish with recipes and ingredients
 * @throws {Error} If dish not found or database error
 */
export async function fetchDishWithRelations(dishId: string) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  // Fetch dish
  const { data: dish, error: dishError } = await supabaseAdmin
    .from('dishes')
    .select('*')
    .eq('id', dishId)
    .single();

  if (dishError) {
    logger.error('[Dishes API] Database error fetching dish:', {
      error: dishError.message,
      code: (dishError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
    throw ApiErrorHandler.fromSupabaseError(dishError, 404);
  }

  if (!dish) {
    throw ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404, { dishId });
  }

  // Fetch dish recipes
  const { data: dishRecipes, error: recipesError } = await supabaseAdmin
    .from('dish_recipes')
    .select(
      `
      id,
      recipe_id,
      quantity,
      recipes (
        id,
        recipe_name,
        description,
        yield,
        yield_unit
      )
    `,
    )
    .eq('dish_id', dishId);

  // Log error if present (but don't fail the whole request)
  if (recipesError) {
    logger.warn('[Dishes API] Error fetching dish recipes (non-fatal):', {
      error: recipesError.message,
      code: (recipesError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'GET', dishId },
    });
  }

  // Filter out dish_recipes entries where the recipe relation is null (deleted recipes)
  // This prevents "Unknown Recipe" from appearing in the UI
  const validDishRecipes = (dishRecipes || []).filter(
    dr => dr.recipes !== null && dr.recipes !== undefined,
  );

  // Log debug info to help diagnose "Unknown Recipe" issue
  if (dishRecipes && dishRecipes.length > 0) {
    const filteredCount = dishRecipes.length - validDishRecipes.length;
    if (filteredCount > 0) {
      logger.warn('[Dishes API] Filtered out dish_recipes with null recipe relations:', {
        dishId,
        total: dishRecipes.length,
        filtered: filteredCount,
        valid: validDishRecipes.length,
      });
    }
    logger.dev('[Dishes API] Fetched dish recipes:', {
      dishId,
      count: validDishRecipes.length,
      sample: validDishRecipes[0],
      hasRecipesRelation: !!validDishRecipes[0]?.recipes,
      recipeName: Array.isArray(validDishRecipes[0]?.recipes)
        ? (validDishRecipes[0]?.recipes as any)?.[0]?.recipe_name
        : (validDishRecipes[0]?.recipes as any)?.recipe_name,
    });
  }

  // Fetch dish ingredients - try with category first, fallback without if column doesn't exist
  // First, try to fetch with join to ingredients table
  // Note: Column is 'supplier' not 'supplier_name' in ingredients table
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

    // Fetch dish_ingredients without join
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

          // Manually join the data and map supplier to supplier_name
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
  // Similar to what we do for recipes
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

  // Log debug info to help diagnose missing ingredients
  logger.dev('[Dishes API] Fetched dish ingredients:', {
    dishId,
    dishName: dish.dish_name,
    rawCount: dishIngredients?.length || 0,
    validCount: validDishIngredients.length,
    filteredCount: (dishIngredients || []).length - validDishIngredients.length,
    hasError: !!ingredientsError,
    sample: validDishIngredients.length > 0 ? validDishIngredients[0] : null,
    allIngredientIds: (dishIngredients || []).map((di: any) => di.ingredient_id),
    ingredientRelationsNull: (dishIngredients || []).filter(
      (di: any) => di.ingredients === null || di.ingredients === undefined,
    ).length,
  });

  // If we have dish_ingredients rows but all have null ingredient relations, log a warning
  if (dishIngredients && dishIngredients.length > 0 && validDishIngredients.length === 0) {
    logger.warn('[Dishes API] All dish_ingredients have null ingredient relations:', {
      dishId,
      dishName: dish.dish_name,
      totalRows: dishIngredients?.length || 0,
      ingredientIds: dishIngredients?.map((di: any) => di.ingredient_id) || [],
      message: 'This suggests ingredient_id foreign keys are broken or ingredients were deleted',
    });
  }

  return {
    ...dish,
    recipes: validDishRecipes,
    ingredients: validDishIngredients,
  };
}
