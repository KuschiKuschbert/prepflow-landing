import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface RecipeIngredientRow {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string | null;
}

/**
 * Dev-only endpoint to remove duplicate recipe_ingredient rows.
 * For each (recipe_id, ingredient_id) with multiple rows: keeps one, sums quantities, deletes extras.
 * Use ?dry=1 to preview without changes.
 */
export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database not available', 'SERVER_ERROR', 500),
        { status: 500 },
      );
    }

    if (process.env.NODE_ENV === 'production') {
      const adminKey = req.headers.get('x-admin-key');
      if (!adminKey || adminKey !== process.env.SEED_ADMIN_KEY) {
        return NextResponse.json(
          ApiErrorHandler.createError('Admin key required', 'FORBIDDEN', 403),
          { status: 403 },
        );
      }
    }

    const dry = req.nextUrl.searchParams.get('dry') === '1';

    const { data: rows, error: fetchErr } = await supabaseAdmin
      .from('recipe_ingredients')
      .select('id, recipe_id, ingredient_id, quantity, unit')
      .order('id', { ascending: true });

    if (fetchErr) {
      logger.error('[Dedupe Recipe Ingredients] Error fetching recipe_ingredients:', {
        error: fetchErr.message,
        context: { endpoint: '/api/db/dedupe-recipe-ingredients' },
      });
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(fetchErr, 500), { status: 500 });
    }

    const items = (rows || []) as RecipeIngredientRow[];

    // Group by (recipe_id, ingredient_id)
    const groups = new Map<string, RecipeIngredientRow[]>();
    for (const row of items) {
      const key = `${row.recipe_id}|${row.ingredient_id}`;
      const list = groups.get(key) || [];
      list.push(row);
      groups.set(key, list);
    }

    const toMerge = Array.from(groups.values()).filter(list => list.length > 1);
    const totalDuplicates = toMerge.reduce((sum, list) => sum + list.length - 1, 0);

    if (toMerge.length === 0) {
      return NextResponse.json({
        success: true,
        dry,
        message: 'No duplicate recipe_ingredient rows found',
        duplicatesRemoved: 0,
        rowsUpdated: 0,
      });
    }

    if (dry) {
      return NextResponse.json({
        success: true,
        dry: true,
        message: `Would remove ${totalDuplicates} duplicate rows across ${toMerge.length} (recipe_id, ingredient_id) pairs`,
        duplicatePairs: toMerge.length,
        totalDuplicatesRemoved: totalDuplicates,
        sample: toMerge.slice(0, 5).map(list => ({
          recipe_id: list[0].recipe_id,
          ingredient_id: list[0].ingredient_id,
          rowCount: list.length,
          totalQuantity: list.reduce((s, r) => s + (r.quantity ?? 0), 0),
        })),
      });
    }

    let rowsUpdated = 0;
    let rowsDeleted = 0;

    for (const list of toMerge) {
      const keep = list[0];
      const totalQty = list.reduce((s, r) => s + (r.quantity ?? 0), 0);
      const idsToDelete = list.slice(1).map(r => r.id);

      // Update kept row with summed quantity
      const { error: updateErr } = await supabaseAdmin
        .from('recipe_ingredients')
        .update({ quantity: totalQty })
        .eq('id', keep.id);

      if (updateErr) {
        logger.error('[Dedupe Recipe Ingredients] Error updating row:', {
          error: updateErr.message,
          id: keep.id,
        });
        continue;
      }
      rowsUpdated++;

      // Delete duplicate rows
      const { error: deleteErr } = await supabaseAdmin
        .from('recipe_ingredients')
        .delete()
        .in('id', idsToDelete);

      if (deleteErr) {
        logger.error('[Dedupe Recipe Ingredients] Error deleting duplicates:', {
          error: deleteErr.message,
          ids: idsToDelete,
        });
      } else {
        rowsDeleted += idsToDelete.length;
      }
    }

    return NextResponse.json({
      success: true,
      dry: false,
      message: `Removed ${rowsDeleted} duplicate recipe_ingredient rows, updated ${rowsUpdated} kept rows with summed quantities`,
      duplicatesRemoved: rowsDeleted,
      rowsUpdated,
    });
  } catch (e) {
    logger.error('[Dedupe Recipe Ingredients] Unexpected error:', {
      error: e instanceof Error ? e.message : String(e),
      stack: e instanceof Error ? e.stack : undefined,
      context: { endpoint: '/api/db/dedupe-recipe-ingredients' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to dedupe recipe ingredients',
        'SERVER_ERROR',
        500,
        e instanceof Error ? e.message : String(e),
      ),
      { status: 500 },
    );
  }
}
