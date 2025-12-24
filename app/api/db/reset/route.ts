import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

import { ApiErrorHandler } from '@/lib/api-error-handler';

export async function POST(request: NextRequest) {
  try {
    // Guard: dev-only and admin key required
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        ApiErrorHandler.createError('Reset is disabled in production', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }

    const adminKeyHeader = request.headers.get('x-admin-key');
    const adminKeyEnv = process.env.SEED_ADMIN_KEY;
    if (!adminKeyEnv || adminKeyHeader !== adminKeyEnv) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const dryRun = request.nextUrl.searchParams.get('dry') === '1';

    const supabase = createSupabaseAdmin();

    // FK-safe delete order
    const tablesInOrder = [
      'sales_data',
      'menu_items',
      'menu_dishes',
      'dish_ingredients',
      'dish_recipes',
      'dishes',
      'menus',
      'recipe_ingredients',
      'recipes',
      'ingredients',
    ];

    if (dryRun) {
      return NextResponse.json({ success: true, dryRun: true, tables: tablesInOrder });
    }

    const results: { table: string; error?: string }[] = [];

    for (const table of tablesInOrder) {
      const { error } = await supabase.from(table).delete().neq('id', null);
      if (error) {
        logger.error('[DB Reset API] Error deleting table:', {
          error: error.message,
          code: (error as any).code,
          table,
          context: { endpoint: '/api/db/reset', operation: 'POST' },
        });
        results.push({ table, error: error.message });
        // Stop early if a dependent delete fails
        return NextResponse.json(
          ApiErrorHandler.createError('Reset failed', 'SERVER_ERROR', 500, results),
          { status: 500 },
        );
      }
      results.push({ table });
    }

    return NextResponse.json({ success: true, tables: results });
  } catch (error) {
    logger.error('[DB Reset API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context: { endpoint: '/api/db/reset', operation: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        error instanceof Error ? error.message : 'Reset failed',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}
