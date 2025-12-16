/**
 * Scheduled backup system - runs automatic backups at configured intervals.
 */

import { createSupabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { exportUserData } from './export';
import { encryptBackup } from './encryption';
import { authenticateGoogleDrive, uploadBackupToDrive } from './google-drive';
import type { BackupSchedule } from './types';

/**
 * Run scheduled backups for all users with enabled schedules.
 * This should be called by a cron job or scheduled task.
 *
 * @returns {Promise<void>}
 */
export async function runScheduledBackups(): Promise<void> {
  const supabase = createSupabaseAdmin();
  const now = new Date();

  // Get all enabled schedules where next_backup_at is in the past
  const { data: schedules, error } = await supabase
    .from('backup_schedules')
    .select('*')
    .eq('enabled', true)
    .lte('next_backup_at', now.toISOString());

  if (error) {
    logger.error('[Backup Scheduler] Error fetching schedules:', error);
    return;
  }

  if (!schedules || schedules.length === 0) {
    logger.dev('[Backup Scheduler] No scheduled backups to run');
    return;
  }

  logger.info(`[Backup Scheduler] Running ${schedules.length} scheduled backup(s)`);

  for (const schedule of schedules) {
    try {
      // Map database fields (snake_case) to interface (camelCase)
      const mappedSchedule: BackupSchedule = {
        userId: schedule.user_id,
        intervalHours: schedule.interval_hours,
        lastBackupAt: schedule.last_backup_at || undefined,
        nextBackupAt: schedule.next_backup_at || undefined,
        enabled: schedule.enabled,
        autoUploadToDrive: schedule.auto_upload_to_drive,
      };
      await runUserScheduledBackup(mappedSchedule);
    } catch (error: any) {
      logger.error(`[Backup Scheduler] Failed to run backup for user ${schedule.user_id}:`, error);
    }
  }
}

/**
 * Run scheduled backup for a single user.
 *
 * @param {BackupSchedule} schedule - Backup schedule
 * @returns {Promise<void>}
 */
async function runUserScheduledBackup(schedule: BackupSchedule): Promise<void> {
  const supabase = createSupabaseAdmin();
  const userId = schedule.userId;

  logger.info(`[Backup Scheduler] Running scheduled backup for user ${userId}`);

  try {
    // Export user data
    const backupData = await exportUserData(userId);

    // Encrypt backup (use PrepFlow-only mode for scheduled backups)
    const encrypted = await encryptBackup(backupData, {
      mode: 'prepflow-only',
    });

    let googleDriveFileId: string | undefined;

    // Upload to Google Drive if enabled
    if (schedule.autoUploadToDrive) {
      try {
        const client = await authenticateGoogleDrive(userId);
        googleDriveFileId = await uploadBackupToDrive(client, encrypted, userId);
        logger.info(`[Backup Scheduler] Uploaded backup to Google Drive for user ${userId}`);
      } catch (error: any) {
        logger.warn(
          `[Backup Scheduler] Failed to upload to Google Drive for user ${userId}:`,
          error,
        );
        // Continue even if Drive upload fails
      }
    }

    // Store metadata
    await supabase.from('backup_metadata').insert({
      user_id: userId,
      backup_type: 'scheduled',
      format: 'encrypted',
      encryption_mode: 'prepflow-only',
      file_size_bytes: encrypted.size,
      record_count: Object.values(backupData.metadata.recordCounts).reduce((a, b) => a + b, 0),
      google_drive_file_id: googleDriveFileId,
      created_at: new Date().toISOString(),
    });

    // Update schedule with last backup time and next backup time
    const nextBackupAt = new Date(Date.now() + schedule.intervalHours * 60 * 60 * 1000);

    await supabase
      .from('backup_schedules')
      .update({
        last_backup_at: new Date().toISOString(),
        next_backup_at: nextBackupAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    logger.info(
      `[Backup Scheduler] Scheduled backup completed for user ${userId}, next backup: ${nextBackupAt.toISOString()}`,
    );
  } catch (error: any) {
    logger.error(`[Backup Scheduler] Error running backup for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Schedule backup for a user.
 *
 * @param {string} userId - User ID (email)
 * @param {number} intervalHours - Backup interval in hours
 * @param {boolean} enabled - Whether backup is enabled
 * @param {boolean} autoUploadToDrive - Whether to auto-upload to Google Drive
 * @returns {Promise<void>}
 */
export async function scheduleBackup(
  userId: string,
  intervalHours: number,
  enabled: boolean = true,
  autoUploadToDrive: boolean = false,
): Promise<void> {
  const supabase = createSupabaseAdmin();

  const nextBackupAt = enabled ? new Date(Date.now() + intervalHours * 60 * 60 * 1000) : null;

  const { error } = await supabase.from('backup_schedules').upsert(
    {
      user_id: userId,
      interval_hours: intervalHours,
      enabled,
      auto_upload_to_drive: autoUploadToDrive,
      next_backup_at: nextBackupAt?.toISOString() || null,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    },
  );

  if (error) {
    throw new Error(`Failed to schedule backup: ${error.message}`);
  }
}

/**
 * Cancel scheduled backup for a user.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<void>}
 */
export async function cancelScheduledBackup(userId: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from('backup_schedules').delete().eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to cancel scheduled backup: ${error.message}`);
  }
}
