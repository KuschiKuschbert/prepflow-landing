import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Cancel scheduled deletion
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
      .in('status', ['scheduled', 'exported']);

    if (error) {
      logger.error('[Data Retention] Failed to cancel deletion:', {
        error: error.message,
        userEmail,
      });
      return false;
    }

    logger.info('[Data Retention] Deletion cancelled:', { userEmail, reason });
    return true;
  } catch (error) {
    logger.error('[Data Retention] Unexpected error cancelling deletion:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}

