import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { FeatureFlagInput, ProcessResult } from '../types';

/**
 * Processes a list of hidden feature flags, creating them if they don't exist.
 */
export async function processHiddenFlags(flags: FeatureFlagInput[]): Promise<ProcessResult> {
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
      const { data: existing, error: checkError2 } = await supabaseAdmin
        .from('hidden_feature_flags')
        .select('feature_key')
        .eq('feature_key', flag.flag_key)
        .single();

      if (checkError2 && checkError2.code !== 'PGRST116') {
        // PGRST116 is "not found" - that's okay, we'll create the flag
        logger.warn('[Admin Auto-Create] Error checking if hidden flag exists:', {
          error: checkError2.message,
          feature_key: flag.flag_key,
        });
      }

      if (existing) {
        result.skipped++;
        result.skippedFlags.push(flag.flag_key);
        continue;
      }

      // Create new hidden flag
      const { error } = await supabaseAdmin.from('hidden_feature_flags').insert({
        feature_key: flag.flag_key,
        description: flag.description || `Feature: ${flag.flag_key}`,
        is_unlocked: false,
        is_enabled: false,
      });

      if (error) {
        // If it's a unique constraint violation, skip it
        if (error.code === '23505') {
          result.skipped++;
          result.skippedFlags.push(flag.flag_key);
        } else {
          logger.error('[Admin Auto-Create] Error creating hidden flag:', {
            error: error.message,
            feature_key: flag.flag_key,
          });
          result.skippedFlags.push(flag.flag_key);
        }
      } else {
        result.created++;
        result.createdFlags.push(flag.flag_key);
      }
    } catch (err) {
      logger.error('[Admin Auto-Create] Unexpected error creating hidden flag:', {
        error: err instanceof Error ? err.message : String(err),
        feature_key: flag.flag_key,
      });
      result.skippedFlags.push(flag.flag_key);
    }
  }

  return result;
}
