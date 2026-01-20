import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { cleanupTable } from './helpers/cleanupTable';

/**
 * Cleans up test data (dev-only).
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Cleanup response
 */
export async function POST(_request: NextRequest) {
  // Prevent cleanup in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Test data cleanup is not allowed in production',
        'FORBIDDEN',
        403,
        { message: 'This endpoint is only available in development mode' },
      ),
      { status: 403 },
    );
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();

    const results = {
      deleted: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    // Delete in proper order (child tables first, then parents)
    const tablesToClean = [
      // Child tables first (have foreign keys)
      'temperature_logs',
      'recipe_ingredients',
      'prep_list_items',
      'order_list_items',
      'compliance_records',
      'menu_dishes',
      // Parent tables
      'ingredients',
      'recipes',
      'temperature_equipment',
      'supplier_price_lists',
      'suppliers',
      'compliance_types',
      'kitchen_sections',
      'prep_lists',
      'order_lists',
      'cleaning_tasks',
      'cleaning_areas',
    ];

    for (const table of tablesToClean) {
      const { deleted, error } = await cleanupTable(supabaseAdmin, table);
      if (error) {
        results.errors.push({ table, error });
      } else {
        results.deleted.push({ table, count: deleted });
      }
    }

    const totalDeleted = results.deleted.reduce((sum, item) => sum + item.count, 0);

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${totalDeleted} records across ${results.deleted.length} tables`,
      deleted: results.deleted,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (err) {
    logger.error('[Cleanup Test Data] Error during test data cleanup:', {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      context: { endpoint: '/api/cleanup-test-data', method: 'POST' },
    });
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Internal server error during test data cleanup',
        'SERVER_ERROR',
        500,
        err instanceof Error ? err.message : String(err),
      ),
      { status: 500 },
    );
  }
}
