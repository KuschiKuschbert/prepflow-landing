/**
 * GET /api/backup/settings - Get backup settings
 * PUT /api/backup/settings - Update backup settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BackupSettings } from '@/lib/backup/types';

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.email;
    const body = await request.json();
    const {
      defaultFormat,
      defaultEncryptionMode,
      scheduledBackupEnabled,
      scheduledBackupInterval,
      autoUploadToDrive,
    } = body;

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
      throw error;
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
