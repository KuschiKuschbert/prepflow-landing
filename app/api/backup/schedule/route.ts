/**
 * POST /api/backup/schedule - Configure scheduled backups
 * DELETE /api/backup/schedule - Cancel scheduled backups
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { getAppError } from '@/lib/utils/error';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const scheduleBackupSchema = z.object({
  intervalHours: z.number().int().min(1).max(8760).optional(),
  enabled: z.boolean().optional(),
  autoUploadToDrive: z.boolean().optional(),
});

/**
 * Configures scheduled backups.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Schedule configuration response
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const userId = user.email;
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Backup Schedule] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = scheduleBackupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        ApiErrorHandler.createError(
          validationResult.error.issues[0]?.message || 'Invalid request body',
          'VALIDATION_ERROR',
          400,
        ),
        { status: 400 },
      );
    }

    const { intervalHours, enabled, autoUploadToDrive } = validationResult.data;

    const supabase = createSupabaseAdmin();

    // Calculate next backup time
    const now = new Date();
    const nextBackupAt = new Date(now.getTime() + (intervalHours || 24) * 60 * 60 * 1000);

    const { error } = await supabase.from('backup_schedules').upsert(
      {
        user_id: userId,
        interval_hours: intervalHours || 24,
        enabled: enabled !== undefined ? enabled : true,
        auto_upload_to_drive: autoUploadToDrive !== undefined ? autoUploadToDrive : false,
        next_backup_at: enabled ? nextBackupAt.toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      },
    );

    if (error) {
      logger.error('[Backup Schedule] Database error configuring schedule:', {
        error: error.message,
        code: error.code,
        userId,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    logger.info(
      `[Backup Schedule] Scheduled backup configured for user ${userId}: ${intervalHours || 24} hours`,
    );

    return NextResponse.json({
      success: true,
      message: 'Scheduled backup configured successfully',
      nextBackupAt: enabled ? nextBackupAt.toISOString() : null,
    });
  } catch (error: unknown) {
    const appError = getAppError(error);
    logger.error('[Backup Schedule] Error:', {
      error: appError.message,
      code: appError.code,
      originalError: appError.originalError,
    });
    return NextResponse.json(
      { error: 'Failed to configure scheduled backup', message: appError.message },
      { status: 500 },
    );
  }
}

/**
 * Cancels scheduled backups.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Cancellation response
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const userId = user.email;
    const supabase = createSupabaseAdmin();

    const { error } = await supabase.from('backup_schedules').delete().eq('user_id', userId);

    if (error) {
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    logger.info(`[Backup Schedule] Scheduled backup cancelled for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Scheduled backup cancelled successfully',
    });
  } catch (error: unknown) {
    const appError = getAppError(error);
    logger.error('[Backup Schedule] Error:', {
      error: appError.message,
      code: appError.code,
      originalError: appError.originalError,
    });
    return NextResponse.json(
      { error: 'Failed to cancel scheduled backup', message: appError.message },
      { status: 500 },
    );
  }
}
