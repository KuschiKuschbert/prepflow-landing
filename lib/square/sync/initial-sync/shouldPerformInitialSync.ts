/**
 * Check if initial sync should be performed.
 */
import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Check if initial sync should be performed
 * Returns true if no mappings exist for the user (first connection)
 */
export async function shouldPerformInitialSync(userId: string): Promise<boolean> {
  try {
    if (!supabaseAdmin) {
      return false;
    }

    // Check if any mappings exist for this user
    const { data, error } = await supabaseAdmin
      .from('square_mappings')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is what we want for initial sync
      logger.error('[Square Initial Sync] Error checking for existing mappings:', {
        error: error.message,
        userId,
      });
      return false;
    }

    // If no mappings exist, initial sync should be performed
    return !data;
  } catch (error: any) {
    logger.error('[Square Initial Sync] Unexpected error checking initial sync status:', {
      error: error.message,
      userId,
    });
    return false;
  }
}



