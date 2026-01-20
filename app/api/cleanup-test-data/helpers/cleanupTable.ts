import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';

export async function cleanupTable(
  supabaseAdmin: SupabaseClient,
  table: string,
): Promise<{ deleted: number; error?: string }> {
  try {
    // Get count before deletion
    const { count, error: countError } = await supabaseAdmin
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      logger.warn(`[Cleanup Test Data] Error counting records in ${table}:`, {
        error: countError.message,
        code: countError.code,
      });
    }

    // Delete all records
    const { error } = await supabaseAdmin.from(table).delete().neq('id', '0'); // Delete all

    if (error) {
      logger.error(`[Cleanup Test Data] Error deleting from ${table}:`, {
        error: error.message,
        code: error.code,
      });
      return { deleted: 0, error: error.message };
    }

    return { deleted: count || 0 };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    logger.error(`[Cleanup Test Data] Error processing table ${table}:`, {
      error: errorMessage,
      stack: err instanceof Error ? err.stack : undefined,
      table,
    });
    return { deleted: 0, error: errorMessage };
  }
}
