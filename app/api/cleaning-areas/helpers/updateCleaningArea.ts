import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { CleaningArea, UpdateCleaningAreaInput } from './schemas';

/**
 * Update a cleaning area.
 *
 * @param {string} id - Cleaning area ID
 * @param {Omit<UpdateCleaningAreaInput, 'id'>} updateData - Update data
 * @returns {Promise<CleaningArea>} Updated cleaning area
 * @throws {Error} If update fails
 */
export async function updateCleaningArea(
  id: string,
  updateData: Omit<UpdateCleaningAreaInput, 'id'>,
): Promise<CleaningArea> {
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

  return data as unknown as CleaningArea;
}
