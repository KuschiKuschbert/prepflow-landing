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

/**
 * Combine prep list data with related sections, items, and ingredients
 *
 * @param {PrepListData[]} prepLists - Prep lists data
 * @param {Map<string, any>} sectionsMap - Kitchen sections map by ID
 * @param {Map<string, PrepListItem[]>} itemsByPrepListId - Prep list items map by prep list ID
 * @param {Map<string, Ingredient>} ingredientsMap - Ingredients map by ID
 * @returns {any[]} Combined prep list data with nested relationships
 */
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
