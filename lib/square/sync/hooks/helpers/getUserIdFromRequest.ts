/**
 * Get user UUID from request (for sync hooks).
 */
import { NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/auth0-api-helpers';
import { logger } from '@/lib/logger';

/**
 * Get user UUID from request (for sync hooks)
 * Converts email to UUID by querying the users table
 * Returns null if user cannot be determined
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    const user = await getUserFromRequest(req);
    if (!user?.email) {
      return null;
    }

    // Convert email to UUID by querying users table
    const { supabaseAdmin } = await import('@/lib/supabase');
    if (!supabaseAdmin) {
      logger.warn('[Square Sync Hooks] Supabase not available, cannot get user UUID');
      return null;
    }

    const { data: dbUser, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', user.email)
      .single();

    if (error || !dbUser) {
      logger.warn('[Square Sync Hooks] User not found in database:', {
        email: user.email,
        error: error?.message,
      });
      return null;
    }

    return dbUser.id;
  } catch (error) {
    logger.error('[Square Sync Hooks] Failed to get user from request:', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}



