import { supabaseAdmin } from '@/lib/supabase';

/**
 * Get user ID from email address
 *
 * @param {string} email - User email address
 * @returns {Promise<string | null>} User ID or null if not found
 */
export async function getUserIdFromEmail(email: string): Promise<string | null> {
  if (!supabaseAdmin) return null;
  try {
    const { data } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
    return data?.id || null;
  } catch {
    return null;
  }
}


