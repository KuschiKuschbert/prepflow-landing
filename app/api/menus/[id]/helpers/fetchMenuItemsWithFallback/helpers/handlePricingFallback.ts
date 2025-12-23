/**
 * Helper for handling pricing column fallback
 */

import { logger } from '@/lib/logger';
import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logDetailedError } from '../../fetchMenuWithItems.helpers';
import { detectMissingColumns } from '../../errorDetection/detectMissingColumns';
import { buildQueryWithoutPricing, buildMinimalQuery } from '../../queryBuilders/menuItemQueries';
import { handleUltimateFallback } from './handleUltimateFallback';

/**
 * Handles fallback when pricing columns are missing
 *
 * @param {any} allColumnsError - Error from full query
 * @param {string} menuId - Menu ID
 * @returns {Promise<any>} Menu items or throws error
 */
export async function handlePricingFallback(
  allColumnsError: any,
  menuId: string,
): Promise<{
  items: any[];
  pricingError: any;
  dietaryError: any | null;
  descriptionError: any | null;
}> {
  const pricingError = allColumnsError;
  logger.warn('[Menus API] Pricing columns not found, trying without them:', {
    error: allColumnsError?.message,
    context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
  });

  const { data: itemsWithoutPricing, error: noPricingError } =
    await buildQueryWithoutPricing(menuId);

  if (!noPricingError && itemsWithoutPricing) {
    return { items: itemsWithoutPricing, pricingError, dietaryError: null, descriptionError: null };
  }

  if (noPricingError) {
    const fallbackErrorInfo = detectMissingColumns(noPricingError);
    if (fallbackErrorInfo.isMissingDietary || fallbackErrorInfo.isMissingDescription) {
      const dietaryError = noPricingError;
      const descriptionError = fallbackErrorInfo.isMissingDescription ? noPricingError : null;

      logger.warn(
        '[Menus API] Dietary/allergen/description columns not found, trying without them:',
        {
          error: noPricingError.message,
          context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
        },
      );

      const { data: itemsMinimal, error: minimalError } = await buildMinimalQuery(menuId);

      if (minimalError) {
        return handleUltimateFallback(
          minimalError,
          menuId,
          pricingError,
          dietaryError,
          descriptionError,
        );
      }

      return { items: itemsMinimal, pricingError, dietaryError, descriptionError };
    } else {
      logDetailedError(
        noPricingError,
        'Database error fetching menu items (no pricing fallback failed)',
        menuId,
      );
      throw ApiErrorHandler.fromSupabaseError(noPricingError, 500);
    }
  }

  throw ApiErrorHandler.createError('Unexpected state in pricing fallback', 'SERVER_ERROR', 500);
}
