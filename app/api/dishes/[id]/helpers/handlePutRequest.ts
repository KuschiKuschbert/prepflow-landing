/**
 * Helper for handling PUT requests to update dishes
 *
 * 📚 Square Integration: This helper automatically triggers Square sync hooks (dish sync and cost sync)
 * after dish update operations. See `docs/SQUARE_API_REFERENCE.md` (Automatic Sync section) for details.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { buildDishUpdateData } from './buildDishUpdateData';
import { fetchDishWithRelations } from './fetchDishWithRelations';
import { detectDishChanges } from './detectDishChanges';
import { updateRecipesWithTracking, updateIngredientsWithTracking } from './updateDishRelations';
import {
  invalidateAllergenCache,
  invalidateMenuPricingCache,
  trackChangeForLockedMenus,
} from './invalidateDishCaches';
import { getUserEmail } from './getUserEmail';
import { triggerDishSync, triggerCostSync } from '@/lib/square/sync/hooks';

/**
 * Handles PUT request for updating a dish
 *
 * @param {NextRequest} request - Request object
 * @param {string} dishId - Dish ID
 * @returns {Promise<NextResponse>} Updated dish response
 */
export async function handlePutRequest(
  request: NextRequest,
  dishId: string,
): Promise<NextResponse> {
  const body = await request.json();
  const { recipes, ingredients } = body;

  if (!supabaseAdmin) {
    return NextResponse.json(
      ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500),
      { status: 500 },
    );
  }

  // Get user email for change tracking
  const userEmail = await getUserEmail(request);

  // Fetch current dish to detect changes
  let currentDish: any = null;
  try {
    const dish = await fetchDishWithRelations(dishId);
    currentDish = dish;
  } catch (err) {
    logger.warn('[Dishes API] Could not fetch current dish for change detection:', err);
  }

  // Build update data
  const updateData = buildDishUpdateData(body);

  // Detect changes
  const { changes, changeDetails } = detectDishChanges(currentDish, updateData);

  // Update dish
  const { data: updatedDish, error: updateError } = await supabaseAdmin
    .from('dishes')
    .update(updateData)
    .eq('id', dishId)
    .select()
    .single();

  if (updateError) {
    logger.error('[Dishes API] Database error updating dish:', {
      error: updateError.message,
      code: (updateError as any).code,
      context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
    });

    const apiError = ApiErrorHandler.fromSupabaseError(updateError, 500);
    return NextResponse.json(apiError, { status: apiError.status || 500 });
  }

  const dishName = updatedDish.dish_name || currentDish?.dish_name || 'Unknown Dish';

  // Update recipes if provided
  if (recipes !== undefined) {
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
            changeDetails.recipes,
            userEmail,
          );
        } catch (err) {
          logger.error('[Dishes API] Error invalidating menu pricing cache:', {
            error: err instanceof Error ? err.message : String(err),
            context: { dishId, dishName, operation: 'invalidateMenuPricingCache' },
          });
        }
      })();
    } catch (recipesError: any) {
      logger.error('[Dishes API] Database error updating dish recipes:', {
        error: recipesError.message,
        code: recipesError.code,
        context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(recipesError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
  }

  // Update ingredients if provided
  if (ingredients !== undefined) {
    try {
      await updateIngredientsWithTracking(
        dishId,
        dishName,
        ingredients,
        changes,
        changeDetails,
        userEmail,
      );
    } catch (ingredientsError: any) {
      logger.error('[Dishes API] Database error updating dish ingredients:', {
        error: ingredientsError.message,
        code: ingredientsError.code,
        context: { endpoint: '/api/dishes/[id]', operation: 'PUT', dishId },
      });
      const apiError = ApiErrorHandler.fromSupabaseError(ingredientsError, 500);
      return NextResponse.json(apiError, { status: apiError.status || 500 });
    }
  }

  // Track price changes for locked menus
  if (changes.includes('price_changed')) {
    (async () => {
      try {
        await trackChangeForLockedMenus(
          dishId,
          dishName,
          'price_changed',
          changeDetails.price,
          userEmail,
        );
      } catch (err) {
        logger.error('[Dishes API] Error tracking price change:', {
          error: err instanceof Error ? err.message : String(err),
          context: { dishId, dishName, operation: 'trackChangeForLockedMenus' },
        });
      }
    })();
  }

  // Trigger Square sync hooks (non-blocking)
  // Always trigger dish sync for updates
  (async () => {
    try {
      await triggerDishSync(request, dishId, 'update');
    } catch (err) {
      logger.error('[Dishes API] Error triggering Square dish sync:', {
        error: err instanceof Error ? err.message : String(err),
        dishId,
      });
    }
  })();

  // Trigger cost sync if recipes or ingredients changed
  if (changes.includes('recipes_changed') || changes.includes('ingredients_changed')) {
    (async () => {
      try {
        await triggerCostSync(request, dishId, 'dish_updated');
      } catch (err) {
        logger.error('[Dishes API] Error triggering Square cost sync:', {
          error: err instanceof Error ? err.message : String(err),
          dishId,
        });
      }
    })();
  }

  return NextResponse.json({
    success: true,
    dish: updatedDish,
  });
}
