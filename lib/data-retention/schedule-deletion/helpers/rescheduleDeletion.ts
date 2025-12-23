import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { ScheduleDeletionParams } from '../types';

/**
 * Reschedule a cancelled deletion
 */
export async function rescheduleCancelledDeletion(
  existingId: number,
  params: ScheduleDeletionParams,
  requestedAt: Date,
  scheduledDeletionAt: Date,
): Promise<{ success: boolean; scheduledDeletionAt: Date | null; error?: string }> {
  const { error: updateError } = await supabaseAdmin
    .from('account_deletions')
    .update({
      status: 'scheduled',
      requested_at: requestedAt.toISOString(),
      scheduled_deletion_at: scheduledDeletionAt.toISOString(),
      cancelled_at: null,
      cancellation_reason: null,
      metadata: params.metadata || {},
    })
    .eq('id', existingId);

  if (updateError) {
    logger.error('[Data Retention] Failed to reschedule deletion:', {
      error: updateError.message,
      userEmail: params.userEmail,
    });
    return {
      success: false,
      scheduledDeletionAt: null,
      error: updateError.message,
    };
  }

  logger.info('[Data Retention] Deletion rescheduled:', {
    userEmail: params.userEmail,
    scheduledDeletionAt: scheduledDeletionAt.toISOString(),
  });

  return { success: true, scheduledDeletionAt };
}
