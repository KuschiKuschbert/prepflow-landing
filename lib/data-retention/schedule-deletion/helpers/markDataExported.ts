import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Mark that user has exported their data
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
      .in('status', ['scheduled', 'exported']);

    if (error) {
      logger.error('[Data Retention] Failed to mark data exported:', {
        error: error.message,
        userEmail,
      });
      return false;
    }

    logger.info('[Data Retention] Data export marked:', { userEmail });
    return true;
  } catch (error) {
    logger.error('[Data Retention] Unexpected error marking exported:', {
      error: error instanceof Error ? error.message : String(error),
      userEmail,
    });
    return false;
  }
}
