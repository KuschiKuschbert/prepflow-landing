/**
 * Dish Allergen Sources API Endpoint
 * GET /api/dishes/[id]/allergen-sources
 * Returns which recipes/ingredients contribute which allergens to a dish
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { processIngredientAllergens } from './helpers/processIngredientAllergens';
import type { AllergenSource } from './helpers/processRecipeAllergens';
import { processRecipeAllergens } from './helpers/processRecipeAllergens';

/**
 * Gets allergen sources for a dish (which recipes/ingredients contribute which allergens).
 *
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context with params
 * @returns {Promise<NextResponse>} Allergen sources
 */
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const dishId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!dishId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Dish ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Fetch dish to get name
    const { data: dish, error: dishError } = await supabaseAdmin
      .from('dishes')
      .select('id, dish_name')
      .eq('id', dishId)
      .single();

    if (dishError || !dish) {
      const errorCode = dishError?.code;
      if (errorCode === '42P01') {
        return NextResponse.json(
          ApiErrorHandler.createError('Dishes table not found', 'NOT_FOUND', 404),
          { status: 404 },
        );
      }
      return NextResponse.json(ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    const allergenSources: Record<string, AllergenSource[]> = {};
    const allAllergens = new Set<string>();

    // Process recipe allergens
    await processRecipeAllergens(dishId, allergenSources, allAllergens);

    // Process ingredient allergens
    await processIngredientAllergens(dishId, allergenSources, allAllergens);

    // Convert to array format
    const allergenSourcesArray = Object.entries(allergenSources).map(
      ([allergen_code, sources]) => ({
        allergen_code,
        sources,
        source_count: sources.length,
      }),
    );

    return NextResponse.json({
      success: true,
      data: {
        dish_id: dishId,
        dish_name: dish.dish_name,
        allergen_sources: allergenSourcesArray,
        total_allergens: Array.from(allAllergens).sort(),
      },
    });
  } catch (err) {
    logger.error('[Dish Allergen Sources API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch allergen sources',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
