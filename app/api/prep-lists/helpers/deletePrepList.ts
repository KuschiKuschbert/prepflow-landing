import { supabaseAdmin } from '@/lib/supabase';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

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
    logger.warn('[Prep Lists API] Warning: Could not delete prep list items:', {
      error: deleteItemsError.message,
      code: (deleteItemsError as any).code,
      prepListId: id,
    });
    // Continue with list deletion even if items deletion fails
  }

  // Delete the prep list
  const { error } = await supabaseAdmin.from('prep_lists').delete().eq('id', id);

  if (error) {
    logger.error('[Prep Lists API] Database error deleting prep list:', {
      error: error.message,
      code: (error as any).code,
      prepListId: id,
    });
    throw ApiErrorHandler.fromSupabaseError(error, 500);
  }
}
