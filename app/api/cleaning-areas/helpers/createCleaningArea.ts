import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create a cleaning area.
 *
 * @param {Object} areaData - Cleaning area data
 * @returns {Promise<Object>} Created cleaning area
 * @throws {Error} If creation fails
 */
export async function createCleaningArea(areaData: {
  area_name: string;
  description?: string | null;
  cleaning_frequency?: string;
}) {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 503);

  const { data, error } = await supabaseAdmin
    .from('cleaning_areas')
    .insert({
      area_name: areaData.area_name,
      description: areaData.description || null,
      cleaning_frequency: areaData.cleaning_frequency || 'daily',
    })
    .select()
    .single();

  if (error) {
    logger.error('[Cleaning Areas API] Database error creating area:', {
      error: error.message,
      code: (error as any).code,
      context: { endpoint: '/api/cleaning-areas', operation: 'POST', table: 'cleaning_areas' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
