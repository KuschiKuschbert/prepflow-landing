import { supabaseAdmin } from '@/lib/supabase';
import { logger } from '@/lib/logger';

/**
 * Get user ID from email address
 *
 * @param {string} email - User email address
 * @returns {Promise<string | null>} User ID or null if not found
 */
export async function getUserIdFromEmail(email: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  try {
    const { data, error } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
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
