import { Ingredient, KitchenSection, PrepList, PrepListItem } from '../types';

/**
 * Combine prep list data with related sections, items, and ingredients
 *
 * @param {PrepList[]} prepLists - Prep lists data
 * @param {Map<string, KitchenSection>} sectionsMap - Kitchen sections map by ID
 * @param {Map<string, PrepListItem[]>} itemsByPrepListId - Prep list items map by prep list ID
 * @param {Map<string, Ingredient>} ingredientsMap - Ingredients map by ID
 * @returns {any[]} Combined prep list data with nested relationships
 */
export function combinePrepListData(
  prepLists: PrepList[],
  sectionsMap: Map<string, KitchenSection>,
  itemsByPrepListId: Map<string, PrepListItem[]>,
  ingredientsMap: Map<string, Ingredient>,
) {
  return prepLists.map((list) => {
    const sectionId = list.kitchen_section_id || list.section_id;
    const items = itemsByPrepListId.get(list.id) || [];

    return {
      ...list,
      kitchen_section_id: sectionId,
      kitchen_sections: sectionId && sectionsMap.has(sectionId) ? sectionsMap.get(sectionId)! : null,
      prep_list_items: items.map((item) => ({
        ...item,
        quantity: item.quantity || item.quantity_needed,
        ingredients:
          item.ingredient_id && ingredientsMap.has(item.ingredient_id)
            ? ingredientsMap.get(item.ingredient_id)!
            : null,
      })),
    };
  });
}
