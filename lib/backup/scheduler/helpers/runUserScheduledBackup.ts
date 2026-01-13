import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { encryptBackup } from '../../encryption';
import { exportUserData } from '../../export';
import { authenticateGoogleDrive, uploadBackupToDrive } from '../../google-drive';
import type { BackupSchedule } from '../../types';

import { getAppError } from '@/lib/utils/error';

/**
 * Run scheduled backup for a single user
 */
export async function runUserScheduledBackup(schedule: BackupSchedule): Promise<void> {
  const supabase = createSupabaseAdmin();
  const userId = schedule.userId;

  logger.info(`[Backup Scheduler] Running scheduled backup for user ${userId}`);

  try {
    const backupData = await exportUserData(userId);
    const encrypted = await encryptBackup(backupData, {
      mode: 'prepflow-only',
    });

    let googleDriveFileId: string | undefined;

    if (schedule.autoUploadToDrive) {
      try {
        const client = await authenticateGoogleDrive(userId);
        googleDriveFileId = await uploadBackupToDrive(client, encrypted, userId);
        logger.info(`[Backup Scheduler] Uploaded backup to Google Drive for user ${userId}`);
      } catch (error: unknown) {
        const appError = getAppError(error);
        logger.warn(
          `[Backup Scheduler] Failed to upload to Google Drive for user ${userId}:`,
          appError,
        );
      }
    }

    const { error: metadataError } = await supabase.from('backup_metadata').insert({
      user_id: userId,
      backup_type: 'scheduled',
      format: 'encrypted',
      encryption_mode: 'prepflow-only',
      file_size_bytes: encrypted.size,
      record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
      google_drive_file_id: googleDriveFileId,
      created_at: new Date().toISOString(),
    });

    if (metadataError) {
      logger.error('[Backup Scheduler] Error storing backup metadata:', {
        error: metadataError.message,
        code: metadataError.code,
        userId,
      });
    }

    const nextBackupAt = new Date(Date.now() + schedule.intervalHours * 60 * 60 * 1000);

    const { error: scheduleError } = await supabase
      .from('backup_schedules')
      .update({
        last_backup_at: new Date().toISOString(),
        next_backup_at: nextBackupAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (scheduleError) {
      logger.error('[Backup Scheduler] Error updating backup schedule:', {
        error: scheduleError.message,
        code: scheduleError.code,
        userId,
      });
    }

    logger.info(
      `[Backup Scheduler] Scheduled backup completed for user ${userId}, next backup: ${nextBackupAt.toISOString()}`,
    );
  } catch (error: unknown) {
    const appError = getAppError(error);
    logger.error(`[Backup Scheduler] Error running backup for user ${userId}:`, appError);
    throw error;
  }
}
