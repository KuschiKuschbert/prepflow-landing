import { KitchenSection, PrepListItem } from '../types';

/**
 * Build kitchen sections map from sections array
 *
 * @param {KitchenSection[]} kitchenSections - Kitchen sections data
 * @returns {Map<string, KitchenSection>} Sections map by ID
 */
export function buildSectionsMap(kitchenSections: KitchenSection[]): Map<string, KitchenSection> {
  const sectionsMap = new Map<string, KitchenSection>();
  kitchenSections.forEach(section => {
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
  const itemsByPrepListId = new Map<string, PrepListItem[]>();
  prepListItems.forEach(item => {
    if (!itemsByPrepListId.has(item.prep_list_id)) {
      itemsByPrepListId.set(item.prep_list_id, []);
    }
    itemsByPrepListId.get(item.prep_list_id)!.push(item);
  });
  return itemsByPrepListId;
}
