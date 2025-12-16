/**
 * Data Retention - Schedule Deletion
 * Schedules account deletion 30 days after termination request
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export interface ScheduleDeletionParams {
  userEmail: string;
  requestedAt?: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Schedule account deletion 30 days from now
 * @param params - Deletion scheduling parameters
 * @returns Success status and scheduled deletion date
 */
export async function scheduleAccountDeletion(
  params: ScheduleDeletionParams,
): Promise<{ success: boolean; scheduledDeletionAt: Date | null; error?: string }> {
  if (!supabaseAdmin) {
    logger.error('[Data Retention] Supabase not available, cannot schedule deletion');
    return { success: false, scheduledDeletionAt: null, error: 'Database not available' };
  }

  try {
    const requestedAt = params.requestedAt || new Date();
    const scheduledDeletionAt = new Date(requestedAt.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Check if deletion already scheduled
    const { data: existing } = await supabaseAdmin
      .from('account_deletions')
      .select('id, status')
      .eq('user_email', params.userEmail)
      .single();

    if (existing) {
      if (existing.status === 'cancelled') {
        // Update cancelled deletion to reschedule
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
          .eq('id', existing.id);

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
      } else {
        // Already scheduled, return existing date
        const { data: existingDeletion } = await supabaseAdmin
          .from('account_deletions')
          .select('scheduled_deletion_at')
          .eq('user_email', params.userEmail)
          .single();

        return {
          success: true,
          scheduledDeletionAt: existingDeletion?.scheduled_deletion_at
            ? new Date(existingDeletion.scheduled_deletion_at)
            : scheduledDeletionAt,
        };
      }
    }

    // Create new deletion schedule
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
  } catch (error) {
    logger.error('[Data Retention] Unexpected error scheduling deletion:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail: params.userEmail,
    });
    return {
      success: false,
      scheduledDeletionAt: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Mark that user has exported their data
 * @param userEmail - User email
 * @returns Success status
 */
export async function markDataExported(userEmail: string): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.error('[Data Retention] Supabase not available, cannot mark exported');
    return false;
  }

  try {
    const { error } = await supabaseAdmin
      .from('account_deletions')
      .update({
        exported_at: new Date().toISOString(),
        status: 'exported',
      })
      .eq('user_email', userEmail)
      .in('status', ['scheduled', 'exported']); // Only update if scheduled or already exported

    if (error) {
      logger.error('[Data Retention] Failed to mark data exported:', {
        error: error.message,
        userEmail,
      });
      return false;
    }

    logger.info('[Data Retention] Data export marked:', {
      userEmail,
    });

    return true;
  } catch (error) {
    logger.error('[Data Retention] Unexpected error marking exported:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}

/**
 * Cancel scheduled deletion
 * @param userEmail - User email
 * @param reason - Cancellation reason
 * @returns Success status
 */
export async function cancelScheduledDeletion(
  userEmail: string,
  reason?: string,
): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.error('[Data Retention] Supabase not available, cannot cancel deletion');
    return false;
  }

  try {
    const { error } = await supabaseAdmin
      .from('account_deletions')
      .update({
        status: 'cancelled',
        cancellation_reason: reason || 'User reactivated account',
        cancelled_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail)
      .in('status', ['scheduled', 'exported']); // Only cancel if scheduled or exported

    if (error) {
      logger.error('[Data Retention] Failed to cancel deletion:', {
        error: error.message,
        userEmail,
      });
      return false;
    }

    logger.info('[Data Retention] Deletion cancelled:', {
      userEmail,
      reason,
    });

    return true;
  } catch (error) {
    logger.error('[Data Retention] Unexpected error cancelling deletion:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}

/**
 * Get scheduled deletion date for a user
 * @param userEmail - User email
 * @returns Scheduled deletion date or null
 */
export async function getScheduledDeletionDate(userEmail: string): Promise<Date | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('account_deletions')
      .select('scheduled_deletion_at, status')
      .eq('user_email', userEmail)
      .in('status', ['scheduled', 'exported'])
      .single();

    if (error || !data) {
      return null;
    }

    return data.scheduled_deletion_at ? new Date(data.scheduled_deletion_at) : null;
  } catch (error) {
    logger.error('[Data Retention] Error getting scheduled deletion:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return null;
  }
}




