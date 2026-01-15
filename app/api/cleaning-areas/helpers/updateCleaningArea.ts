import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Update a cleaning area.
 *
 * @param {string} id - Cleaning area ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated cleaning area
 * @throws {Error} If update fails
 */
export async function updateCleaningArea(
  id: string,
  updateData: {
    area_name?: string;
    description?: string;
    cleaning_frequency?: string;
    is_active?: boolean;
  },
) {
  if (!supabaseAdmin)
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 503);

  const { data, error } = await supabaseAdmin
    .from('cleaning_areas')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error('[Cleaning Areas API] Database error updating area:', {
      error: error.message,
      code: error.code,
      context: { endpoint: '/api/cleaning-areas', operation: 'PUT', areaId: id },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data;
}
