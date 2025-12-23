import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

/**
 * Get user ID from request for error association
 *
 * @param {NextRequest} request - Request object
 * @returns {Promise<string | null>} User ID or null if not found
 */
export async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.email) {
      return null;
    }

    // Look up user_id from email
    const { data: userData, error: userDataError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (userDataError && userDataError.code !== 'PGRST116') {
      logger.warn('[Client Error API] Error fetching user_id:', {
        error: userDataError.message,
        code: (userDataError as any).code,
        email: user.email,
      });
    }

    return userData?.id || null;
  } catch (err) {
    // Silently fail - continue without user_id if lookup fails
    logger.dev('[Client Error API] Failed to get user_id:', {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}


