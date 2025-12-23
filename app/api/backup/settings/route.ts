/**
 * GET /api/backup/settings - Get backup settings
 * PUT /api/backup/settings - Update backup settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { BackupSettings } from '@/lib/backup/types';
import { z } from 'zod';

const updateBackupSettingsSchema = z.object({
  defaultFormat: z.enum(['json', 'sql', 'encrypted']).optional(),
  defaultEncryptionMode: z.enum(['prepflow-only', 'user-password', 'system-key']).optional(),
  scheduledBackupEnabled: z.boolean().optional(),
  scheduledBackupInterval: z.number().int().min(1).max(8760).optional(),
  autoUploadToDrive: z.boolean().optional(),
});

/**
 * Gets backup settings for the current user.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Backup settings response
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), { status: 401 });
    }

    const userId = user.email;
    const supabase = createSupabaseAdmin();

    // Get backup schedule (which contains settings)
    const { data: schedule } = await supabase
      .from('backup_schedules')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Default settings
    const settings: BackupSettings = {
      userId,
      defaultFormat: 'encrypted',
      defaultEncryptionMode: 'prepflow-only',
      scheduledBackupEnabled: schedule?.enabled || false,
      scheduledBackupInterval: schedule?.interval_hours || 24,
      autoUploadToDrive: schedule?.auto_upload_to_drive || false,
    };

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error: any) {
    logger.error('[Backup Settings] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get backup settings', message: error.message },
      { status: 500 },
    );
  }
}

/**
 * Updates backup settings for the current user.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Update response
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), { status: 401 });
    }

    const userId = user.email;
    let body: unknown;
    try {
      body = await request.json();
    } catch (err) {
      logger.warn('[Backup Settings] Failed to parse request body:', {
        error: err instanceof Error ? err.message : String(err),
      });
      return NextResponse.json(
        ApiErrorHandler.createError('Invalid request body', 'VALIDATION_ERROR', 400),
        { status: 400 },
      );
    }

    const validationResult = updateBackupSettingsSchema.safeParse(body);
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

    const {
      defaultFormat,
      defaultEncryptionMode,
      scheduledBackupEnabled,
      scheduledBackupInterval,
      autoUploadToDrive,
    } = validationResult.data;

    const supabase = createSupabaseAdmin();

    // Update or create backup schedule
    const { error } = await supabase.from('backup_schedules').upsert(
      {
        user_id: userId,
        enabled: scheduledBackupEnabled !== undefined ? scheduledBackupEnabled : true,
        interval_hours: scheduledBackupInterval || 24,
        auto_upload_to_drive: autoUploadToDrive !== undefined ? autoUploadToDrive : false,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      },
    );

    if (error) {
      logger.error('[Backup Settings] Database error updating schedule:', {
        error: error.message,
        code: (error as any).code,
        userId,
      });
      throw ApiErrorHandler.fromSupabaseError(error, 500);
    }

    // Note: defaultFormat and defaultEncryptionMode are client-side preferences
    // They can be stored in localStorage or a separate user_preferences table

    return NextResponse.json({
      success: true,
      message: 'Backup settings updated successfully',
    });
  } catch (error: any) {
    logger.error('[Backup Settings] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update backup settings', message: error.message },
      { status: 500 },
    );
  }
}
