import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { FetchPrepListsParams, KitchenSection, PrepList, PrepListItem } from '../types';
import { buildItemsByPrepListIdMap, buildSectionsMap } from './buildMaps';
import { combinePrepListData } from './combinePrepListData';
import { fetchIngredientsBatch } from './fetchIngredientsBatch';

// Re-export for use in route.ts
export { combinePrepListData, fetchIngredientsBatch };

interface PagedPrepListResult {
  prepLists: PrepList[];
  count: number;
  empty: boolean;
}

export async function fetchPrepListsData({
  userId,
  page,
  pageSize,
}: FetchPrepListsParams): Promise<PagedPrepListResult> {
  if (!supabaseAdmin) {
    logger.error('[Prep Lists API] Database connection not available for fetchPrepListsData');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  // Step 1: Fetch prep lists (simple query, no nested relationships)
  let prepListsQuery = supabaseAdmin
    .from('prep_lists')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (userId) prepListsQuery = prepListsQuery.eq('user_id', userId);
  else {
    // If no userId provided, return empty or throw error?
    // For multi-tenancy we MUST have userId.
    logger.warn('[Prep Lists API] No userId provided for fetchPrepListsData');
    return { prepLists: [], count: 0, empty: true };
  }

  const { data: prepLists, error: prepListsError, count } = await prepListsQuery;

  // REMOVED INSECURE FALLBACK

  if (prepListsError) {
    const pgError = prepListsError as PostgrestError;
    logger.error('[Prep Lists API] Error fetching prep lists:', {
      error: pgError.message,
      code: pgError.code,
      context: { endpoint: '/api/prep-lists', operation: 'GET', table: 'prep_lists' },
    });
    throw ApiErrorHandler.fromSupabaseError(pgError, 500);
  }

  if (!prepLists || prepLists.length === 0) {
    return {
      prepLists: [],
      count: count || 0,
      empty: true,
    };
  }

  return {
    prepLists: prepLists as PrepList[],
    count: count || 0,
    empty: false,
  };
}

export async function fetchRelatedData(prepLists: PrepList[]) {
  if (!supabaseAdmin) {
    logger.error('[Prep Lists API] Database connection not available for fetchRelatedData');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const prepListIds = prepLists.map(list => list.id);
  const sectionIds = prepLists
    .map(list => list.kitchen_section_id || list.section_id)
    .filter((id): id is string => Boolean(id));

  // Step 2: Fetch all related data in parallel
  const [kitchenSectionsResult, prepListItemsResult] = await Promise.all([
    // Fetch kitchen sections
    sectionIds.length > 0
      ? supabaseAdmin
          .from('kitchen_sections')
          .select('id, section_name, color_code, color')
          .in('id', sectionIds)
      : Promise.resolve({ data: [], error: null }),
    // Fetch prep list items
    prepListIds.length > 0
      ? supabaseAdmin
          .from('prep_list_items')
          .select('id, prep_list_id, ingredient_id, quantity, quantity_needed, unit, notes')
          .in('prep_list_id', prepListIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  // Check for errors in results
  if (kitchenSectionsResult.error) {
    const pgSectionError = kitchenSectionsResult.error as PostgrestError;
    logger.warn('[Prep Lists API] Error fetching kitchen sections (non-fatal):', {
      error: pgSectionError.message,
      code: pgSectionError.code,
      sectionIds,
    });
  }

  if (prepListItemsResult.error) {
    const pgItemsError = prepListItemsResult.error as PostgrestError;
    logger.warn('[Prep Lists API] Error fetching prep list items (non-fatal):', {
      error: pgItemsError.message,
      code: pgItemsError.code,
      prepListIds,
    });
  }

  const kitchenSections = (kitchenSectionsResult.data || []) as KitchenSection[];
  const prepListItems = (prepListItemsResult.data || []) as PrepListItem[];
  const sectionsMap = buildSectionsMap(kitchenSections);
  const itemsByPrepListId = buildItemsByPrepListIdMap(prepListItems);
  return { sectionsMap, itemsByPrepListId, prepListItems };
}

export async function fetchAllPrepListData(params: FetchPrepListsParams) {
  const { userId, page, pageSize } = params;
  const { prepLists, count, empty } = await fetchPrepListsData({ userId, page, pageSize });

  if (empty) {
    const totalPages = Math.max(1, Math.ceil(count / pageSize));
    const mappedPrepLists = prepLists.map(list => ({
      ...list,
      kitchen_section_id: list.kitchen_section_id || list.section_id,
      kitchen_sections: null,
      prep_list_items: [],
    }));
    return { items: mappedPrepLists, total: count, page, pageSize, totalPages };
  }

  const { sectionsMap, itemsByPrepListId, prepListItems } = await fetchRelatedData(prepLists);
  const ingredientIds = Array.from(
    new Set(
      prepListItems.map(item => item.ingredient_id).filter((id): id is string => Boolean(id)),
    ),
  );
  const ingredientsMap = await fetchIngredientsBatch(ingredientIds);
  const mappedData = combinePrepListData(prepLists, sectionsMap, itemsByPrepListId, ingredientsMap);
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  return { items: mappedData, total: count, page, pageSize, totalPages };
}
