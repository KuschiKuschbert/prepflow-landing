import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Create a recipe share record.
 *
 * @param {Object} shareData - Share data
 * @returns {Promise<Object>} Created share record
 * @throws {Error} If creation fails
 */
export async function createShareRecord(shareData: {
  recipe_id: string;
  share_type: string;
  recipient_email?: string;
  notes?: string;
}) {
  if (!supabaseAdmin) throw new Error('Database connection not available');

  const { data: shareRecord, error: shareError } = await supabaseAdmin
    .from('recipe_shares')
    .insert({
      recipe_id: shareData.recipe_id,
      share_type: shareData.share_type,
      recipient_email: shareData.recipient_email,
      notes: shareData.notes,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (shareError) {
    logger.error('[Recipe Share API] Error creating share record:', {
      error: shareError.message,
      code: (shareError as any).code,
      context: { endpoint: '/api/recipe-share', operation: 'POST', recipeId: shareData.recipe_id },
    });
    throw ApiErrorHandler.fromSupabaseError(shareError, 500);
  }

  return shareRecord;
}
