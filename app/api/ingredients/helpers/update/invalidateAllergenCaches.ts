import {
    invalidateDishesWithIngredient,
    invalidateRecipesWithIngredient,
} from '@/lib/allergens/cache-invalidation';
import { logger } from '@/lib/logger';

export function invalidateAllergenCaches(id: string) {
  // Don't await - run in background
  (async () => {
    try {
      await Promise.all([
        invalidateRecipesWithIngredient(id),
        invalidateDishesWithIngredient(id),
      ]);
    } catch (err) {
      logger.error('[Ingredients API] Error invalidating allergen caches:', {
        error: err instanceof Error ? err.message : String(err),
        context: { ingredientId: id, operation: 'invalidateAllergenCaches' },
      });
    }
  })();
}
