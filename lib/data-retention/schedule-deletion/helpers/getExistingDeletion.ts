import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Get existing scheduled deletion date
 */
export async function getExistingScheduledDeletion(userEmail: string): Promise<Date | null> {
  if (!supabaseAdmin) {
    return null;
  }

  const { data: existingDeletion, error } = await supabaseAdmin
    .from('account_deletions')
    .select('scheduled_deletion_at')
    .eq('user_email', userEmail)
    .single();

  // PGRST116 is "not found" - that's okay, no scheduled deletion exists
  if (error && error.code !== 'PGRST116') {
    logger.error('[Data Retention] Error fetching scheduled deletion:', {
      error: error.message,
      userEmail,
      context: { operation: 'getExistingScheduledDeletion' },
    });
    return null;
  }

  return existingDeletion?.scheduled_deletion_at
    ? new Date(existingDeletion.scheduled_deletion_at)
    : null;
}
