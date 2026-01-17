import { logger } from '@/lib/logger';
import { invalidateMenuItemsWithIngredient } from '@/lib/menu-pricing/cache-invalidation';

export function invalidateCostCaches(
  id: string,
  ingredientName: string,
  changeDetails: any,
  userEmail?: string | null,
) {
  // Don't await - run in background
  (async () => {
    try {
      await invalidateMenuItemsWithIngredient(
        id,
        ingredientName,
        changeDetails,
        userEmail || null,
      );
    } catch (err) {
      logger.error('[Ingredients API] Error invalidating menu pricing cache:', {
        error: err instanceof Error ? err.message : String(err),
        context: { ingredientId: id, ingredientName, operation: 'invalidateMenuPricingCache' },
      });
    }
  })();
}
