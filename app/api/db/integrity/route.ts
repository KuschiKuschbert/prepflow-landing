import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

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
    const { data: recipes, error: recipesError } = await supabaseAdmin.from('recipes').select('id');
    if (recipesError) {
      logger.error('[DB Integrity API] Database error fetching recipes:', {
        error: recipesError.message,
        code: (recipesError as any).code,
        context: { endpoint: '/api/db/integrity', operation: 'GET' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(recipesError, 500), {
        status: 500,
      });
    }

    const recipeIds = (recipes || []).map(r => r.id);
    let recipesWithNoLines = 0;
    if (recipeIds.length > 0) {
      const { data: counts, error: countErr } = await supabaseAdmin
        .from('recipe_ingredients')
        .select('recipe_id');
      if (countErr) {
        logger.error('[DB Integrity API] Database error fetching recipe ingredients:', {
          error: countErr.message,
          code: (countErr as any).code,
          context: { endpoint: '/api/db/integrity', operation: 'GET' },
        });
        return NextResponse.json(ApiErrorHandler.fromSupabaseError(countErr, 500), { status: 500 });
      }
      const withLines = new Set((counts || []).map(r => r.recipe_id));
      recipesWithNoLines = recipeIds.filter(id => !withLines.has(id)).length;
    }

    // Recipe ingredient rows with missing ingredient reference
    const { data: riRows, error: riErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('ingredient_id');
    if (riErr) {
      logger.error('[DB Integrity API] Database error fetching recipe ingredient rows:', {
        error: riErr.message,
        code: (riErr as any).code,
        context: { endpoint: '/api/db/integrity', operation: 'GET' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(riErr, 500), { status: 500 });
    }
    const uniqueIngIds = Array.from(
      new Set((riRows || []).map(r => r.ingredient_id).filter(Boolean)),
    );
    let missingIngredientRefs = 0;
    if (uniqueIngIds.length > 0) {
      const { data: ingRows, error: ingErr } = await supabaseAdmin
        .from('ingredients')
        .select('id')
        .in('id', uniqueIngIds);
      if (ingErr) {
        logger.error('[DB Integrity API] Database error fetching ingredients:', {
          error: ingErr.message,
          code: (ingErr as any).code,
          context: { endpoint: '/api/db/integrity', operation: 'GET' },
        });
        return NextResponse.json(ApiErrorHandler.fromSupabaseError(ingErr, 500), { status: 500 });
      }
      const present = new Set((ingRows || []).map(r => r.id));
      missingIngredientRefs = uniqueIngIds.filter(id => !present.has(id)).length;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalRecipes: recipeIds.length,
        recipesWithNoLines,
        uniqueIngredientIdsInLines: uniqueIngIds.length,
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
