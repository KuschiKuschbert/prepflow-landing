/**
 * GET /api/backup/list
 * List user's backups.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth0-api-helpers';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import type { BackupFile } from '@/lib/backup/types';
/**
 * Lists user's backups.
 *
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} List of backup files response
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user?.email) {
      return NextResponse.json(ApiErrorHandler.createError('Unauthorized', 'UNAUTHORIZED', 401), {
        status: 401,
      });
    }

    const userId = user.email;
    const supabase = createSupabaseAdmin();

    // Get backup metadata from database
    const { data: backups, error } = await supabase
      .from('backup_metadata')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[Backup List] Error fetching backups:', error);
      return NextResponse.json(ApiErrorHandler.fromSupabaseError(error, 500), { status: 500 });
    }

    // Convert to BackupFile format
    const backupFiles: BackupFile[] = (backups || []).map(backup => ({
      id: backup.id,
      filename: `prepflow-backup-${new Date(backup.created_at).toISOString().split('T')[0]}.${backup.format === 'encrypted' ? 'pfbk' : backup.format}`,
      size: backup.file_size_bytes || 0,
      createdAt: backup.created_at,
      format: backup.format,
      encryptionMode: backup.encryption_mode || undefined,
      googleDriveFileId: backup.google_drive_file_id || undefined,
    }));

    return NextResponse.json({
      success: true,
      backups: backupFiles,
      count: backupFiles.length,
    });
  } catch (error: any) {
    logger.error('[Backup List] Error:', error);
    return NextResponse.json(
      ApiErrorHandler.createError(error?.message || 'Failed to list backups', 'SERVER_ERROR', 500),
      { status: 500 },
    );
  }
}
