/**
 * Allergen Cross-Reference API Endpoint
 * GET /api/allergens/[code]/dishes
 * Returns all dishes containing a specific allergen
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { aggregateDishAllergens } from '@/lib/allergens/allergen-aggregation';

/**
 * Gets all dishes containing a specific allergen.
 *
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context with params
 * @returns {Promise<NextResponse>} Dishes with allergen
 */
export async function GET(_request: NextRequest, context: { params: Promise<{ code: string }> }) {
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
    const { data: dishes, error: fetchError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name, allergens')
      .order('dish_name');

    if (fetchError) {
      const errorCode = (fetchError as any).code;
      if (errorCode === '42P01') {
        // Table doesn't exist - return empty data
        logger.dev('[Allergen Cross-Reference API] Dishes table not found, returning empty data');
        return NextResponse.json({
          success: true,
          data: {
            allergen_code: code,
            dishes: [],
            count: 0,
          },
        });
      }

      logger.error('[Allergen Cross-Reference API] Error fetching dishes:', {
        allergenCode: code,
        error: fetchError.message,
        code: errorCode,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch dishes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!dishes || dishes.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          allergen_code: code,
          dishes: [],
          count: 0,
        },
      });
    }

    // Aggregate allergens for dishes that don't have cached allergens
    const dishesWithAllergens = await Promise.all(
      dishes.map(async dish => {
        const cachedAllergens = dish.allergens as string[] | null | undefined;
        let allergens: string[] = [];

        if (cachedAllergens && cachedAllergens.length > 0) {
          allergens = cachedAllergens;
        } else {
          try {
            allergens = await aggregateDishAllergens(dish.id);
          } catch (err) {
            logger.warn('[Allergen Cross-Reference API] Error aggregating dish allergens:', {
              dishId: dish.id,
              error: err instanceof Error ? err.message : String(err),
            });
            allergens = [];
          }
        }

        return {
          id: dish.id,
          dish_name: dish.dish_name,
          allergens,
          contains_allergen: allergens.includes(code),
        };
      }),
    );

    // Filter dishes that contain the allergen
    const dishesWithAllergen = dishesWithAllergens
      .filter(dish => dish.contains_allergen)
      .map(({ contains_allergen, ...dish }) => dish); // Remove contains_allergen flag

    return NextResponse.json({
      success: true,
      data: {
        allergen_code: code,
        dishes: dishesWithAllergen,
        count: dishesWithAllergen.length,
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


