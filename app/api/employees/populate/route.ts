import { createSupabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { populateStaff } from '@/lib/populate-helpers';

/**
 * POST /api/employees/populate
 * Populate 5 test staff members without cleaning existing data
 */
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        ApiErrorHandler.createError('Not available in production', 'FORBIDDEN', 403),
        { status: 403 },
      );
    }

    const supabaseAdmin = createSupabaseAdmin();

    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    logger.dev('👥 Populating staff members...');
    const staffData = await populateStaff(supabaseAdmin, results);

    return NextResponse.json({
      success: true,
      message: `Successfully populated ${results.populated[0]?.count || 0} staff members`,
      data: {
        populated: results.populated,
        errors: results.errors,
        staff: staffData,
      },
    });
  } catch (err: any) {
    logger.error('Error populating employees:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to populate employees',
      },
      { status: 500 },
    );
  }
}
