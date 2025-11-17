import { supabaseAdmin } from '@/lib/supabase';

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
    throw new Error('Database connection not available');
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
      throw new Error(`Failed to fetch prep lists: ${fallbackResult.error.message}`);
    }

    return {
      prepLists: (fallbackResult.data || []) as PrepListData[],
      count: fallbackResult.count || 0,
      empty: true,
    };
  }
  if (prepListsError) {
    throw new Error(`Failed to fetch prep lists: ${prepListsError.message}`);
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
    throw new Error('Database connection not available');
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

  const kitchenSections = (kitchenSectionsResult.data || []) as KitchenSection[];
  const prepListItems = (prepListItemsResult.data || []) as PrepListItem[];
  // Build kitchen sections map
  const sectionsMap = new Map();
  kitchenSections.forEach((section: any) => {
    sectionsMap.set(section.id, {
      id: section.id,
      name: section.name || section.section_name,
      color: section.color || section.color_code || '#29E7CD',
    });
  });

  // Build prep list items map
  const itemsByPrepListId = new Map();
  prepListItems.forEach((item: any) => {
    if (!itemsByPrepListId.has(item.prep_list_id)) {
      itemsByPrepListId.set(item.prep_list_id, []);
    }
    itemsByPrepListId.get(item.prep_list_id).push(item);
  });
  return { sectionsMap, itemsByPrepListId, prepListItems };
}

export async function fetchIngredientsBatch(ingredientIds: string[]) {
  if (!supabaseAdmin || ingredientIds.length === 0) {
    return new Map();
  }

  const ingredientsMap = new Map();
  // Fetch in batches of 100
  for (let i = 0; i < ingredientIds.length; i += 100) {
    const batch = ingredientIds.slice(i, i + 100);
    const { data: ingredientsData } = await supabaseAdmin
      .from('ingredients')
      .select('id, ingredient_name, name, unit, category')
      .in('id', batch);

    if (ingredientsData) {
      ingredientsData.forEach((ing: any) => {
        ingredientsMap.set(ing.id, {
          id: ing.id,
          name: ing.ingredient_name || ing.name,
          unit: ing.unit,
          category: ing.category,
        });
      });
    }
  }

  return ingredientsMap;
}
export function combinePrepListData(
  prepLists: PrepListData[],
  sectionsMap: Map<string, any>,
  itemsByPrepListId: Map<string, PrepListItem[]>,
  ingredientsMap: Map<string, Ingredient>,
) {
  return prepLists.map((list: any) => {
    const sectionId = list.kitchen_section_id || list.section_id;
    const items = itemsByPrepListId.get(list.id) || [];

    return {
      ...list,
      kitchen_section_id: sectionId,
      kitchen_sections: sectionId ? sectionsMap.get(sectionId) || null : null,
      prep_list_items: items.map((item: any) => ({
        ...item,
        quantity: item.quantity || item.quantity_needed,
        ingredients: item.ingredient_id ? ingredientsMap.get(item.ingredient_id) || null : null,
      })),
    };
  });
}
