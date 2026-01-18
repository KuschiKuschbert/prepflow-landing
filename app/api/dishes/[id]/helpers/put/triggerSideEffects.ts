import { logger } from '@/lib/logger';
import { triggerCostSync, triggerDishSync } from '@/lib/square/sync/hooks';
import { NextRequest } from 'next/server';
import { trackChangeForLockedMenus } from '../invalidateDishCaches';

export async function triggerSideEffects(
  request: NextRequest,
  dishId: string,
  dishName: string,
  changes: string[],
  changeDetails: any, // justified
  userEmail: string,
) {
  // Track price changes for locked menus
  if (changes.includes('price_changed')) {
    (async () => {
      try {
        await trackChangeForLockedMenus(
          dishId,
          dishName,
          'price_changed',
          changeDetails.price as Record<string, unknown>,
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
}
