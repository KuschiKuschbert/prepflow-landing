/**
 * Scheduled backup system - runs automatic backups at configured intervals.
 */
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { runUserScheduledBackup } from './scheduler/helpers/runUserScheduledBackup';
import type { BackupSchedule } from './types';

/** Run scheduled backups for all users with enabled schedules. */
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`[Backup Scheduler] Failed to run backup for user ${schedule.user_id}:`, {
        error: errorMessage,
      });
    }
  }
}

/** Schedule backup for a user. */
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
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }
}

/** Cancel scheduled backup for a user. */
export async function cancelScheduledBackup(userId: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from('backup_schedules').delete().eq('user_id', userId);

  if (error) {
    throw ApiErrorHandler.createError('Database error', 'DATABASE_ERROR', 500);
  }
}
