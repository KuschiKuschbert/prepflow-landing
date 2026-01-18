import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';

export async function performDishUpdate(dishId: string, updateData: any) { // justified
  if (!supabaseAdmin) {
    throw new Error('Database connection not available');
  }

  const { data: updatedDish, error: updateError } = await supabaseAdmin
    .from('dishes')
    .update(updateData)
    .eq('id', dishId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Dishes API] Database error updating dish:', {
      error: updateError.message,
      code: updateError.code,
      context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
    throw apiError; // Throwing to be caught by main handler or returned as response if I change return type
  }

  return updatedDish;
}
