import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { SupabaseClient } from '@supabase/supabase-js';
import type { CleaningArea, CreateCleaningAreaInput } from './schemas';

/**
 * Create a cleaning area.
 *
 * @param {SupabaseClient} supabase - Supabase client
 * @param {CreateCleaningAreaInput} areaData - Cleaning area data
 * @returns {Promise<CleaningArea>} Created cleaning area
 * @throws {Error} If creation fails
 */
export async function createCleaningArea(
  supabase: SupabaseClient,
  areaData: CreateCleaningAreaInput,
  userId: string,
): Promise<CleaningArea> {
  const { data, error } = await supabase
    .from('cleaning_areas')
    .insert({
      area_name: areaData.area_name,
      description: areaData.description || null,
      cleaning_frequency: areaData.cleaning_frequency || 'daily',
      user_id: userId,
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
