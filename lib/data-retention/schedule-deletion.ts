/**
 * Data Retention - Schedule Deletion
 * Schedules account deletion 30 days after termination request
 */

import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { ScheduleDeletionParams } from './schedule-deletion/types';
import { rescheduleCancelledDeletion } from './schedule-deletion/helpers/rescheduleDeletion';
import { getExistingScheduledDeletion } from './schedule-deletion/helpers/getExistingDeletion';
import { createDeletionSchedule } from './schedule-deletion/helpers/createDeletionSchedule';
import { markDataExported as markDataExportedImpl } from './schedule-deletion/helpers/markDataExported';
import { cancelScheduledDeletion as cancelScheduledDeletionImpl } from './schedule-deletion/helpers/cancelDeletion';
import { getScheduledDeletionDate as getScheduledDeletionDateImpl } from './schedule-deletion/helpers/getDeletionDate';

export type { ScheduleDeletionParams };

/**
 * Schedule account deletion 30 days from now
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
    const scheduledDeletionAt = new Date(requestedAt.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data: existing } = await supabaseAdmin
      .from('account_deletions')
      .select('id, status')
      .eq('user_email', params.userEmail)
      .single();

    if (existing) {
      if (existing.status === 'cancelled') {
        return await rescheduleCancelledDeletion(
          existing.id,
          params,
          requestedAt,
          scheduledDeletionAt,
        );
      } else {
        const existingDate = await getExistingScheduledDeletion(params.userEmail);
        return {
          success: true,
          scheduledDeletionAt: existingDate || scheduledDeletionAt,
        };
      }
    }

    return await createDeletionSchedule(params, requestedAt, scheduledDeletionAt);
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

export { markDataExportedImpl as markDataExported };
export { cancelScheduledDeletionImpl as cancelScheduledDeletion };
export { getScheduledDeletionDateImpl as getScheduledDeletionDate };
