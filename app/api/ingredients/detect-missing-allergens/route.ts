/**
 * Bulk Allergen Detection API Endpoint
 * POST /api/ingredients/detect-missing-allergens
 * Detects allergens for ingredients that don't have them
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { enrichIngredientWithAllergensHybrid } from '@/lib/allergens/hybrid-allergen-detection';

/**
 * Detects allergens for ingredients missing them.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Detection results
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { ingredient_ids, force = false } = body;

    // Build query to find ingredients missing allergens
    let query = supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, brand, allergens, allergen_source');

    // Filter: ingredients without allergens OR with empty allergens array
    // OR force=true to re-detect all (except manually set ones)
    if (!force) {
      // Find ingredients where allergens is null, empty array, or doesn't exist
      query = query.or('allergens.is.null,allergens.eq.[]');
    } else {
      // When forcing, exclude manually set allergens
      // Find ingredients where allergen_source.manual is null or false
      query = query.or('allergen_source->>manual.is.null,allergen_source->>manual.eq.false');
    }

    // If specific ingredient IDs provided, filter by them
    if (ingredient_ids && Array.isArray(ingredient_ids) && ingredient_ids.length > 0) {
      query = query.in('id', ingredient_ids);
    }

    const { data: ingredients, error: fetchError } = await query;

    if (fetchError) {
      logger.error('[Detect Missing Allergens API] Error fetching ingredients:', {
        error: fetchError.message,
        code: (fetchError as any).code,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Failed to fetch ingredients', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          processed: 0,
          successful: 0,
          failed: 0,
          skipped: 0,
          results: [],
        },
      });
    }

    const results: Array<{
      ingredient_id: string;
      ingredient_name: string;
      status: 'success' | 'failed' | 'skipped';
      allergens?: string[];
      error?: string;
    }> = [];

    let successful = 0;
    let failed = 0;
    let skipped = 0;

    // Process each ingredient
    for (const ingredient of ingredients) {
      try {
        // Skip if manually set allergens (unless forcing)
        if (!force) {
          const hasManualAllergens =
            ingredient.allergen_source &&
            typeof ingredient.allergen_source === 'object' &&
            (ingredient.allergen_source as { manual?: boolean }).manual;

          if (hasManualAllergens) {
            skipped++;
            results.push({
              ingredient_id: ingredient.id,
              ingredient_name: ingredient.ingredient_name,
              status: 'skipped',
            });
            continue;
          }
        }

        // Detect allergens
        const enriched = await enrichIngredientWithAllergensHybrid({
          ingredient_name: ingredient.ingredient_name,
          brand: ingredient.brand || undefined,
          allergens: (ingredient.allergens as string[]) || [],
          allergen_source:
            (ingredient.allergen_source as {
              manual?: boolean;
              ai?: boolean;
            }) || {},
        });

        // Update ingredient with detected allergens
        const { error: updateError } = await supabaseAdmin
          .from('ingredients')
          .update({
            allergens: enriched.allergens,
            allergen_source: enriched.allergen_source,
          })
          .eq('id', ingredient.id);

        if (updateError) {
          throw updateError;
        }

        successful++;
        results.push({
          ingredient_id: ingredient.id,
          ingredient_name: ingredient.ingredient_name,
          status: 'success',
          allergens: enriched.allergens,
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        failed++;
        logger.error('[Detect Missing Allergens API] Error processing ingredient:', {
          ingredient_id: ingredient.id,
          ingredient_name: ingredient.ingredient_name,
          error: err instanceof Error ? err.message : String(err),
        });
        results.push({
          ingredient_id: ingredient.id,
          ingredient_name: ingredient.ingredient_name,
          status: 'failed',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    // Invalidate and re-aggregate allergen caches for affected recipes/dishes
    if (successful > 0) {
      const { invalidateRecipesWithIngredient, invalidateDishesWithIngredient } = await import(
        '@/lib/allergens/cache-invalidation'
      );
      const { batchAggregateRecipeAllergens } = await import(
        '@/lib/allergens/allergen-aggregation'
      );
      const { aggregateDishAllergens } = await import('@/lib/allergens/allergen-aggregation');

      // Collect all affected recipe and dish IDs
      const affectedRecipeIds = new Set<string>();
      const affectedDishIds = new Set<string>();

      // Invalidate caches and collect affected IDs
      await Promise.all(
        ingredients.map(async ingredient => {
          // Invalidate caches
          await Promise.all([
            invalidateRecipesWithIngredient(ingredient.id),
            invalidateDishesWithIngredient(ingredient.id),
          ]);

          // Find all recipes using this ingredient
          const { data: recipeIngredients } = await supabaseAdmin!
            .from('recipe_ingredients')
            .select('recipe_id')
            .eq('ingredient_id', ingredient.id);
          if (recipeIngredients) {
            recipeIngredients.forEach(ri => affectedRecipeIds.add(ri.recipe_id));
          }

          // Find all dishes using this ingredient
          const { data: dishIngredients } = await supabaseAdmin!
            .from('dish_ingredients')
            .select('dish_id')
            .eq('ingredient_id', ingredient.id);
          if (dishIngredients) {
            dishIngredients.forEach(di => affectedDishIds.add(di.dish_id));
          }
        }),
      );

      // Re-aggregate allergens for all affected recipes and dishes
      logger.dev(
        `[Detect Missing Allergens API] Re-aggregating allergens for ${affectedRecipeIds.size} recipes and ${affectedDishIds.size} dishes`,
      );

      // Batch aggregate recipes
      if (affectedRecipeIds.size > 0) {
        try {
          await batchAggregateRecipeAllergens(Array.from(affectedRecipeIds));
          logger.dev(
            `[Detect Missing Allergens API] Successfully re-aggregated allergens for ${affectedRecipeIds.size} recipes`,
          );
        } catch (err) {
          logger.error(
            '[Detect Missing Allergens API] Error batch aggregating recipe allergens:',
            err,
          );
        }
      }

      // Aggregate dishes (in parallel, but one by one since no batch function)
      if (affectedDishIds.size > 0) {
        try {
          await Promise.all(
            Array.from(affectedDishIds).map(dishId => aggregateDishAllergens(dishId, true)),
          );
          logger.dev(
            `[Detect Missing Allergens API] Successfully re-aggregated allergens for ${affectedDishIds.size} dishes`,
          );
        } catch (err) {
          logger.error('[Detect Missing Allergens API] Error aggregating dish allergens:', err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        processed: ingredients.length,
        successful,
        failed,
        skipped,
        results,
      },
    });
  } catch (err) {
    logger.error('[Detect Missing Allergens API] Unexpected error:', err);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to detect missing allergens',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
