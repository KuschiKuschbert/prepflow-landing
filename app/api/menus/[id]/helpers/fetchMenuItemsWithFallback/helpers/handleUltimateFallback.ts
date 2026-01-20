/**
 * Helper for handling ultimate fallback scenarios
 */

import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { detectMissingColumns } from '../../errorDetection/detectMissingColumns';
import { logDetailedError } from '../../fetchMenuWithItems.helpers';
import {
    buildEssentialQuery,
    buildQueryWithoutRelations,
} from '../../queryBuilders/menuItemQueries';
import { FetchResult } from '../../types';

/**
 * Handles ultimate fallback scenarios
 *
 * @param {PostgrestError} error - Error from minimal query
 * @param {string} menuId - Menu ID
 * @param {PostgrestError | null} pricingError - Pricing error (if any)
 * @param {PostgrestError | null} dietaryError - Dietary error (if any)
 * @param {PostgrestError | null} descriptionError - Description error (if any)
 * @returns {Promise<any>} Menu items from ultimate fallback
 */
export async function handleUltimateFallback(
  error: PostgrestError,
  menuId: string,
  pricingError: PostgrestError | null = null,
  dietaryError: PostgrestError | null = null,
  descriptionError: PostgrestError | null = null,
): Promise<FetchResult> {
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
