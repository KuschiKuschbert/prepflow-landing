/**
 * Clean up expired notifications.
 */
import { logger } from '../../logger';
import { supabaseAdmin } from '../../supabase';

/**
 * Clean up expired notifications.
 * Should be called periodically (e.g., via cron job or background task).
 */
export async function cleanupExpiredNotifications(): Promise<number> {
  if (!supabaseAdmin) {
    logger.warn(
      '[Subscription Notifications] Supabase not available, cannot cleanup notifications',
    );
    return 0;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_notifications')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      logger.error('[Subscription Notifications] Failed to cleanup expired notifications:', {
        error: error.message,
      });
      return 0;
    }

    const count = data?.length || 0;
    if (count > 0) {
      logger.dev('[Subscription Notifications] Cleaned up expired notifications:', { count });
    }

    return count;
  } catch (error) {
    logger.error('[Subscription Notifications] Unexpected error cleaning up notifications:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
}



