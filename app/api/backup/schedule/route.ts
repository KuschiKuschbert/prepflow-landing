/**
 * POST /api/backup/schedule - Configure scheduled backups
 * DELETE /api/backup/schedule - Cancel scheduled backups
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Configures scheduled backups.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} Schedule configuration response
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const body = await request.json();
    const { intervalHours, enabled, autoUploadToDrive } = body;

    // Validate interval
    if (intervalHours && (intervalHours < 1 || intervalHours > 8760)) {
      return NextResponse.json(
        { error: 'Interval must be between 1 and 8760 hours (1 year)' },
        { status: 400 },
      );
    }

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
      throw error;
    }

    logger.info(
      `[Backup Schedule] Scheduled backup configured for user ${userId}: ${intervalHours || 24} hours`,
    );

    return NextResponse.json({
      success: true,
      message: 'Scheduled backup configured successfully',
      nextBackupAt: enabled ? nextBackupAt.toISOString() : null,
    });
  } catch (error: any) {
    logger.error('[Backup Schedule] Error:', error);
    return NextResponse.json(
      { error: 'Failed to configure scheduled backup', message: error.message },
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const supabase = createSupabaseAdmin();

    const { error } = await supabase.from('backup_schedules').delete().eq('user_id', userId);

    if (error) {
      throw error;
    }

    logger.info(`[Backup Schedule] Scheduled backup cancelled for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'Scheduled backup cancelled successfully',
    });
  } catch (error: any) {
    logger.error('[Backup Schedule] Error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel scheduled backup', message: error.message },
      { status: 500 },
    );
  }
}
