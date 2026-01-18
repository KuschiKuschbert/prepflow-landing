import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { calculateRecipeReadiness } from './helpers/calculateRecipeReadiness';
import { fetchRecipes } from './helpers/fetchRecipes';
import { handleRecipeReadinessError } from './helpers/handleRecipeReadinessError';
import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function GET(_req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const recipes = await fetchRecipes();

    // Handle empty recipes gracefully (not an error)
    if (!recipes || recipes.length === 0) {
      return NextResponse.json({
        success: true,
        completeRecipes: 0,
        incompleteRecipes: 0,
        recipesWithoutCost: 0,
        mostUsedRecipes: [],
        totalRecipes: 0,
      });
    }

    const statistics = await calculateRecipeReadiness(recipes);

    return NextResponse.json({
      success: true,
      ...statistics,
    });
  } catch (error) {
    logger.error('[route.ts] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return handleRecipeReadinessError(error);
  }
}
