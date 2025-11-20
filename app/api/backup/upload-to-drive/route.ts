/**
 * POST /api/backup/upload-to-drive
 * Upload backup file to Google Drive.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { authenticateGoogleDrive, uploadBackupToDrive } from '@/lib/backup/google-drive';
import { exportUserData } from '@/lib/backup/export';
import { encryptBackup } from '@/lib/backup/encryption';
import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { EncryptionMode } from '@/lib/backup/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.email;
    const body = await request.json();
    const encryptionMode: EncryptionMode = body.encryptionMode || 'prepflow-only';
    const password: string | undefined = body.password;

    // Authenticate Google Drive
    const client = await authenticateGoogleDrive(userId);

    // Export user data
    const backupData = await exportUserData(userId);

    // Encrypt backup
    const encrypted = await encryptBackup(backupData, {
      mode: encryptionMode,
      password,
    });

    // Upload to Google Drive
    const fileId = await uploadBackupToDrive(client, encrypted, userId);

    // Store metadata in database
    const supabase = createSupabaseAdmin();
    await supabase.from('backup_metadata').insert({
      user_id: userId,
      backup_type: 'manual',
      format: 'encrypted',
      encryption_mode: encryptionMode,
      file_size_bytes: encrypted.size,
      record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
      google_drive_file_id: fileId,
      created_at: new Date().toISOString(),
    });

    logger.info(`[Google Drive Upload] Successfully uploaded backup to Drive, file ID: ${fileId}`);

    return NextResponse.json({
      success: true,
      message: 'Backup uploaded to Google Drive successfully',
      fileId,
      filename: encrypted.filename,
    });
  } catch (error: any) {
    logger.error('[Google Drive Upload] Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload backup to Google Drive', message: error.message },
      { status: 500 },
    );
  }
}
