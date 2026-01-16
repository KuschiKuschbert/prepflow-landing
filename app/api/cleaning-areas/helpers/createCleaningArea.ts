import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import type { CleaningArea, CreateCleaningAreaInput } from './schemas';

/**
 * Create a cleaning area.
 *
 * @param {CreateCleaningAreaInput} areaData - Cleaning area data
 * @returns {Promise<CleaningArea>} Created cleaning area
 * @throws {Error} If creation fails
 */
export async function createCleaningArea(areaData: CreateCleaningAreaInput): Promise<CleaningArea> {
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
      code: error.code,
      context: { endpoint: '/api/cleaning-areas', operation: 'POST', table: 'cleaning_areas' },
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }

  return data as unknown as CleaningArea;
}
