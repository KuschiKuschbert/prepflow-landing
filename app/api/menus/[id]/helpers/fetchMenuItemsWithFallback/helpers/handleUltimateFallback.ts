/**
 * Helper for handling ultimate fallback scenarios
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { detectMissingColumns } from '../../errorDetection/detectMissingColumns';
import { logDetailedError } from '../../fetchMenuWithItems.helpers';
import {
  buildEssentialQuery,
  buildQueryWithoutRelations,
} from '../../queryBuilders/menuItemQueries';

/**
 * Handles ultimate fallback scenarios
 *
 * @param {any} error - Error from minimal query
 * @param {string} menuId - Menu ID
 * @param {any} pricingError - Pricing error (if any)
 * @param {any} dietaryError - Dietary error (if any)
 * @param {any} descriptionError - Description error (if any)
 * @returns {Promise<any>} Menu items from ultimate fallback
 */
export async function handleUltimateFallback(
  error: any,
  menuId: string,
  pricingError: any | null = null,
  dietaryError: any | null = null,
  descriptionError: any | null = null,
): Promise<{
  items: any[];
  pricingError: any | null;
  dietaryError: any | null;
  descriptionError: any | null;
}> {
  logDetailedError(
    error,
    'Database error fetching menu items (minimal query failed), trying without relationships',
    menuId,
  );

  const { data: itemsNoRelations, error: noRelationsError } =
    await buildQueryWithoutRelations(menuId);

  if (noRelationsError) {
    const errorInfo = detectMissingColumns(noRelationsError);
    const isCategoryOrPositionMissing =
      errorInfo.columnName === 'category' ||
      errorInfo.columnName === 'position' ||
      noRelationsError.message?.includes('category') ||
      noRelationsError.message?.includes('position');

    if (isCategoryOrPositionMissing) {
      logger.warn(
        '[Menus API] Category/position columns missing, trying with only essential columns:',
        {
          error: noRelationsError.message,
          context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
        },
      );

      const { data: itemsEssential, error: essentialError } = await buildEssentialQuery(menuId);

      if (essentialError) {
        logDetailedError(
          essentialError,
          'Database error fetching menu items (ultimate fallback with essential columns failed)',
          menuId,
        );
        throw ApiErrorHandler.fromSupabaseError(essentialError, 500);
      }

      return { items: itemsEssential || [], pricingError, dietaryError, descriptionError };
    } else {
      logDetailedError(
        noRelationsError,
        'Database error fetching menu items (final fallback without relationships failed)',
        menuId,
      );
      throw ApiErrorHandler.fromSupabaseError(noRelationsError, 500);
    }
  }

  return { items: itemsNoRelations || [], pricingError, dietaryError, descriptionError };
}
