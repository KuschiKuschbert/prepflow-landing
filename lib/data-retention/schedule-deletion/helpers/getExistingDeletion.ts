import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get existing scheduled deletion date
 */
export async function getExistingScheduledDeletion(
  userEmail: string,
): Promise<Date | null> {
  const { data: existingDeletion } = await supabaseAdmin
    .from('account_deletions')
    .select('scheduled_deletion_at')
    .eq('user_email', userEmail)
    .single();

  return existingDeletion?.scheduled_deletion_at
    ? new Date(existingDeletion.scheduled_deletion_at)
    : null;
}

