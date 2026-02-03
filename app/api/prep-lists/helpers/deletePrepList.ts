import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export async function deletePrepList(id: string, userId: string) {
  if (!supabaseAdmin) {
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  // Delete prep list items first (foreign key constraint)
  // We need to verify ownership of the list before deleting items.
  // Actually, RLS on the list delete should handle it, but we are using supabaseAdmin.

  // Safe approach: explicit check or combined delete.
  // Since we use admin client, we MUST filter by user_id on the PARENT table delete.
  // The items deletion is cascading usually, or manual.

  // If we delete parent with eq('user_id', userId), and it fails (returns 0 rows), then we shouldn't have deleted items?
  // But wait, the code deletes items FIRST.

  // Let's check constraints. If foreign key is cascade delete, we just delete parent.
  // If not, we must delete items.

  // To be safe, we should check ownership first because we are using admin client.
  const { data: existing, error: findError } = await supabaseAdmin
    .from('prep_lists')
    .select('id')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (findError || !existing) {
    throw ApiErrorHandler.createError('Prep list not found or access denied', 'NOT_FOUND', 404);
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
  const { error } = await supabaseAdmin
    .from('prep_lists')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

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
