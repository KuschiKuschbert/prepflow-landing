import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get user ID from email
 */
export async function getUserId(userEmail: string): Promise<string | null> {
  if (!supabaseAdmin) {
    return null;
  }

  try {
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
    if (userError && userError.code !== 'PGRST116') {
      // PGRST116 is "not found" - that's okay, continue with null userId
      logger.error('[Support API] Error fetching user ID:', {
        error: userError.message,
        userEmail,
        context: { endpoint: '/api/support/contact', operation: 'getUserId' },
      });
    }
    if (userData) {
      return userData.id;
    }
  } catch (err) {
    // If user not found, continue with null userId (we still have email)
    logger.dev('[Support API] User not found in database, continuing with email only:', {
      userEmail,
    });
  }

  return null;
}
