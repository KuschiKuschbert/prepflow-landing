/**
 * Allergen Cross-Reference API Endpoint
 * GET /api/allergens/[code]/dishes
 * Returns all dishes containing a specific allergen
 */

import { aggregateDishAllergens } from '@/lib/allergens/allergen-aggregation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface Dish {
  id: string;
  allergens?: string[] | null;
}

async function getDishAllergensWithFallback(dish: Dish): Promise<string[]> {
  const cachedAllergens = dish.allergens as string[] | null | undefined;
  if (cachedAllergens && cachedAllergens.length > 0) {
    return cachedAllergens;
  }

  try {
    return await aggregateDishAllergens(dish.id);
  } catch (err) {
    logger.warn('[Allergen Cross-Reference API] Error aggregating dish allergens:', {
      dishId: dish.id,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

/**
 * Gets all dishes containing a specific allergen.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!code) {
      return NextResponse.json(
        ApiErrorHandler.createError('Allergen code is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Fetch all dishes
    const dishes = await fetchAllDishes(code);
    if (dishes instanceof NextResponse) return dishes;

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        data: { allergen_code: code, dishes: [], count: 0 },
      });
    }

    // Aggregate allergens for all dishes
    const dishesWithAllergens = await Promise.all(
      dishes.map(async dish => ({
        id: dish.id,
        dish_name: dish.dish_name,
        allergens: await getDishAllergensWithFallback(dish),
      })),
    );

    // Filter by the requested allergen code
    const filteredDishes = dishesWithAllergens.filter(dish => dish.allergens.includes(code));

    return NextResponse.json({
      success: true,
      data: {
        allergen_code: code,
        dishes: filteredDishes,
        count: filteredDishes.length,
      },
    });
  } catch (err) {
    logger.error('[Allergen Cross-Reference API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch dishes with allergen',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}

async function fetchAllDishes(code: string): Promise<any[] | NextResponse> {
  // Check Supabase connection
  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Optimize: Select only necessary fields
  const { data: dishes, error } = await supabaseAdmin
    .from('dishes')
    .select('id, dish_name, allergens')
    .is('deleted_at', null);

  if (error) {
    logger.error('[Allergen Cross-Reference API] Database error:', error);
    return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
  }

  return dishes || [];
}
