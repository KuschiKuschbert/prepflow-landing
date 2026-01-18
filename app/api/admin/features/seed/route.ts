import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { setFeatureFlag } from '@/lib/feature-flags';
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/features/seed
 * Seed initial feature flags (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const initialFlags = [
      {
        flag_key: 'square_pos_integration',
        enabled: false,
        description:
          'Square POS integration - bidirectional sync of menu items, staff, sales data, and food costs',
      },
      {
        flag_key: 'kitchen-staff',
        enabled: true,
        description: 'Kitchen staff management features',
      },
      {
        flag_key: 'roster',
        enabled: true,
        description: 'Roster and scheduling features',
      },
    ];

    const results = await Promise.all(initialFlags.map(seedSingleFlag));

    return NextResponse.json({
      success: true,
      message: 'Feature flags seeded',
      results,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Seed Features] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/features/seed', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        process.env.NODE_ENV === 'development'
          ? error instanceof Error
            ? error.message
            : 'Unknown error'
          : 'Internal server error',
        'SERVER_ERROR',
        500,
      ),
      { status: 500 },
    );
  }
}

async function seedSingleFlag(flag: { flag_key: string; enabled: boolean; description: string }) {
  try {
    const result = await setFeatureFlag(flag.flag_key, flag.enabled, undefined, flag.description);
    return {
      flag_key: flag.flag_key,
      success: !!result,
      result,
    };
  } catch (error) {
    logger.error('[Seed Features] Error seeding flag:', {
      flag_key: flag.flag_key,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      flag_key: flag.flag_key,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
