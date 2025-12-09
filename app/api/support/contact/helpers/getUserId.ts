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
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();
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
