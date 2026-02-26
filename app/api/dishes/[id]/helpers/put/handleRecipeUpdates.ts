import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { DishRecipeInput } from '../../../helpers/schemas'; // Adjusted path
import { invalidateAllergenCache, invalidateMenuPricingCache } from '../invalidateDishCaches';
import { updateRecipesWithTracking } from '../updateDishRelations';

export async function handleRecipeUpdates(
  dishId: string,
  dishName: string,
  recipes: DishRecipeInput[] | undefined,
  changes: string[],
  changeDetails: Record<string, unknown>,
  userEmail: string,
): Promise<void> {
  if (!recipes) return;

  try {
    await updateRecipesWithTracking(dishId, recipes, changes, changeDetails);

    // Invalidate caches in background
    (async () => {
      try {
        await invalidateAllergenCache(dishId);
      } catch (err) {
        logger.error('[Dishes API] Error invalidating allergen cache:', {
          error: err instanceof Error ? err.message : String(err),
          context: { dishId, operation: 'invalidateAllergenCache' },
        });
      }
    })();

    (async () => {
      try {
        await invalidateMenuPricingCache(
          dishId,
          dishName,
          'recipes_changed',
          changeDetails.recipes as Record<string, unknown>,
          userEmail,
        );
      } catch (err) {
        logger.error('[Dishes API] Error invalidating menu pricing cache:', {
          error: err instanceof Error ? err.message : String(err),
          context: { dishId, dishName, operation: 'invalidateMenuPricingCache' },
        });
      }
    })();
  } catch (recipesError) {
    if (
      recipesError &&
      typeof recipesError === 'object' &&
      'code' in recipesError &&
      'message' in recipesError
    ) {
      const pgError = recipesError as PostgrestError;
      logger.error('[Dishes API] Database error updating dish recipes:', {
        error: pgError.message,
        code: pgError.code,
        context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
      });
      throw ApiErrorHandler.fromSupabaseError(pgError, 500);
    }
    logger.error('[Dishes API] Unexpected error updating dish recipes:', recipesError);
    throw ApiErrorHandler.createError('Failed to update recipes', 'UPDATE_ERROR', 500);
  }
}
