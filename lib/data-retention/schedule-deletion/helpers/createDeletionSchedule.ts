import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { ScheduleDeletionParams } from '../types';

/**
 * Create a new deletion schedule
 */
export async function createDeletionSchedule(
  params: ScheduleDeletionParams,
  requestedAt: Date,
  scheduledDeletionAt: Date,
): Promise<{ success: boolean; scheduledDeletionAt: Date | null; error?: string }> {
  const { data, error } = await supabaseAdmin
    .from('account_deletions')
    .insert({
      user_email: params.userEmail,
      requested_at: requestedAt.toISOString(),
      scheduled_deletion_at: scheduledDeletionAt.toISOString(),
      status: 'scheduled',
      metadata: params.metadata || {},
    })
    .select('scheduled_deletion_at')
    .single();

  if (error) {
    logger.error('[Data Retention] Failed to schedule deletion:', {
      error: error.message,
      userEmail: params.userEmail,
    });
    return { success: false, scheduledDeletionAt: null, error: error.message };
  }

  logger.info('[Data Retention] Account deletion scheduled:', {
    userEmail: params.userEmail,
    scheduledDeletionAt: scheduledDeletionAt.toISOString(),
    daysUntilDeletion: 30,
  });

  return {
    success: true,
    scheduledDeletionAt: data?.scheduled_deletion_at
      ? new Date(data.scheduled_deletion_at)
      : scheduledDeletionAt,
  };
}

