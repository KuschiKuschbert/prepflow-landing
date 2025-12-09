/**
 * Process menu items in parallel batches for recipe card generation
 */

import { chunkArray } from '@/lib/api/batch-utils';
import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { MenuItem } from './fetchMenuItems';
import { processMenuItem } from './processMenuItem';

interface ItemToGenerate {
  menuItem: MenuItem;
  menuItemData: any;
  signature: string;
  existingCardId?: string;
}

export interface BatchProcessResult {
  successCount: number;
  errorCount: number;
  errors: string[];
}

export async function processMenuItemBatches(
  supabase: SupabaseClient,
  itemsToProcess: MenuItem[],
  itemsToGenerate: ItemToGenerate[],
  processMenuItemFn: typeof processMenuItem,
  crossReferencingEnabled: boolean,
): Promise<BatchProcessResult> {
  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  const CONCURRENCY_LIMIT = 3;
  const batches = chunkArray(itemsToProcess, CONCURRENCY_LIMIT);

  const generationStartTime = Date.now();
  logger.dev(
    `[generateRecipeCardsForMenu] Processing ${itemsToProcess.length} items in parallel batches (${batches.length} batches of up to ${CONCURRENCY_LIMIT} items each) to balance speed and rate limits`,
  );

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchStartTime = Date.now();
    logger.dev(
      `[generateRecipeCardsForMenu] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} items) - START`,
    );

    const batchPromises = batch.map(async (menuItem, itemIndexInBatch) => {
      const globalIndex = batchIndex * CONCURRENCY_LIMIT + itemIndexInBatch;
      const itemData = itemsToGenerate.find(item => item.menuItem.id === menuItem.id);
      if (!itemData) {
        logger.warn(`Cannot find item data for menu item ${menuItem.id}`);
        return { success: false, error: 'Item data not found' };
      }

      const { menuItemData, signature, existingCardId } = itemData;

      logger.dev(
        `Processing menu item ${globalIndex + 1}/${itemsToProcess.length}: ${menuItem.id}`,
        {
          dish_id: menuItem.dish_id,
          recipe_id: menuItem.recipe_id,
          signature,
        },
      );

      return await processMenuItemFn(
        supabase,
        menuItem,
        menuItemData,
        signature,
        existingCardId,
        crossReferencingEnabled,
      );
    });

    const batchResults = await Promise.all(batchPromises);

    for (const result of batchResults) {
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        if (result.error) {
          errors.push(result.error);
        }
      }
    }

    const batchDuration = Date.now() - batchStartTime;
    const batchSuccessCount = batchResults.filter(r => r.success).length;
    const batchErrorCount = batchResults.filter(r => !r.success).length;
    logger.dev(
      `[generateRecipeCardsForMenu] Batch ${batchIndex + 1}/${batches.length} complete in ${batchDuration}ms: ${batchSuccessCount} succeeded, ${batchErrorCount} failed`,
    );

    if (batchIndex < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  const generationDuration = Date.now() - generationStartTime;
  logger.dev(`[generateRecipeCardsForMenu] All batches complete in ${generationDuration}ms`);

  return { successCount, errorCount, errors };
}
