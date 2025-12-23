import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';

const BATCH_SIZE = 100;

/**
 * Process insert batch
 */
export async function processInsertBatch(
  supabase: SupabaseClient,
  tableName: string,
  batchToInsert: any[],
): Promise<void> {
  const { error } = await supabase.from(tableName).insert(batchToInsert);
  if (error) {
    logger.error('[Restore] Error inserting batch:', {
      error: error.message,
      code: (error as any).code,
      context: { tableName, batchSize: batchToInsert.length, operation: 'insertBatch' },
    });
    throw error;
  }
}

/**
 * Process update batch
 */
export async function processUpdateBatch(
  supabase: SupabaseClient,
  tableName: string,
  batchToUpdate: any[],
  userId: string,
): Promise<void> {
  for (const updateRecord of batchToUpdate) {
    const { error } = await supabase
      .from(tableName)
      .update(updateRecord)
      .eq('id', updateRecord.id)
      .eq('user_id', userId);

    if (error) {
      logger.error('[Restore] Error updating record:', {
        error: error.message,
        code: (error as any).code,
        context: { tableName, recordId: updateRecord.id, operation: 'updateRecord' },
      });
      throw error;
    }
  }
}

export { BATCH_SIZE };

