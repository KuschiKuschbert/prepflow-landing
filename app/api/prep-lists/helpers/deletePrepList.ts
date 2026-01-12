import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export async function deletePrepList(id: string) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Delete prep list items first (foreign key constraint)
  const { error: deleteItemsError } = await supabaseAdmin
    .from('prep_list_items')
    .delete()
    .eq('prep_list_id', id);

  if (deleteItemsError) {
    const pgItemsError = deleteItemsError as PostgrestError;
    logger.warn('[Prep Lists API] Warning: Could not delete prep list items:', {
      error: pgItemsError.message,
      code: pgItemsError.code,
      prepListId: id,
    });
    // Continue with list deletion even if items deletion fails
  }

  // Delete the prep list
  const { error } = await supabaseAdmin.from('prep_lists').delete().eq('id', id);

  if (error) {
    const pgError = error as PostgrestError;
    logger.error('[Prep Lists API] Database error deleting prep list:', {
      error: pgError.message,
      code: pgError.code,
      prepListId: id,
    });
    throw ApiErrorHandler.fromSupabaseError(pgError, 500);
  }
}
