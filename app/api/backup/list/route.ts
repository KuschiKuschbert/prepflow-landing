/**
 * GET /api/backup/list
 * List user's backups.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { BackupFile } from '@/lib/backup/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const supabase = createSupabaseAdmin();

    // Get backup metadata from database
    const { data: backups, error } = await supabase
      .from('backup_metadata')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('[Backup List] Error fetching backups:', error);
      return NextResponse.json(
        { error: 'Failed to fetch backups', message: error.message },
        { status: 500 },
      );
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
      { error: 'Failed to list backups', message: error.message },
      { status: 500 },
    );
  }
}
