/**
 * Recipe Allergen Sources API Endpoint
 * GET /api/recipes/[id]/allergen-sources
 * Returns which ingredients contribute which allergens to a recipe
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { buildAllergenMap, formatAllergenResponse } from './helpers/allergen-mapper';
import { fetchRecipeDetails } from './helpers/details-fetcher';

/**
 * Gets allergen sources for a recipe (which ingredients contribute which allergens).
 *
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context with params
 * @returns {Promise<NextResponse>} Allergen sources
 */
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const recipeId = id;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!recipeId) {
      return NextResponse.json(
        ApiErrorHandler.createError('Recipe ID is required', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    // Fetch recipe and ingredients
    const { recipe, ingredients, error } = await fetchRecipeDetails(recipeId);

    if (error) {
      if (!recipe) {
        return NextResponse.json(
          ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404),
          { status: 404 }
        );
      }
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipe ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          recipe_id: recipeId,
          recipe_name: recipe!.recipe_name || recipe!.name,
          allergen_sources: [],
          total_allergens: [],
        },
      });
    }

    // Build allergen map
    const { allergenSources, allAllergens } = buildAllergenMap(ingredients);

    // Format response
    const responseData = formatAllergenResponse(
      recipeId,
      recipe!.recipe_name || recipe!.name,
      allergenSources,
      allAllergens
    );

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (err) {
    logger.error('[Recipe Allergen Sources API] Unexpected error:', err);
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
