/**
 * Async Prep Details Analysis Endpoint
 *
 * Analyzes prep details for recipes in the background
 * Called after prep list is generated to avoid blocking
 */

import type { RecipePrepDetails } from '@/app/webapp/prep-lists/types';
import type { RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { batchAnalyzePrepDetails } from '../generate-from-menu/helpers/analyzePrepDetails';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

/**
 * POST /api/prep-lists/analyze-prep-details
 * Analyze prep details for recipes in the background (async, non-blocking)
 *
 * @param {NextRequest} request - Request object
 * @param {Object} request.body - Request body
 * @param {string[]} request.body.recipeIds - Recipe IDs to analyze
 * @param {string} [request.body.countryCode] - Country code (default: 'AU')
 * @returns {Promise<NextResponse>} Prep details analysis response
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeIds, countryCode = 'AU' } = body as {
      recipeIds: string[];
      countryCode?: string;
    };

    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return NextResponse.json(
        ApiErrorHandler.createError('recipeIds must be a non-empty array', 'INVALID_REQUEST', 400),
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          'Database connection could not be established',
          'DATABASE_ERROR',
          500,
        ),
        { status: 500 },
      );
    }

    // Fetch recipes with instructions
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, description, yield, yield_unit, instructions')
      .in('id', recipeIds)
      .not('instructions', 'is', null);

    if (recipesError) {
      logger.warn('[Prep Details Analysis] Error fetching recipes:', {
        error: recipesError.message,
        code: recipesError.code,
        recipeIds,
      });
      // Continue with empty array if fetch fails
    }

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        prepDetails: {},
        sections: [],
      });
    }

    // Batch fetch all recipe ingredients
    const recipeIngredientsMap = new Map<string, RecipeIngredientWithDetails[]>();

    // Define the expected shape of the joined query response
    interface RawRecipeIngredient {
      id: string;
      recipe_id: string;
      ingredient_id: string;
      quantity: number | null;
      unit: string | null;
      ingredients: {
        id: string;
        ingredient_name: string;
        cost_per_unit: number | null;
        unit: string | null;
      } | null;
    }

    const { data: rawIngredients, error: ingredientsError } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        'id, recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name, cost_per_unit, unit)',
      )
      .in('recipe_id', recipeIds);

    const allRecipeIngredients = rawIngredients as unknown as RawRecipeIngredient[] | null;

    if (ingredientsError) {
      logger.warn('[Prep Details Analysis] Error fetching recipe ingredients:', {
        error: ingredientsError.message,
        code: ingredientsError.code,
        recipeIds,
      });
      // Continue with empty map if fetch fails
    }

    if (allRecipeIngredients) {
      for (const ri of allRecipeIngredients) {
        const recipeId = ri.recipe_id;
        if (!recipeIngredientsMap.has(recipeId)) {
          recipeIngredientsMap.set(recipeId, []);
        }

        const details: RecipeIngredientWithDetails = {
          id: ri.id,
          recipe_id: recipeId,
          ingredient_id: ri.ingredient_id,
          ingredient_name: ri.ingredients?.ingredient_name || '',
          quantity: Number(ri.quantity) || 0,
          unit: ri.unit || '',
          cost_per_unit: ri.ingredients?.cost_per_unit || 0,
          total_cost: (Number(ri.quantity) || 0) * (ri.ingredients?.cost_per_unit || 0),
          ingredients: {
            id: ri.ingredients?.id || '',
            ingredient_name: ri.ingredients?.ingredient_name || '',
            cost_per_unit: ri.ingredients?.cost_per_unit || 0,
            unit: ri.ingredients?.unit || ri.unit || '',
          },
        };

        recipeIngredientsMap.get(recipeId)!.push(details);
      }
    }

    // Build recipes to analyze
    const recipesToAnalyze = recipes
      .filter(recipe => {
        const ingredients = recipeIngredientsMap.get(recipe.id) || [];
        return (
          ingredients.length > 0 && recipe.instructions && recipe.instructions.trim().length > 0
        );
      })
      .map(recipe => ({
        recipe: {
          id: recipe.id,
          recipe_name: recipe.recipe_name,
          description: recipe.description || '',
          yield: recipe.yield,
          yield_unit: recipe.yield_unit,
          instructions: recipe.instructions || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        ingredients: recipeIngredientsMap.get(recipe.id) || [],
        instructions: recipe.instructions || null,
      }));

    // Analyze prep details
    const prepDetailsMap = await batchAnalyzePrepDetails(recipesToAnalyze, countryCode);

    // Convert to simple object for response
    const prepDetails: Record<string, RecipePrepDetails> = {};
    for (const [recipeId, details] of prepDetailsMap) {
      prepDetails[recipeId] = details;
    }

    return NextResponse.json({
      success: true,
      prepDetails,
    });
  } catch (error) {
    logger.error('Prep details analysis error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        error instanceof Error ? error.message : 'Unknown error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
