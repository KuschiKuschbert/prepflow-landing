import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { lookupMenuItemDataFromCache } from '../batchFetchMenuItemData';
import { MenuItemData } from '../fetchMenuItemData';
import { normalizeToSingleServing } from '../normalizeIngredients';
import { checkByOldMethod } from './checkers/checkByOldMethod';
import { checkBySignature } from './checkers/checkBySignature';
import { MenuItem } from './fetchMenuItems';
import { CheckResult, ItemToGenerate } from './types';

// Re-export for backward compatibility
export type { CheckResult, ItemToGenerate } from './types';

/**
 * Checks for existing cards and determines which items need generation vs can reuse existing cards.
 *
 * @param {SupabaseClient} supabase - Supabase client instance.
 * @param {MenuItem[]} menuItems - Array of menu items to check.
 * @param {Map<string, MenuItemData>} menuItemDataCache - Cache of menu item data.
 * @param {boolean} crossReferencingEnabled - Whether cross-referencing is enabled.
 * @returns {Promise<CheckResult>} Result containing items to generate, items to link, and counts.
 */
export async function checkExistingCards(
  supabase: SupabaseClient,
  menuItems: MenuItem[],
  menuItemDataCache: Map<string, MenuItemData>,
  crossReferencingEnabled: boolean,
): Promise<CheckResult> {
  const itemsToGenerate: ItemToGenerate[] = [];
  const itemsToLink: Array<{ menuItemId: string; cardId: string }> = [];
  let reusedCount = 0;
  let linkedCount = 0;

  for (const menuItem of menuItems) {
    const menuItemData = lookupMenuItemDataFromCache(menuItemDataCache, menuItem);

    if (!menuItemData) {
      logger.warn(`Skipping menu item ${menuItem.id} - failed to fetch data from cache`);
      continue;
    }

    const normalizedIngredients = normalizeToSingleServing(menuItemData);
    if (normalizedIngredients.length === 0) {
      logger.warn(`Skipping menu item ${menuItem.id} - no ingredients found`);
      continue;
    }

    let signature = '';
    let handledBySignature = false;

    if (crossReferencingEnabled) {
      const result = await checkBySignature(
        supabase,
        menuItem,
        menuItemData,
        normalizedIngredients,
      );

      handledBySignature = result.handled;
      if (result.signature) {
        signature = result.signature;
      }

      if (result.handled) {
        if (result.action === 'link' && result.cardId) {
          itemsToLink.push({ menuItemId: menuItem.id, cardId: result.cardId });
          linkedCount++;
        } else if (result.action === 'generate' && result.itemToGenerate) {
          itemsToGenerate.push(result.itemToGenerate);
        }
        continue;
      }
    }

    // Old method: check existing card by menu_item_id
    const result = await checkByOldMethod(
      supabase,
      menuItem,
      menuItemData,
      normalizedIngredients,
      signature,
    );

    if (result.reused) {
      reusedCount++;
    } else if (result.itemToGenerate) {
      itemsToGenerate.push(result.itemToGenerate);
    }
  }

  return { itemsToGenerate, itemsToLink, reusedCount, linkedCount };
}
