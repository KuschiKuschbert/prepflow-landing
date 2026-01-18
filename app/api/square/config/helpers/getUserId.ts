import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Get user ID from email address
 *
 * @param {string} email - User email address
 * @param {SupabaseClient} supabase - Supabase client
 * @returns {Promise<string | null>} User ID or null if not found
 */
export async function getUserIdFromEmail(
  email: string,
  supabase: SupabaseClient,
): Promise<string | null> {
  try {
    const { data, error } = await supabase.from('users').select('id').eq('email', email).single();
    if (error) {
      logger.error('[Square Config API] Error fetching user ID from email:', {
        error: error.message,
        email,
        context: { endpoint: '/api/square/config', operation: 'getUserIdFromEmail' },
      });
      return null;
    }
    return data?.id || null;
  } catch (err) {
    logger.error('[Square Config API] Unexpected error fetching user ID:', {
      error: err instanceof Error ? err.message : String(err),
      email,
      context: { endpoint: '/api/square/config', operation: 'getUserIdFromEmail' },
    });
    return null;
  }
}
