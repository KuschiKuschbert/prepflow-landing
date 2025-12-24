import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';

/**
 * Dev-only endpoint to preview duplicate ingredients and recipes.
 * Groups:
 *  - Ingredients: lower(name), supplier, brand, pack_size, unit, cost_per_unit
 *  - Recipes: lower(name)
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    // Optional: only allow in non-production to be safe
    if (process.env.NODE_ENV === 'production') {
      const adminKey = req.headers.get('x-admin-key');
      if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
        return NextResponse.json(
          ApiErrorHandler.createError('Admin key required', 'FORBIDDEN', 403),
          { status: 403 },
        );
      }
    }

    const { data: ingredients, error: ingErr } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, supplier, brand, pack_size, unit, cost_per_unit, updated_at');
    if (ingErr) {
      logger.error('[Dedupe Preview API] Error fetching ingredients:', {
        error: ingErr.message,
        code: (ingErr as any).code,
        context: { endpoint: '/api/dedupe/preview', operation: 'POST' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(ingErr, 500), { status: 500 });
    }

    const ingredientGroups: Record<string, { key: string; ids: string[]; sample: any }> = {};
    (ingredients || []).forEach(row => {
      const key = [
        String(row.ingredient_name || '')
          .toLowerCase()
          .trim(),
        row.supplier || '',
        row.brand || '',
        row.pack_size || '',
        row.unit || '',
        row.cost_per_unit ?? '',
      ].join('|');
      if (!ingredientGroups[key]) ingredientGroups[key] = { key, ids: [], sample: row };
      ingredientGroups[key].ids.push(row.id);
    });
    const ingredientDuplicates = Object.values(ingredientGroups)
      .filter(g => g.ids.length > 1)
      .map(g => ({ key: g.key, count: g.ids.length, ids: g.ids, sample: g.sample }));

    const { data: recipes, error: recErr } = await supabaseAdmin
      .from('recipes')
      .select('id, recipe_name, updated_at');
    if (recErr) {
      logger.error('[Dedupe Preview API] Error fetching recipes:', {
        error: recErr.message,
        code: (recErr as any).code,
        context: { endpoint: '/api/dedupe/preview', operation: 'POST' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(recErr, 500), { status: 500 });
    }

    const recipeGroups: Record<string, { key: string; ids: string[]; sample: any }> = {};
    (recipes || []).forEach(row => {
      const key = String(row.recipe_name || '')
        .toLowerCase()
        .trim();
      if (!recipeGroups[key]) recipeGroups[key] = { key, ids: [], sample: row };
      recipeGroups[key].ids.push(row.id);
    });
    const recipeDuplicates = Object.values(recipeGroups)
      .filter(g => g.ids.length > 1)
      .map(g => ({ key: g.key, count: g.ids.length, ids: g.ids, sample: g.sample }));

    return NextResponse.json({
      success: true,
      ingredients: { duplicates: ingredientDuplicates, total: ingredients?.length || 0 },
      recipes: { duplicates: recipeDuplicates, total: recipes?.length || 0 },
    });
  } catch (e: any) {
    logger.error('[route.ts] Error in catch block:', {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
    });
    if (e && typeof e === 'object' && 'status' in e && 'json' in e) {
      return e as NextResponse;
    }
    return NextResponse.json(ApiErrorHandler.createError('Failed to generate deduplication preview', 'SERVER_ERROR', 500), { status: 500 });
  }
}

// Convenience: allow GET in browser to view the preview JSON directly
export async function GET(req: NextRequest) {
  return POST(req);
}
