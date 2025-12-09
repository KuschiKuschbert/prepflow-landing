import { requireAdmin } from '@/lib/admin-auth';
import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { logAdminApiAction } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const updateFlagSchema = z.object({
  enabled: z.boolean(),
  user_id: z.string().uuid().optional().nullable(),
});

/**
 * PUT /api/admin/features/[flag]
 * Update a feature flag
 */
export async function PUT(request: NextRequest, context: { params: Promise<{ flag: string }> }) {
  try {
    const adminUser = await requireAdmin(request);
    const { flag } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json();
    const validated = updateFlagSchema.parse(body);

    let query = supabaseAdmin
      .from('feature_flags')
      .update({
        enabled: validated.enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('flag_key', flag);

    if (validated.user_id !== undefined) {
      query = query.eq('user_id', validated.user_id);
    } else {
      query = query.is('user_id', null);
    }

    const { data: flagData, error } = await query.select().single();

    if (error) {
      logger.error('[Admin Features API] Database error updating flag:', {
        error: error.message,
        context: { endpoint: `/api/admin/features/${flag}`, method: 'PUT' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    // Log admin action
    await logAdminApiAction(adminUser, 'update_feature_flag', request, {
      target_type: 'feature_flag',
      target_id: flagData.id,
      details: { flag_key: flag, enabled: validated.enabled },
    });

    return NextResponse.json({
      success: true,
      flag: flagData,
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request data', 'VALIDATION_ERROR', 400, error.issues),
        { status: 400 },
      );
    }

    logger.error('[Admin Features API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/features/[flag]', method: 'PUT' },
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

/**
 * DELETE /api/admin/features/[flag]
 * Delete a feature flag
 */
export async function DELETE(request: NextRequest, context: { params: Promise<{ flag: string }> }) {
  try {
    const adminUser = await requireAdmin(request);
    const { flag } = await context.params;

    if (!supabaseAdmin) {
      return NextResponse.json(
        ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
        { status: 500 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const userId = (body as any).user_id || null;

    let query = supabaseAdmin.from('feature_flags').delete().eq('flag_key', flag);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { error } = await query;

    if (error) {
      logger.error('[Admin Features API] Database error deleting flag:', {
        error: error.message,
        context: { endpoint: `/api/admin/features/${flag}`, method: 'DELETE' },
      });

      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    // Log admin action
    await logAdminApiAction(adminUser, 'delete_feature_flag', request, {
      target_type: 'feature_flag',
      target_id: flag,
      details: { flag_key: flag },
    });

    return NextResponse.json({
      success: true,
      message: 'Feature flag deleted successfully',
    });
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }

    logger.error('[Admin Features API] Unexpected error:', {
      error: error instanceof Error ? error.message : String(error),
      context: { endpoint: '/api/admin/features/[flag]', method: 'DELETE' },
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
