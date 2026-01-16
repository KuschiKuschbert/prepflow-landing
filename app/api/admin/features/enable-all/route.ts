import { logAdminApiAction } from '@/lib/admin-audit';
import { requireAdmin } from '@/lib/admin-auth';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const enableAllSchema = z.object({
  email: z.string().email(),
});

/**
 * POST /api/admin/features/enable-all
 * Enable all feature flags for a specific email address
 */
export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const validated = enableAllSchema.parse(body);

    // Get all existing feature flags
    const { data: allFlags, error: fetchError } = await supabaseAdmin
      .from('feature_flags')
      .select('flag_key')
      .is('user_id', null); // Only get global flags

    if (fetchError) {
      logger.error('[Admin Features API] Error fetching flags:', {
        error: fetchError.message,
        context: { endpoint: '/api/admin/features/enable-all', method: 'POST' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(fetchError, 500), { status: 500 });
    }

    // Get user ID from email (if user exists)
    const { data: userData, error: userDataError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single();

    if (userDataError && userDataError.code !== 'PGRST116') {
      logger.warn('[Admin Features Enable All] Error fetching user:', {
        error: userDataError.message,
        code: userDataError.code,
        email: validated.email,
      });
    }

    const userId = userData?.id || null;

    // Enable all flags for this user
    const flagsToEnable = allFlags || [];
    const enabledFlags: Array<{ flag_key: string; enabled: boolean }> = [];

    for (const flag of flagsToEnable) {
      const { data: flagData, error: upsertError } = await supabaseAdmin
        .from('feature_flags')
        .upsert(
          {
            flag_key: flag.flag_key,
            enabled: true,
            user_id: userId,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'flag_key,user_id',
          },
        )
        .select()
        .single();

      if (upsertError) {
        logger.warn('[Admin Features API] Error enabling flag:', {
          flag_key: flag.flag_key,
          error: upsertError.message,
        });
      } else if (flagData) {
        enabledFlags.push({ flag_key: flag.flag_key, enabled: true });
      }
    }

    // Log admin action
    await logAdminApiAction(adminUser, 'enable_all_features', request, {
      target_type: 'user',
      target_id: userId || validated.email,
      details: {
        email: validated.email,
        flags_enabled: enabledFlags.length,
        flags: enabledFlags.map(f => f.flag_key),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Enabled ${enabledFlags.length} feature flags for ${validated.email}`,
      email: validated.email,
      userId,
      flagsEnabled: enabledFlags.length,
      flags: enabledFlags,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('[Admin Features Enable All] Validation error:', {
        errors: error.issues,
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request data', 'VALIDATION_ERROR', 400, error.issues),
        { status: 400 },
      );
    }

    logger.error('[Admin Features API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/features/enable-all', method: 'POST' },
    });

    return NextResponse.json(
      ApiErrorHandler.createError(
        'Failed to enable all features',
        'INTERNAL_ERROR',
        500,
        error instanceof Error ? error.stack : undefined,
      ),
      { status: 500 },
    );
  }
}
