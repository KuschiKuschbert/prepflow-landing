/**
 * Dish Allergen Sources API Endpoint
 * GET /api/dishes/[id]/allergen-sources
 * Returns which recipes/ingredients contribute which allergens to a dish
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { consolidateAllergens } from '@/lib/allergens/australian-allergens';

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
      const errorCode = (dishError as any).code;
      if (errorCode === '42P01') {
        // Table doesn't exist
        return NextResponse.json(
          ApiErrorHandler.createError('Dishes table not found', 'NOT_FOUND', 404),
          { status: 404 },
        );
      }
      return NextResponse.json(ApiErrorHandler.createError('Dish not found', 'NOT_FOUND', 404), {
        status: 404,
      });
    }

    const allergenSources: Record<
      string,
      Array<{
        source_type: 'recipe' | 'ingredient';
        source_id: string;
        source_name: string;
        quantity?: number;
        unit?: string;
        allergen_source?: {
          manual?: boolean;
          ai?: boolean;
        };
      }>
    > = {};

    const allAllergens = new Set<string>();

    // Fetch allergens from dish recipes
    const { data: dishRecipes, error: recipesError } = await supabaseAdmin
      .from('dish_recipes')
      .select(
        `
        recipe_id,
        quantity,
        unit,
        recipes (
          id,
          name,
          recipe_name,
          allergens
        )
      `,
      )
      .eq('dish_id', dishId);

    if (!recipesError && dishRecipes) {
      dishRecipes.forEach(dr => {
        const recipe = dr.recipes as unknown as {
          id: string;
          name?: string;
          recipe_name?: string;
          allergens?: string[];
        } | null;

        if (!recipe) return;

        const recipeName = recipe.recipe_name || recipe.name || 'Unknown Recipe';
        const allergens = (recipe.allergens as string[]) || [];
        const consolidatedAllergens = consolidateAllergens(allergens);

        consolidatedAllergens.forEach(allergen => {
          if (typeof allergen === 'string' && allergen.length > 0) {
            allAllergens.add(allergen);

            if (!allergenSources[allergen]) {
              allergenSources[allergen] = [];
            }

            allergenSources[allergen].push({
              source_type: 'recipe',
              source_id: recipe.id,
              source_name: recipeName,
              quantity: dr.quantity || undefined,
              unit: dr.unit || undefined,
            });
          }
        });
      });
    }

    // Fetch allergens from dish ingredients
    const { data: dishIngredients, error: ingredientsError } = await supabaseAdmin
      .from('dish_ingredients')
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
      .eq('dish_id', dishId);

    if (!ingredientsError && dishIngredients) {
      dishIngredients.forEach(di => {
        const ingredient = di.ingredients as unknown as {
          id: string;
          ingredient_name: string;
          brand?: string;
          allergens?: string[];
          allergen_source?: {
            manual?: boolean;
            ai?: boolean;
          };
        } | null;

        if (!ingredient) return;

        const allergens = (ingredient.allergens as string[]) || [];
        const consolidatedAllergens = consolidateAllergens(allergens);

        consolidatedAllergens.forEach(allergen => {
          if (typeof allergen === 'string' && allergen.length > 0) {
            allAllergens.add(allergen);

            if (!allergenSources[allergen]) {
              allergenSources[allergen] = [];
            }

            allergenSources[allergen].push({
              source_type: 'ingredient',
              source_id: ingredient.id,
              source_name: ingredient.brand
                ? `${ingredient.ingredient_name} (${ingredient.brand})`
                : ingredient.ingredient_name,
              quantity: di.quantity || undefined,
              unit: di.unit || undefined,
              allergen_source: ingredient.allergen_source || undefined,
            });
          }
        });
      });
    }

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
