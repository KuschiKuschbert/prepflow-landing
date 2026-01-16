/**
 * Allergen Cross-Reference API Endpoint
 * GET /api/allergens/[code]/recipes
 * Returns all recipes containing a specific allergen
 */

import { batchAggregateRecipeAllergens } from '@/lib/allergens/allergen-aggregation';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Gets all recipes containing a specific allergen.
 *
 * @param {NextRequest} request - Next.js request object
 * @param {Object} context - Route context with params
 * @returns {Promise<NextResponse>} Recipes with allergen
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

    // Fetch all recipes
    const { data: recipes, error: fetchError } = await supabaseAdmin
      .from('recipes')
      .select('id, name, recipe_name, allergens')
      .order('name');

    if (fetchError) {
      logger.error('[Allergen Cross-Reference API] Error fetching recipes:', {
        allergenCode: code,
        error: fetchError.message,
        code: fetchError.code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipes', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          allergen_code: code,
          recipes: [],
          count: 0,
        },
      });
    }

    // Batch aggregate allergens for recipes that don't have cached allergens
    const recipeIds = recipes.map(r => r.id);
    const allergensByRecipe = await batchAggregateRecipeAllergens(recipeIds);

    // Filter recipes that contain the allergen
    const recipesWithAllergen = recipes
      .map(recipe => {
        const recipeName = recipe.recipe_name || recipe.name;
        const cachedAllergens = recipe.allergens as string[] | null | undefined;
        const aggregatedAllergens = allergensByRecipe[recipe.id] || [];

        // Use cached allergens if available, otherwise use aggregated
        const allergens =
          cachedAllergens && cachedAllergens.length > 0 ? cachedAllergens : aggregatedAllergens;

        return {
          id: recipe.id,
          recipe_name: recipeName,
          allergens,
          contains_allergen: allergens.includes(code),
        };
      })
      .filter(recipe => recipe.contains_allergen)
      .map(({ contains_allergen, ...recipe }) => recipe); // Remove contains_allergen flag

    return NextResponse.json({
      success: true,
      data: {
        allergen_code: code,
        recipes: recipesWithAllergen,
        count: recipesWithAllergen.length,
      },
    });
  } catch (err) {
    logger.error('[Allergen Cross-Reference API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch recipes with allergen',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
