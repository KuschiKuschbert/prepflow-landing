/**
 * Token storage and retrieval for Google Drive authentication.
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { encryptToken, decryptToken } from '../token-encryption';

/**
 * Get encrypted refresh token from database.
 *
 * @param {string} userId - User ID (email)
 * @returns {Promise<string | null>} Encrypted refresh token or null
 */
export async function getEncryptedRefreshToken(userId: string): Promise<string | null> {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from('user_google_tokens')
    .select('encrypted_refresh_token')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  try {
    // Decrypt the token
    const decryptedToken = await decryptToken(data.encrypted_refresh_token);
    return decryptedToken;
  } catch (error: any) {
    logger.error(`[Google Drive] Failed to decrypt token for user ${userId}:`, error);
    // If decryption fails, token is invalid - return null to trigger re-auth
    return null;
  }
}

/**
 * Store encrypted refresh token in database.
 *
 * @param {string} userId - User ID (email)
 * @param {string} refreshToken - Refresh token to encrypt and store
 */
export async function storeEncryptedRefreshToken(
  userId: string,
  refreshToken: string,
): Promise<void> {
  const supabase = createSupabaseAdmin();

  // Encrypt the token before storing
  const encryptedToken = await encryptToken(refreshToken);

  const { error } = await supabase.from('user_google_tokens').upsert(
    {
      user_id: userId,
      encrypted_refresh_token: encryptedToken,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id',
    },
  );

  if (error) {
    throw new Error(`Failed to store refresh token: ${error.message}`);
  }
}
