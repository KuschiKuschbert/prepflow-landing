/**
 * Run a population function only if the table has no data. Reduces duplication in demo setup.
 */
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function hasExistingData(table: string): Promise<boolean> {
  if (!supabaseAdmin) return false;
  const { data, error } = await supabaseAdmin.from(table).select('id').limit(1);
  if (error) {
    logger.warn(`[Demo Mode] Error checking ${table}:`, { error: error.message });
    return false;
  }
  return (data?.length ?? 0) > 0;
}

export async function runIfEmpty<T>(
  table: string,
  fn: () => Promise<T>,
  skipMessage: string,
): Promise<T | null> {
  if (await hasExistingData(table)) {
    logger.info(`[Demo Mode] ${skipMessage}`);
    return null;
  }
  return fn();
}
