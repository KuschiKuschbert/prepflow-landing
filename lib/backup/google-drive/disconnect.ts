/**
 * Google Drive disconnection.
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Disconnect Google Drive for a user.
 *
 * @param {string} userId - User ID (email)
 */
export async function disconnectGoogleDrive(userId: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from('user_google_tokens').delete().eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to disconnect Google Drive: ${error.message}`);
  }

  logger.info(`[Google Drive] Disconnected for user ${userId}`);
}
