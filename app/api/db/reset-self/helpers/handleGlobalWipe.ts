import { SupabaseClient } from '@supabase/supabase-js';
import { cleanExistingData } from '@/lib/populate-helpers';
import { logger } from '@/lib/logger';

type DeleteSummary = {
  dryRun: boolean;
  reseeded: boolean;
  deletedCountsByTable: Record<string, number>;
};

/**
 * Handle global wipe operation.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @returns {Promise<DeleteSummary>} Delete summary
 * @throws {Error} If wipe fails
 */
export async function handleGlobalWipe(supabase: SupabaseClient): Promise<DeleteSummary> {
  logger.info('🧹 Starting global wipe via cleanExistingData...');
  const cleaned = await cleanExistingData(supabase);
  logger.info(`✅ Global wipe completed: ${cleaned} tables cleaned`);
  return {
    dryRun: false,
    reseeded: false,
    deletedCountsByTable: { all_tables: cleaned },
  };
}
