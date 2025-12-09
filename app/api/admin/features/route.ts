import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { getFeatureFlags, setFeatureFlag } from '@/lib/feature-flags';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/features
 * Get all feature flags (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request);

    const flags = await getFeatureFlags();

    return NextResponse.json({
      success: true,
      flags,
    });
  } catch (error) {
    logger.error('Failed to fetch feature flags:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to fetch feature flags',
        'FETCH_ERROR',
        500,
        error instanceof Error ? error.message : undefined,
      ),
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/features
 * Initialize default feature flags if they don't exist
 */
export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    // Default flags to initialize
    const defaultFlags = [
      {
        flag_key: 'kitchen-staff',
        description:
          'Kitchen Staff management feature - Manage employee information, roles, and schedules. Controls visibility of the "Kitchen Staff" navigation item.',
        enabled: false,
      },
      {
        flag_key: 'roster',
        description:
          'Roster Builder feature - Create and manage staff rosters and schedules. Controls visibility of the "Roster" navigation item.',
        enabled: false,
      },
    ];

    const created: string[] = [];
    const existing: string[] = [];

    for (const flag of defaultFlags) {
      // Check if flag already exists
      const { data: existingFlag } = await supabaseAdmin
        .from('feature_flags')
        .select('flag_key')
        .eq('flag_key', flag.flag_key)
        .is('user_id', null)
        .single();

      if (existingFlag) {
        existing.push(flag.flag_key);
        continue;
      }

      // Create new flag
      const result = await setFeatureFlag(flag.flag_key, flag.enabled, undefined, flag.description);
      if (result) {
        created.push(flag.flag_key);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Initialized ${created.length} feature flag(s)`,
      created,
      existing,
    });
  } catch (error) {
    logger.error('Failed to initialize feature flags:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to initialize feature flags',
        'INIT_ERROR',
        500,
        error instanceof Error ? error.message : undefined,
      ),
      { status: 500 },
    );
  }
}
