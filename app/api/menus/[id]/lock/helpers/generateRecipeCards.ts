/**
 * Generate Recipe Cards for Menu
 * Main orchestrator for generating recipe cards for all menu items when menu is locked
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { batchFetchAllMenuItemData, lookupMenuItemDataFromCache } from './batchFetchMenuItemData';
import { linkMenuItemToCard } from './cardManagement';
import { generateSubRecipeCards } from './subRecipeCardGeneration';
import { checkCrossReferencingEnabled } from './generateRecipeCards/checkMigration';
import { checkExistingCards } from './generateRecipeCards/checkExistingCards';
import { processMenuItem } from './generateRecipeCards/processMenuItem';
import { fetchMenuItems } from './generateRecipeCards/fetchMenuItems';
import { processMenuItemBatches } from './generateRecipeCards/processBatches';
import { handleGenerationErrors } from './generateRecipeCards/handleErrors';

/**
 * Generate recipe cards for all menu items in a menu
 */
export async function generateRecipeCardsForMenu(menuId: string) {
  const startTime = Date.now();
  logger.dev(`[generateRecipeCardsForMenu] START - Menu ID: ${menuId}`);
  const supabase = createSupabaseAdmin();

  const crossReferencingEnabled = await checkCrossReferencingEnabled(supabase);

  const menuItems = await fetchMenuItems(supabase, menuId);
  if (!menuItems || menuItems.length === 0) {
    return;
  }

  const menuItemDataCache = await batchFetchAllMenuItemData(supabase, menuItems);
  logger.dev(`Batch fetched ${menuItemDataCache.size} items for caching`);

  const menuItemNameMap = new Map<string, string>();
  for (const menuItem of menuItems) {
    const menuItemData = lookupMenuItemDataFromCache(menuItemDataCache, menuItem);
    if (menuItemData) {
      menuItemNameMap.set(menuItem.id, menuItemData.name);
    }
  }

  const checkResult = await checkExistingCards(
    supabase,
    menuItems,
    menuItemDataCache,
    crossReferencingEnabled,
  );
  const { itemsToGenerate, itemsToLink, reusedCount, linkedCount } = checkResult;

  const checkTime = Date.now() - startTime;
  logger.dev(
    `[generateRecipeCardsForMenu] Card reuse check complete in ${checkTime}ms: ${linkedCount} items linked to existing cards, ${itemsToGenerate.length} items need generation, ${reusedCount} reused (old method)`,
  );

  if (itemsToLink.length > 0) {
    logger.dev(
      `[generateRecipeCardsForMenu] Linking ${itemsToLink.length} menu items to existing cards...`,
    );
    const linkStartTime = Date.now();
    for (const link of itemsToLink) {
      await linkMenuItemToCard(supabase, link.menuItemId, link.cardId);
    }
    logger.dev(`[generateRecipeCardsForMenu] Linking complete in ${Date.now() - linkStartTime}ms`);
  }

  const itemsToProcess = itemsToGenerate.map(item => item.menuItem);

  if (itemsToProcess.length === 0) {
    const totalTime = Date.now() - startTime;
    logger.dev(
      `[generateRecipeCardsForMenu] All recipe cards are up to date, no regeneration needed. Total time: ${totalTime}ms`,
    );
    return;
  }

  logger.dev(
    `[generateRecipeCardsForMenu] Starting generation for ${itemsToProcess.length} items (${menuItems.length - itemsToProcess.length} already have cards)`,
  );

  const batchResult = await processMenuItemBatches(
    supabase,
    itemsToProcess,
    itemsToGenerate,
    processMenuItem,
    crossReferencingEnabled,
  );

  const skippedCount = itemsToProcess.length - batchResult.successCount - batchResult.errorCount;
  handleGenerationErrors(
    batchResult.successCount,
    batchResult.errorCount,
    skippedCount,
    itemsToProcess,
    menuItems.length,
    reusedCount,
    batchResult.errors,
  );

  try {
    logger.dev(`[generateRecipeCardsForMenu] Starting sub-recipe card generation...`);
    const subRecipeStartTime = Date.now();
    const subRecipeResults = await generateSubRecipeCards(
      supabase,
      menuId,
      menuItems,
      menuItemDataCache,
      menuItemNameMap,
      crossReferencingEnabled,
    );
    const subRecipeDuration = Date.now() - subRecipeStartTime;
    logger.dev(
      `[generateRecipeCardsForMenu] Sub-recipe cards complete in ${subRecipeDuration}ms: ${subRecipeResults.successCount} succeeded, ${subRecipeResults.errorCount} failed`,
    );
  } catch (subRecipeError) {
    logger.error(
      `[generateRecipeCardsForMenu] Sub-recipe card generation failed (non-blocking):`,
      subRecipeError,
    );
  }

  const totalTime = Date.now() - startTime;
  if (batchResult.successCount > 0 || reusedCount > 0) {
    logger.dev(
      `[generateRecipeCardsForMenu] Recipe cards complete in ${totalTime}ms: ${batchResult.successCount} generated, ${reusedCount} reused, ${linkedCount} linked out of ${menuItems.length} total menu items`,
    );
  } else {
    logger.warn(`[generateRecipeCardsForMenu] No cards generated or reused after ${totalTime}ms`);
  }
}
