/**
 * Update initial sync status in database.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { InitialSyncResult } from '../types';

/**
 * Update initial sync status to in-progress.
 */
export async function markInitialSyncStarted(userId: string, startedAt: string): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { error } = await supabaseAdmin
    .from('square_configurations')
    .update({
      initial_sync_status: 'in_progress',
      initial_sync_started_at: startedAt,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    logger.error('[Square Sync] Error marking initial sync started:', {
      error: error.message,
      userId,
      context: { operation: 'markInitialSyncStarted' },
    });
  }
}

/**
 * Update initial sync status to completed or failed.
 */
export async function markInitialSyncCompleted(
  result: InitialSyncResult,
  userId: string,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const completedAt = result.completedAt || new Date().toISOString();

  const { error } = await supabaseAdmin
    .from('square_configurations')
    .update({
      initial_sync_completed: result.success,
      initial_sync_completed_at: completedAt,
      initial_sync_status: result.success ? 'completed' : 'failed',
      initial_sync_error: result.errors > 0 ? result.errorMessages?.join('; ') : null,
      updated_at: completedAt,
    })
    .eq('user_id', userId);

  if (error) {
    logger.error('[Square Sync] Error marking initial sync completed:', {
      error: error.message,
      userId,
      success: result.success,
      context: { operation: 'markInitialSyncCompleted' },
    });
  }
}

/**
 * Update initial sync status to failed with error message.
 */
export async function markInitialSyncFailed(
  userId: string,
  errorMessage: string,
  completedAt: string,
): Promise<void> {
  if (!supabaseAdmin) {
    return;
  }

  const { error } = await supabaseAdmin
    .from('square_configurations')
    .update({
      initial_sync_completed: false,
      initial_sync_completed_at: completedAt,
      initial_sync_status: 'failed',
      initial_sync_error: errorMessage,
      updated_at: completedAt,
    })
    .eq('user_id', userId);

  if (error) {
    logger.error('[Square Sync] Error marking initial sync failed:', {
      error: error.message,
      userId,
      errorMessage,
      context: { operation: 'markInitialSyncFailed' },
    });
  }
}
