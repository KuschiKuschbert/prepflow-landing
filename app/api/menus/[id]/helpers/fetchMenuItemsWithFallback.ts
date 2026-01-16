import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { MenuItem } from '../../helpers/schemas';
import { detectMissingColumns } from './errorDetection/detectMissingColumns';
import { handlePricingFallback } from './fetchMenuItemsWithFallback/helpers/handlePricingFallback';
import { handleUltimateFallback } from './fetchMenuItemsWithFallback/helpers/handleUltimateFallback';
import { logDetailedError } from './fetchMenuWithItems.helpers';
import {
  buildFullQuery,
  buildMinimalQuery,
  buildQueryWithoutDescription,
  buildQueryWithoutDietary,
} from './queryBuilders/menuItemQueries';

export interface FetchResult {
  items: Partial<MenuItem>[];
  pricingError: PostgrestError | null;
  dietaryError: PostgrestError | null;
  descriptionError: PostgrestError | null;
}

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
    const dietaryError = allColumnsError as PostgrestError;
    logger.warn('[Menus API] Dietary/allergen columns not found, trying without them:', {
      error: (allColumnsError as PostgrestError)?.message,
      context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
    });

    const { data: itemsWithoutDietary, error: noDietaryError } =
      await buildQueryWithoutDietary(menuId);

    if (noDietaryError) {
      const dietaryFallbackInfo = detectMissingColumns(noDietaryError);
      if (dietaryFallbackInfo.isMissingDescription) {
        const descriptionError = noDietaryError as PostgrestError;
        logger.warn('[Menus API] Description column also not found, trying without it:', {
          error: noDietaryError.message,
          context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
        });

        const { data: itemsWithoutDescription, error: noDescriptionError } =
          await buildQueryWithoutDescription(menuId);

        if (noDescriptionError) {
          logDetailedError(
            noDescriptionError,
            'Database error fetching menu items (no description fallback failed)',
            menuId,
          );
          throw ApiErrorHandler.fromSupabaseError(noDescriptionError, 500);
        }

        return {
          items: (itemsWithoutDescription || []) as Partial<MenuItem>[],
          pricingError: null,
          dietaryError,
          descriptionError,
        };
      } else {
        logDetailedError(
          noDietaryError,
          'Database error fetching menu items (no dietary fallback failed)',
          menuId,
        );
        throw ApiErrorHandler.fromSupabaseError(noDietaryError, 500);
      }
    } else {
      return {
        items: (itemsWithoutDietary || []) as Partial<MenuItem>[],
        pricingError: null,
        dietaryError,
        descriptionError: null,
      };
    }
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
