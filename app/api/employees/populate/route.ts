import { standardAdminChecks } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { populateStaff } from '@/lib/populate-helpers';
import { NextRequest, NextResponse } from 'next/server';

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

    const { supabase, error } = await standardAdminChecks(request);
    if (error) return error;
    if (!supabase) return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });

    const results = {
      cleaned: 0,
      populated: [] as Array<{ table: string; count: number }>,
      errors: [] as Array<{ table: string; error: string }>,
    };

    logger.dev('👥 Populating staff members...');
    const staffData = await populateStaff(supabase, results);

    return NextResponse.json({
      success: true,
      message: `Successfully populated ${results.populated[0]?.count || 0} staff members`,
      data: {
        populated: results.populated,
        errors: results.errors,
        staff: staffData,
      },
    });
  } catch (err) {
    logger.error('Error populating employees:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
