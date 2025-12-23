import { ApiErrorHandler } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';
import { supabaseAdmin } from '@/lib/supabase';
import { buildSectionsMap, buildItemsByPrepListIdMap } from './buildMaps';
import { fetchIngredientsBatch } from './fetchIngredientsBatch';
import { combinePrepListData } from './combinePrepListData';

interface FetchPrepListsParams {
  userId: string | null;
  page: number;
  pageSize: number;
}
interface PrepListData {
  id: string;
  kitchen_section_id?: string;
  section_id?: string;
  name: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface KitchenSection {
  id: string;
  name?: string;
  section_name?: string;
  color?: string;
  color_code?: string;
}
interface PrepListItem {
  id: string;
  prep_list_id: string;
  ingredient_id: string;
  quantity?: number;
  quantity_needed?: number;
  unit: string;
  notes?: string;
}

interface Ingredient {
  id: string;
  ingredient_name?: string;
  name?: string;
  unit: string;
  category?: string;
}
export async function fetchPrepListsData({ userId, page, pageSize }: FetchPrepListsParams) {
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
  const { data: prepLists, error: prepListsError, count } = await prepListsQuery;

  // If user_id filter fails, try without it
  if (prepListsError && prepListsError.message?.includes('user_id')) {
    const fallbackQuery = supabaseAdmin
      .from('prep_lists')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);
    const fallbackResult = await fallbackQuery;

    if (fallbackResult.error) {
      logger.error('[Prep Lists API] Error fetching prep lists (fallback):', {
        error: fallbackResult.error.message,
        code: (fallbackResult.error as any).code,
        context: { endpoint: '/api/prep-lists', operation: 'GET', table: 'prep_lists' },
      });
      throw ApiErrorHandler.fromSupabaseError(fallbackResult.error, 500);
    }

    return {
      prepLists: (fallbackResult.data || []) as PrepListData[],
      count: fallbackResult.count || 0,
      empty: true,
    };
  }
  if (prepListsError) {
    logger.error('[Prep Lists API] Error fetching prep lists:', {
      error: prepListsError.message,
      code: (prepListsError as any).code,
      context: { endpoint: '/api/prep-lists', operation: 'GET', table: 'prep_lists' },
    });
    throw ApiErrorHandler.fromSupabaseError(prepListsError, 500);
  }

  if (!prepLists || prepLists.length === 0) {
    return {
      prepLists: [],
      count: count || 0,
      empty: true,
    };
  }

  return {
    prepLists: prepLists as PrepListData[],
    count: count || 0,
    empty: false,
  };
}

export async function fetchRelatedData(prepLists: PrepListData[]) {
  if (!supabaseAdmin) {
    logger.error('[Prep Lists API] Database connection not available for fetchRelatedData');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }

  const prepListIds = prepLists.map((list: any) => list.id);
  const sectionIds = prepLists
    .map((list: any) => list.kitchen_section_id || list.section_id)
    .filter(Boolean);
  // Step 2: Fetch all related data in parallel
  const [kitchenSectionsResult, prepListItemsResult] = await Promise.all([
    // Fetch kitchen sections
    sectionIds.length > 0
      ? supabaseAdmin
          .from('kitchen_sections')
          .select('id, name, section_name, color_code, color')
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
    logger.warn('[Prep Lists API] Error fetching kitchen sections (non-fatal):', {
      error: kitchenSectionsResult.error.message,
      code: (kitchenSectionsResult.error as any).code,
      sectionIds,
    });
  }

  if (prepListItemsResult.error) {
    logger.warn('[Prep Lists API] Error fetching prep list items (non-fatal):', {
      error: prepListItemsResult.error.message,
      code: (prepListItemsResult.error as any).code,
      prepListIds,
    });
  }

  const kitchenSections = (kitchenSectionsResult.data || []) as KitchenSection[];
  const prepListItems = (prepListItemsResult.data || []) as PrepListItem[];
  const sectionsMap = buildSectionsMap(kitchenSections);
  const itemsByPrepListId = buildItemsByPrepListIdMap(prepListItems);
  return { sectionsMap, itemsByPrepListId, prepListItems };
}
