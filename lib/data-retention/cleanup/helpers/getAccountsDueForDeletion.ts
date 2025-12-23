import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get list of accounts due for deletion (scheduled_deletion_at <= now)
 */
export async function getAccountsDueForDeletion(): Promise<
  Array<{ user_email: string; scheduled_deletion_at: string; exported_at: string | null }>
> {
  if (!supabaseAdmin) {
    logger.warn('[Data Retention Cleanup] Supabase not available');
    return [];
  }

  try {
    const now = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from('account_deletions')
      .select('user_email, scheduled_deletion_at, exported_at')
      .in('status', ['scheduled', 'exported'])
      .lte('scheduled_deletion_at', now)
      .order('scheduled_deletion_at', { ascending: true });

    if (error) {
      logger.error('[Data Retention Cleanup] Failed to get accounts due for deletion:', {
        error: error.message,
      });
      return [];
    }

    return data || [];
  } catch (error) {
    logger.error('[Data Retention Cleanup] Unexpected error getting accounts:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
