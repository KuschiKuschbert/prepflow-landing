/**
 * Async Prep Details Analysis Endpoint
 *
 * Analyzes prep details for recipes in the background
 * Called after prep list is generated to avoid blocking
 */

import type { RecipePrepDetails } from '@/app/webapp/prep-lists/types';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { batchAnalyzePrepDetails } from '../generate-from-menu/helpers/analyzePrepDetails';

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { buildRecipesToAnalyze } from './helpers/buildAnalysisData';
import { fetchAndMapRecipeIngredients } from './helpers/fetchIngredients';
import { fetchRecipesWithInstructions } from './helpers/fetchRecipes';

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
    const { recipes, error: recipesError } = await fetchRecipesWithInstructions(recipeIds);

    if (recipesError) {
      // Continue with empty array if fetch fails logic was present, but fetch helper handles logging.
      // If we want to return empty immediately if fetch failed seriously:
      // But preserving original behavior which continued with potentially partial data?
      // Actually original behavior was: "Continue with empty array".
    }

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        prepDetails: {},
        sections: [],
      });
    }

    // Batch fetch all recipe ingredients
    const recipeIngredientsMap = await fetchAndMapRecipeIngredients(recipeIds);

    // Build recipes to analyze
    const recipesToAnalyze = buildRecipesToAnalyze(recipes, recipeIngredientsMap);

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
