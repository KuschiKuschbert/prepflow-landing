import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { buildUsageMap } from './helpers/buildUsageMap';
import { processIngredientDeduplication } from './helpers/processIngredients';
import { processRecipeDeduplication } from './helpers/processRecipes';

/**
 * Dev-only endpoint that merges duplicate ingredients and recipes.
 * Strategy:
 *  - Ingredients: group by normalized composite key; choose survivor by most usages in recipe_ingredients, then newest.
 *  - Recipes: group by lower(name); survivor by most usages in recipe_ingredients, then newest.
 * All updates are best-effort; returns a report of changes.
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json(ApiErrorHandler.createError('DB unavailable', 'SERVER_ERROR', 500), { status: 500 });
    if (process.env.NODE_ENV === 'production') {
      const adminKey = req.headers.get('x-admin-key');
      if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
        return NextResponse.json(ApiErrorHandler.createError('Admin key required', 'FORBIDDEN', 403), { status: 403 });
      }
    }

    const url = new URL(req.url);
    const dry = url.searchParams.get('dry') === '1';

    // Load ingredients and usages
    const { data: ingredients, error: ingErr } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, supplier, brand, pack_size, unit, cost_per_unit, updated_at');
    if (ingErr) {
      logger.error('[Dedupe Execute API] Error fetching ingredients:', {
        error: ingErr.message,
        code: (ingErr as any).code,
        context: { endpoint: '/api/dedupe/execute', operation: 'POST' },
      });
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(ingErr, 500),
        { status: 500 },
      );
    }

    const { data: riRows, error: riErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('ingredient_id');
    if (riErr) {
      logger.error('[Dedupe Execute API] Error fetching recipe ingredients:', {
        error: riErr.message,
        code: (riErr as any).code,
        context: { endpoint: '/api/dedupe/execute', operation: 'POST' },
      });
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(riErr, 500),
        { status: 500 },
      );
    }
    const usageByIng = buildUsageMap(riRows || [], 'ingredient_id');
    const ingMerges = await processIngredientDeduplication(ingredients || [], usageByIng, dry);

    // Recipes
    const { data: recipes, error: recErr } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, updated_at');
    if (recErr) {
      logger.error('[Dedupe Execute API] Error fetching recipes:', {
        error: recErr.message,
        code: (recErr as any).code,
        context: { endpoint: '/api/dedupe/execute', operation: 'POST' },
      });
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(recErr, 500),
        { status: 500 },
      );
    }

    const { data: riByRecipe, error: riRecErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('recipe_id');
    if (riRecErr) {
      logger.error('[Dedupe Execute API] Error fetching recipe ingredients by recipe:', {
        error: riRecErr.message,
        code: (riRecErr as any).code,
        context: { endpoint: '/api/dedupe/execute', operation: 'POST' },
      });
      return NextResponse.json(
        ApiErrorHandler.fromSupabaseError(riRecErr, 500),
        { status: 500 },
      );
    }
    const usageByRecipe = buildUsageMap(riByRecipe || [], 'recipe_id');
    const recipeMerges = await processRecipeDeduplication(recipes || [], usageByRecipe, dry);

    return NextResponse.json({
      success: true,
      dry,
      ingredients: { merges: ingMerges },
      recipes: { merges: recipeMerges },
    });
  } catch (e: any) {
    logger.error('[Dedupe Execute API] Unexpected error:', {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
      context: { endpoint: '/api/dedupe/execute', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError('Failed to execute deduplication', 'SERVER_ERROR', 500, e?.message || String(e)),
      { status: 500 },
    );
  }
}
