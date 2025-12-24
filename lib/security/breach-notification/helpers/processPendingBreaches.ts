/**
 * Process pending breach notifications.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { BreachNotificationData } from './sendBreachEmail';
import { notifyBreachAffectedUsers } from './notifyAffectedUsers';
import { updateBreachNotificationStatus } from './updateBreachStatus';

/**
 * Process all breaches that need notification (within 72-hour window)
 * This should be called periodically (e.g., via cron job)
 * @returns Processing results
 */
export async function processPendingBreachNotifications(): Promise<{
  processed: number;
  notified: number;
  failed: number;
}> {
  if (!supabaseAdmin) {
    logger.warn('[Breach Notification] Supabase not available, cannot process breaches');
    return { processed: 0, notified: 0, failed: 0 };
  }

  try {
    // Get breaches detected within last 72 hours that are still pending
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

    const { data: breaches, error } = await supabaseAdmin
      .from('security_breaches')
      .select('id, breach_type, description, affected_users, detected_at')
      .eq('status', 'pending')
      .gte('detected_at', seventyTwoHoursAgo)
      .order('detected_at', { ascending: true });

    if (error) {
      logger.error('[Breach Notification] Failed to get pending breaches:', {
        error: error.message,
      });
      return { processed: 0, notified: 0, failed: 0 };
    }

    if (!breaches || breaches.length === 0) {
      return { processed: 0, notified: 0, failed: 0 };
    }

    let totalNotified = 0;
    let totalFailed = 0;

    for (const breach of breaches) {
      const breachData: BreachNotificationData = {
        breachId: breach.id,
        breachType: breach.breach_type,
        description: breach.description,
        affectedUsers: breach.affected_users || [],
        detectedAt: breach.detected_at,
      };

      const notificationResults = await notifyBreachAffectedUsers(breachData);
      await updateBreachNotificationStatus(breach.id, notificationResults);

      totalNotified += notificationResults.notified;
      totalFailed += notificationResults.failed;
    }

    logger.info('[Breach Notification] Processed pending breaches:', {
      processed: breaches.length,
      notified: totalNotified,
      failed: totalFailed,
    });

    return {
      processed: breaches.length,
      notified: totalNotified,
      failed: totalFailed,
    };
  } catch (error) {
    logger.error('[Breach Notification] Unexpected error processing breaches:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return { processed: 0, notified: 0, failed: 0 };
  }
}
