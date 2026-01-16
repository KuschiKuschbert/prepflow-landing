/**
 * Recipe Allergen Sources API Endpoint
 * GET /api/recipes/[id]/allergen-sources
 * Returns which ingredients contribute which allergens to a recipe
 */

import { consolidateAllergens } from '@/lib/allergens/australian-allergens';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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

    // Fetch recipe to get name
    const { data: recipe, error: recipeError } = await supabaseAdmin
      .from('recipes')
      .select('id, name, recipe_name')
      .eq('id', recipeId)
      .single();

    if (recipeError || !recipe) {
      return NextResponse.json(ApiErrorHandler.createError('Recipe not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    // Fetch all ingredients in recipe with their allergens
    const { data: recipeIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        `
        ingredient_id,
        quantity,
        unit,
        ingredients (
          id,
          ingredient_name,
          brand,
          allergens,
          allergen_source
        )
      `,
      )
      .eq('recipe_id', recipeId);

    if (ingredientsError) {
      logger.error('[Recipe Allergen Sources API] Error fetching recipe ingredients:', {
        recipeId,
        error: ingredientsError.message,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch recipe ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          recipe_id: recipeId,
          recipe_name: (recipe as unknown).recipe_name || (recipe as unknown).name,
          allergen_sources: [],
          total_allergens: [],
        },
      });
    }

    // Build allergen sources map
    const allergenSources: Record<
      string,
      Array<{
        ingredient_id: string;
        ingredient_name: string;
        brand?: string;
        quantity?: number;
        unit?: string;
        allergen_source?: {
          manual?: boolean;
          ai?: boolean;
        };
      }>
    > = {};

    const allAllergens = new Set<string>();

    interface RawRecipeIngredientJoin {
      ingredient_id: string;
      quantity: unknown; // quantity can be number or string from DB depending on driver, simplified here or needs stricter check
      unit: string;
      ingredients: {
        id: string;
        ingredient_name: string;
        brand?: string;
        allergens?: string[];
        allergen_source?: {
          manual?: boolean;
          ai?: boolean;
        };
      } | null;
    }

    recipeIngredients.forEach(ri => {
      const ingredient = (ri as unknown as RawRecipeIngredientJoin).ingredients;

      if (!ingredient) return;

      const allergens = (ingredient.allergens as string[]) || []; // DB array type can be null, default to empty
      // Consolidate allergens to handle old codes
      const consolidatedAllergens = consolidateAllergens(allergens);

      consolidatedAllergens.forEach(allergen => {
        if (typeof allergen === 'string' && allergen.length > 0) {
          allAllergens.add(allergen);

          if (!allergenSources[allergen]) {
            allergenSources[allergen] = [];
          }

          allergenSources[allergen].push({
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.ingredient_name,
            brand: ingredient.brand || undefined,
            quantity: ri.quantity || undefined,
            unit: ri.unit || undefined,
            allergen_source: ingredient.allergen_source || undefined,
          });
        }
      });
    });

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
        recipe_id: recipeId,
        recipe_name: recipe.recipe_name || recipe.name,
        allergen_sources: allergenSourcesArray,
        total_allergens: Array.from(allAllergens).sort(),
      },
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
