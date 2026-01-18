import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { FeatureFlagInput, ProcessResult } from '../types';

async function upsertRegularFlag(flag: FeatureFlagInput): Promise<'created' | 'skipped' | 'error'> {
  if (!supabaseAdmin) return 'error';

  const { data: existing, error: checkError } = await supabaseAdmin
    .from('feature_flags')
    .select('flag_key')
    .eq('flag_key', flag.flag_key)
    .is('user_id', null)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    logger.warn('[Admin Auto-Create] Error checking if regular flag exists:', {
      error: checkError.message,
      flag_key: flag.flag_key,
    });
  }

  if (existing) {
    return 'skipped';
  }

  // Create new flag
  const { error } = await supabaseAdmin.from('feature_flags').insert({
    flag_key: flag.flag_key,
    enabled: false,
    user_id: null,
    description: flag.description || null,
  });

  if (error) {
    if (error.code === '23505') {
      return 'skipped';
    }
    logger.error('[Admin Auto-Create] Error creating regular flag:', {
      error: error.message,
      flag_key: flag.flag_key,
    });
    return 'error';
  }

  return 'created';
}

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

  const results = await Promise.all(flags.map(flag => upsertRegularFlag(flag)));

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
