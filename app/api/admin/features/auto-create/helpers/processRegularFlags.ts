import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { FeatureFlagInput, ProcessResult } from '../types';

/**
 * Processes a list of regular feature flags, creating them if they don't exist.
 */
export async function processRegularFlags(flags: FeatureFlagInput[]): Promise<ProcessResult> {
  const result: ProcessResult = {
    created: 0,
    skipped: 0,
    createdFlags: [],
    skippedFlags: [],
  };

  if (!supabaseAdmin) {
    logger.error('Database connection not available');
    return result;
  }

  for (const flag of flags) {
    try {
      // Check if flag already exists
      const { data: existing, error: checkError } = await supabaseAdmin
        .from('feature_flags')
        .select('flag_key')
        .eq('flag_key', flag.flag_key)
        .is('user_id', null)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // PGRST116 is "not found" - that's okay, we'll create the flag
        logger.warn('[Admin Auto-Create] Error checking if regular flag exists:', {
          error: checkError.message,
          flag_key: flag.flag_key,
        });
      }

      if (existing) {
        result.skipped++;
        result.skippedFlags.push(flag.flag_key);
        continue;
      }

      // Create new flag
      const { error } = await supabaseAdmin.from('feature_flags').insert({
        flag_key: flag.flag_key,
        enabled: false,
        user_id: null,
        description: flag.description || null,
      });

      if (error) {
        // If it's a unique constraint violation, skip it
        if (error.code === '23505') {
          result.skipped++;
          result.skippedFlags.push(flag.flag_key);
        } else {
          logger.error('[Admin Auto-Create] Error creating regular flag:', {
            error: error.message,
            flag_key: flag.flag_key,
          });
          result.skippedFlags.push(flag.flag_key);
        }
      } else {
        result.created++;
        result.createdFlags.push(flag.flag_key);
      }
    } catch (err) {
      logger.error('[Admin Auto-Create] Unexpected error creating regular flag:', {
        error: err instanceof Error ? err.message : String(err),
        flag_key: flag.flag_key,
      });
      result.skippedFlags.push(flag.flag_key);
    }
  }

  return result;
}
