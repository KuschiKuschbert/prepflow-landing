import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { FeatureFlagInput, ProcessResult } from '../types';

async function upsertHiddenFlag(flag: FeatureFlagInput): Promise<'created' | 'skipped' | 'error'> {
  if (!supabaseAdmin) return 'error';

  const { data: existing, error: checkError } = await supabaseAdmin
    .from('hidden_feature_flags')
    .select('feature_key')
    .eq('feature_key', flag.flag_key)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    logger.warn('[Admin Auto-Create] Error checking if hidden flag exists:', {
      error: checkError.message,
      feature_key: flag.flag_key,
    });
  }

  if (existing) {
    return 'skipped';
  }

  // Create new hidden flag
  const { error } = await supabaseAdmin.from('hidden_feature_flags').insert({
    feature_key: flag.flag_key,
    description: flag.description || `Feature: ${flag.flag_key}`,
    is_unlocked: false,
    is_enabled: false,
  });

  if (error) {
    if (error.code === '23505') {
      return 'skipped';
    }
    logger.error('[Admin Auto-Create] Error creating hidden flag:', {
      error: error.message,
      feature_key: flag.flag_key,
    });
    return 'error';
  }

  return 'created';
}

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

  const results = await Promise.all(flags.map(flag => upsertHiddenFlag(flag)));

  results.forEach((status, index) => {
    const flag = flags[index];
    if (status === 'created') {
      result.created++;
      result.createdFlags.push(flag.flag_key);
    } else {
      result.skipped++;
      result.skippedFlags.push(flag.flag_key);
    }
  });

  return result;
}
