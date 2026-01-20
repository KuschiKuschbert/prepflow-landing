import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { checkIngredientIntegrity, checkRecipeIntegrity } from './helpers/checkers';

export async function GET(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        ApiErrorHandler.createError('Not available in production', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }
    const adminKey = request.headers.get('x-admin-key');
    if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Recipes without any recipe_ingredients
    // Recipes without any recipe_ingredients
    const { totalRecipes, recipesWithNoLines } = await checkRecipeIntegrity(supabaseAdmin);

    // Recipe ingredient rows with missing ingredient reference
    const { uniqueIngredientIdsInLines, missingIngredientRefs } = await checkIngredientIntegrity(
      supabaseAdmin,
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalRecipes,
        recipesWithNoLines,
        uniqueIngredientIdsInLines,
        missingIngredientRefs,
      },
    });
  } catch (err) {
    logger.error('[DB Integrity API] Unexpected error:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/db/integrity', method: 'GET' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError('Failed to check database integrity', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
