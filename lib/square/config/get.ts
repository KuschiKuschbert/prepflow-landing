/**
 * Get Square configuration for a user.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { SquareConfig } from './types';

/**
 * Get Square configuration for a user.
 */
export async function getSquareConfig(userId: string): Promise<SquareConfig | null> {
  if (!supabaseAdmin) {
    logger.error('[Square Config] Database connection not available');
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('square_configurations')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No configuration found
        return null;
      }

      logger.error('[Square Config] Error fetching configuration:', {
        error: error.message,
        code: error.code,
        userId,
      });

      return null;
    }

    return data as SquareConfig;
  } catch (error: unknown) {
    logger.error('[Square Config] Unexpected error fetching configuration:', {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return null;
  }
}
