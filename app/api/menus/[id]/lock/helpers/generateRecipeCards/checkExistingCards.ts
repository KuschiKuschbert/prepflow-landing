import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData } from '../fetchMenuItemData';
import { normalizeToSingleServing } from '../normalizeIngredients';
import { findExistingCardBySignature, getRecipeSignature } from '../cardManagement';
import { generateDataHash } from '../cardBuilding';
import { lookupMenuItemDataFromCache } from '../batchFetchMenuItemData';

interface ItemToGenerate {
  menuItem: any;
  menuItemData: MenuItemData;
  signature: string;
  existingCardId?: string;
}

interface CheckResult {
  itemsToGenerate: ItemToGenerate[];
  itemsToLink: Array<{ menuItemId: string; cardId: string }>;
  reusedCount: number;
  linkedCount: number;
}

/**
 * Checks for existing cards and determines which items need generation vs can reuse existing cards.
 *
 * @param {SupabaseClient} supabase - Supabase client instance.
 * @param {any[]} menuItems - Array of menu items to check.
 * @param {Map<string, MenuItemData>} menuItemDataCache - Cache of menu item data.
 * @param {boolean} crossReferencingEnabled - Whether cross-referencing is enabled.
 * @returns {Promise<CheckResult>} Result containing items to generate, items to link, and counts.
 */
export async function checkExistingCards(
  supabase: SupabaseClient,
  menuItems: any[],
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

    if (crossReferencingEnabled) {
      signature = getRecipeSignature(menuItemData, menuItem) || '';
      if (signature) {
        logger.dev(
          `[Card Reuse] Menu item ${menuItem.id} signature: ${signature} (dish_id: ${menuItem.dish_id}, recipe_id: ${menuItem.recipe_id})`,
        );

        const existingCard = await findExistingCardBySignature(supabase, signature, menuItem);
        if (existingCard) {
          logger.dev(
            `[Card Reuse] ✅ Found existing card ${existingCard.id} for signature ${signature}`,
          );
          const currentHash = generateDataHash(menuItemData, normalizedIngredients);
          logger.dev(
            `[Card Reuse] Comparing hashes - existing: ${existingCard.data_hash?.substring(0, 8) || 'none'}..., current: ${currentHash.substring(0, 8)}...`,
          );
          if (existingCard.data_hash === currentHash) {
            itemsToLink.push({ menuItemId: menuItem.id, cardId: existingCard.id });
            linkedCount++;
            logger.dev(
              `[Card Reuse] ✅ Linking menu item ${menuItem.id} to existing card ${existingCard.id} (signature: ${signature}, hash matches)`,
            );
            continue;
          } else {
            logger.dev(
              `[Card Reuse] ⚠️ Card exists but data changed for menu item ${menuItem.id} (hash mismatch), will regenerate and update existing card...`,
            );
            itemsToGenerate.push({
              menuItem,
              menuItemData,
              signature,
              existingCardId: existingCard.id,
            });
            continue;
          }
        } else {
          logger.dev(
            `[Card Reuse] ❌ No existing card found for signature ${signature} (dish_id: ${menuItem.dish_id}, recipe_id: ${menuItem.recipe_id}), falling back to old method check`,
          );
        }
      } else {
        logger.dev(
          `[Card Reuse] Could not determine signature for menu item ${menuItem.id}, falling back to old method`,
        );
      }
    }

    // Old method: check existing card by menu_item_id
    const currentHash = generateDataHash(menuItemData, normalizedIngredients);
    logger.dev(
      `[Card Reuse] Checking old method for menu item ${menuItem.id} (hash: ${currentHash.substring(0, 8)}...)`,
    );
    const { data: existingCardOld, error: cardError } = await supabase
      .from('menu_recipe_cards')
      .select('id, data_hash')
      .eq('menu_item_id', menuItem.id)
      .single();

    if (!cardError && existingCardOld) {
      logger.dev(
        `[Card Reuse] Found existing card ${existingCardOld.id} for menu_item_id ${menuItem.id}`,
      );
      logger.dev(
        `[Card Reuse] Comparing hashes - existing: ${existingCardOld.data_hash?.substring(0, 8) || 'none'}..., current: ${currentHash.substring(0, 8)}...`,
      );
      if (existingCardOld.data_hash === currentHash) {
        reusedCount++;
        logger.dev(
          `[Card Reuse] ✅ Reusing existing card ${existingCardOld.id} for menu item ${menuItem.id} (hash matches)`,
        );
      } else {
        logger.dev(
          `[Card Reuse] ⚠️ Card exists for menu item ${menuItem.id} but hash changed (old: ${existingCardOld.data_hash?.substring(0, 8) || 'none'}..., new: ${currentHash.substring(0, 8)}...), will regenerate`,
        );
        itemsToGenerate.push({ menuItem, menuItemData, signature });
      }
    } else {
      if (cardError && cardError.code === 'PGRST116') {
        logger.dev(
          `[Card Reuse] ❌ No existing card found for menu item ${menuItem.id} (PGRST116 - no rows), will generate new card`,
        );
      } else if (cardError) {
        logger.warn(
          `[Card Reuse] Error checking for existing card for menu item ${menuItem.id}:`,
          cardError,
        );
      } else {
        logger.dev(
          `[Card Reuse] ❌ No existing card found for menu item ${menuItem.id}, will generate new card`,
        );
      }
      itemsToGenerate.push({ menuItem, menuItemData, signature });
    }
  }

  return { itemsToGenerate, itemsToLink, reusedCount, linkedCount };
}
