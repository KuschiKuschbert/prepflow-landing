import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { DishIngredientInput } from '../../../helpers/schemas'; // Adjusted path
import { updateIngredientsWithTracking } from '../updateDishRelations';

export async function handleIngredientUpdates(
  dishId: string,
  dishName: string,
  ingredients: DishIngredientInput[] | undefined,
  changes: string[],
  changeDetails: any,
  userEmail: string,
): Promise<void> {
  if (!ingredients) return;

  try {
    await updateIngredientsWithTracking(
      dishId,
      dishName,
      ingredients,
      changes,
      changeDetails,
      userEmail,
    );
  } catch (ingredientsError) {
    if (
      ingredientsError &&
      typeof ingredientsError === 'object' &&
      'code' in ingredientsError &&
      'message' in ingredientsError
    ) {
      const pgError = ingredientsError as PostgrestError;
      logger.error('[Dishes API] Database error updating dish ingredients:', {
        error: pgError.message,
        code: pgError.code,
        context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
      });
      throw ApiErrorHandler.fromSupabaseError(pgError, 500);
    }
    logger.error('[Dishes API] Unexpected error updating dish ingredients:', ingredientsError);
    throw ApiErrorHandler.createError('Failed to update ingredients', 'UPDATE_ERROR', 500);
  }
}
