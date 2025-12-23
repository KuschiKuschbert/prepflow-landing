import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get scheduled deletion date for a user
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

