import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { MenuItem } from '../../helpers/schemas';
import { detectMissingColumns } from './errorDetection/detectMissingColumns';
import { handleDietaryFallback } from './fetchMenuItemsWithFallback/helpers/handleDietaryFallback';
import { handlePricingFallback } from './fetchMenuItemsWithFallback/helpers/handlePricingFallback';
import { handleUltimateFallback } from './fetchMenuItemsWithFallback/helpers/handleUltimateFallback';
import { logDetailedError } from './fetchMenuWithItems.helpers';
import {
    buildFullQuery,
    buildMinimalQuery
} from './queryBuilders/menuItemQueries';
import { FetchResult } from './types';

/**
 * Fetches menu items with progressive fallback for missing columns
 *
 * @param {string} menuId - Menu ID
 * @returns {Promise<FetchResult>} Menu items with error flags
 */
export async function fetchMenuItemsWithFallback(menuId: string): Promise<FetchResult> {
  // First try with all columns
  const { data: itemsWithAll, error: allColumnsError } = await buildFullQuery(menuId);

  if (!allColumnsError && itemsWithAll) {
    return {
      items: itemsWithAll as Partial<MenuItem>[],
      pricingError: null,
      dietaryError: null,
      descriptionError: null,
    };
  }

  // Analyze error to determine which columns are missing
  const errorInfo = detectMissingColumns(allColumnsError as PostgrestError);
  logDetailedError(allColumnsError, 'Error fetching menu items, attempting fallback', menuId);

  // Try without pricing columns
  if (errorInfo.isMissingPricing) {
    return handlePricingFallback(allColumnsError as PostgrestError, menuId);
  }

  // Try without dietary columns
  if (errorInfo.isMissingDietary) {
    return handleDietaryFallback(allColumnsError as PostgrestError, menuId);
  }

  // Try minimal query as last resort
  if (errorInfo.isColumnNotFound) {
    logger.warn('[Menus API] Unknown column not found, trying minimal query:', {
      error: (allColumnsError as PostgrestError)?.message,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });

    const { data: itemsMinimal, error: minimalError } = await buildMinimalQuery(menuId);

    if (minimalError) {
      return handleUltimateFallback(minimalError as PostgrestError, menuId);
    }

    return {
      items: (itemsMinimal || []) as Partial<MenuItem>[],
      pricingError: null,
      dietaryError: null,
      descriptionError: null,
    };
  }

  // Unknown error - throw it
  logDetailedError(allColumnsError, 'Database error fetching menu items (unknown error)', menuId);
  throw ApiErrorHandler.fromSupabaseError(allColumnsError as PostgrestError, 500);
}
