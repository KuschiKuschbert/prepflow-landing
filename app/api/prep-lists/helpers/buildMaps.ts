interface PrepListItem {
  id: string;
  prep_list_id: string;
  ingredient_id: string;
  quantity?: number;
  quantity_needed?: number;
  unit: string;
  notes?: string;
}

interface KitchenSection {
  id: string;
  name?: string;
  section_name?: string;
  color?: string;
  color_code?: string;
}

/**
 * Build kitchen sections map from sections array
 *
 * @param {KitchenSection[]} kitchenSections - Kitchen sections data
 * @returns {Map<string, any>} Sections map by ID
 */
export function buildSectionsMap(kitchenSections: KitchenSection[]): Map<string, any> {
  const sectionsMap = new Map();
  kitchenSections.forEach((section: any) => {
    sectionsMap.set(section.id, {
      id: section.id,
      name: section.name || section.section_name,
      color: section.color || section.color_code || '#29E7CD',
    });
  });
  return sectionsMap;
}

/**
 * Build prep list items map grouped by prep_list_id
 *
 * @param {PrepListItem[]} prepListItems - Prep list items data
 * @returns {Map<string, PrepListItem[]>} Items map by prep list ID
 */
export function buildItemsByPrepListIdMap(
  prepListItems: PrepListItem[],
): Map<string, PrepListItem[]> {
  const itemsByPrepListId = new Map();
  prepListItems.forEach((item: any) => {
    if (!itemsByPrepListId.has(item.prep_list_id)) {
      itemsByPrepListId.set(item.prep_list_id, []);
    }
    itemsByPrepListId.get(item.prep_list_id).push(item);
  });
  return itemsByPrepListId;
}
