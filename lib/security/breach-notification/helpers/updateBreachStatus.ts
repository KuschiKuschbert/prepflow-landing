/**
 * Update breach notification status.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update breach status after notification
 * @param breachId - Breach ID
 * @param notificationResults - Notification results
 * @returns Success status
 */
export async function updateBreachNotificationStatus(
  breachId: string,
  notificationResults: {
    notified: number;
    failed: number;
  },
): Promise<boolean> {
  if (!supabaseAdmin) {
    logger.error('[Breach Notification] Supabase not available, cannot update status');
    return false;
  }

  try {
    const status = notificationResults.failed === 0 ? 'notified' : 'failed';
    const notificationSentAt = new Date().toISOString();
    const notificationFailureReason =
      notificationResults.failed > 0
        ? `Failed to notify ${notificationResults.failed} of ${notificationResults.notified + notificationResults.failed} users`
        : null;

    const { error } = await supabaseAdmin
      .from('security_breaches')
      .update({
        status,
        notification_sent_at: notificationSentAt,
        notification_failed_at: notificationResults.failed > 0 ? notificationSentAt : null,
        notification_failure_reason: notificationFailureReason,
        reported_at: notificationSentAt,
      })
      .eq('id', breachId);

    if (error) {
      logger.error('[Breach Notification] Failed to update breach status:', {
        error: error.message,
        breachId,
      });
      return false;
    }

    logger.info('[Breach Notification] Breach status updated:', {
      breachId,
      status,
      notified: notificationResults.notified,
      failed: notificationResults.failed,
    });

    return true;
  } catch (error) {
    logger.error('[Breach Notification] Unexpected error updating status:', {
      error: error instanceof Error ? error.message : String(error),
      breachId,
    });
    return false;
  }
}
