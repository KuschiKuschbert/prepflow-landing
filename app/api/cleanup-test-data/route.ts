import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

import { logger } from '../../lib/logger';
export async function POST(request: NextRequest) {
  // Prevent cleanup in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      {
        error: 'Test data cleanup is not allowed in production',
        message: 'This endpoint is only available in development mode',
      },
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
      try {
        // Get count before deletion
        const { count } = await supabaseAdmin
          .from(table)
          .select('*', { count: 'exact', head: true });

        // Delete all records
        const { error } = await supabaseAdmin.from(table).delete().neq('id', '0'); // Delete all

        if (error) {
          results.errors.push({ table, error: error.message });
        } else {
          results.deleted.push({ table, count: count || 0 });
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        results.errors.push({ table, error: errorMessage });
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
    logger.error('Error during test data cleanup:', err);
    return NextResponse.json(
      {
        error: 'Internal server error during test data cleanup',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
