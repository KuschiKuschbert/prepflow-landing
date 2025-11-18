/**
 * Async Prep Details Analysis Endpoint
 *
 * Analyzes prep details for recipes in the background
 * Called after prep list is generated to avoid blocking
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { batchAnalyzePrepDetails } from '../generate-from-menu/helpers/analyzePrepDetails';
import {
  aggregatePrepTechniques,
  addPrepNotesToIngredients,
} from '../generate-from-menu/helpers/aggregatePrepTechniques';
import type { RecipeIngredientWithDetails } from '@/app/webapp/recipes/types';
import type { RecipePrepDetails, SectionData } from '@/app/webapp/prep-lists/types';

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
        {
          success: false,
          error: 'Invalid request data',
          message: 'recipeIds must be a non-empty array',
        },
        { status: 400 },
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: 'Database connection could not be established',
        },
        { status: 500 },
      );
    }

    // Fetch recipes with instructions
    const { data: recipes } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, description, yield, yield_unit, instructions')
      .in('id', recipeIds)
      .not('instructions', 'is', null);

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        prepDetails: {},
        sections: [],
      });
    }

    // Batch fetch all recipe ingredients
    const recipeIngredientsMap = new Map<string, RecipeIngredientWithDetails[]>();
    const { data: allRecipeIngredients } = await supabaseAdmin
      .from('recipe_ingredients')
      .select(
        'id, recipe_id, ingredient_id, quantity, unit, ingredients(id, ingredient_name, cost_per_unit, unit)',
      )
      .in('recipe_id', recipeIds);

    if (allRecipeIngredients) {
      for (const ri of allRecipeIngredients) {
        const recipeId = (ri as any).recipe_id;
        if (!recipeIngredientsMap.has(recipeId)) {
          recipeIngredientsMap.set(recipeId, []);
        }
        recipeIngredientsMap.get(recipeId)!.push({
          id: (ri as any).id || '',
          recipe_id: recipeId,
          ingredient_id: (ri as any).ingredient_id,
          ingredient_name: (ri as any).ingredients?.ingredient_name || '',
          quantity: Number((ri as any).quantity),
          unit: (ri as any).unit,
          cost_per_unit: (ri as any).ingredients?.cost_per_unit || 0,
          total_cost: Number((ri as any).quantity) * ((ri as any).ingredients?.cost_per_unit || 0),
          ingredients: {
            id: (ri as any).ingredients?.id || '',
            ingredient_name: (ri as any).ingredients?.ingredient_name || '',
            cost_per_unit: (ri as any).ingredients?.cost_per_unit || 0,
            unit: (ri as any).ingredients?.unit || (ri as any).unit,
          },
        } as RecipeIngredientWithDetails);
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
      {
        success: false,
        error: 'Failed to analyze prep details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
