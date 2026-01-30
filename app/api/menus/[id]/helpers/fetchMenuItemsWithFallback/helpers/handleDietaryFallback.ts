import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { PostgrestError } from '@supabase/supabase-js';
import { MenuItem } from '../../../../helpers/schemas';
import { detectMissingColumns } from '../../errorDetection/detectMissingColumns';
import { logDetailedError } from '../../fetchMenuWithItems.helpers';
import {
  buildQueryWithoutDescription,
  buildQueryWithoutDietary,
} from '../../queryBuilders/menuItemQueries';
import { FetchResult } from '../../types';

export async function handleDietaryFallback(
  dietaryError: PostgrestError,
  menuId: string,
): Promise<FetchResult> {
  logger.warn('[Menus API] Dietary/allergen columns not found, trying without them:', {
    error: dietaryError.message,
    context: { endpoint: '/api/menus/[id]', operation: 'GET', menuId },
  });

  const { data: itemsWithoutDietary, error: noDietaryError } =
    await buildQueryWithoutDietary(menuId);

  if (!noDietaryError) {
    return {
      items: (itemsWithoutDietary || []) as Partial<MenuItem>[],
      pricingError: null,
      dietaryError,
      descriptionError: null,
    };
  }

  const dietaryFallbackInfo = detectMissingColumns(noDietaryError);
  if (!dietaryFallbackInfo.isMissingDescription) {
    logDetailedError(
      noDietaryError,
      'Database error fetching menu items (no dietary fallback failed)',
      menuId,
    );
    throw ApiErrorHandler.fromSupabaseError(noDietaryError, 500);
  }

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
}
