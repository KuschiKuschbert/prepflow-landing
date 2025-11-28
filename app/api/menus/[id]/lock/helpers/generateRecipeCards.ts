/**
 * Generate Recipe Cards for Menu
 * Main orchestrator for generating recipe cards for all menu items when menu is locked
 */

import { chunkArray } from '@/lib/api/batch-utils';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { batchFetchAllMenuItemData, lookupMenuItemDataFromCache } from './batchFetchMenuItemData';
import { buildRecipeCardFromInstructions, generateDataHash } from './cardBuilding';
import {
  findExistingCardBySignature,
  getRecipeSignature,
  linkMenuItemToCard,
} from './cardManagement';
import { MenuItemData } from './fetchMenuItemData';
import { consolidateInstructions, normalizeToSingleServing } from './normalizeIngredients';
import { generateSubRecipeCards } from './subRecipeCardGeneration';

/**
 * Generate recipe cards for all menu items in a menu
 */
export async function generateRecipeCardsForMenu(menuId: string) {
  const startTime = Date.now();
  logger.dev(`[generateRecipeCardsForMenu] START - Menu ID: ${menuId}`);
  const supabase = createSupabaseAdmin();

  // Check if migration has been run by testing if recipe_id column exists
  let crossReferencingEnabled = false;
  try {
    const { error: testError } = await supabase
      .from('menu_recipe_cards')
      .select('recipe_id')
      .limit(0);

    // If no error (or error is about no rows, not missing column), migration is run
    if (
      !testError ||
      (testError.code !== '42703' &&
        !testError.message?.includes('column') &&
        !testError.message?.includes('does not exist'))
    ) {
      crossReferencingEnabled = true;
      logger.dev('Cross-referencing enabled - migration detected');
    } else {
      logger.dev('Cross-referencing disabled - migration not run, using old method');
    }
  } catch (err) {
    logger.dev('Could not determine migration status, using old method:', err);
    crossReferencingEnabled = false;
  }

  // Fetch all menu items for the menu
  const { data: menuItems, error: itemsError } = await supabase
    .from('menu_items')
    .select('id, dish_id, recipe_id')
    .eq('menu_id', menuId);

  if (itemsError || !menuItems) {
    logger.error('Failed to fetch menu items for recipe card generation', itemsError);
    return;
  }

  if (menuItems.length === 0) {
    logger.info(`No menu items found for menu ${menuId}`);
    return;
  }

  logger.dev(`Generating recipe cards for ${menuItems.length} menu items`);

  // Check if any existing cards exist for these menu items (for debugging)
  const menuItemIds = menuItems.map(mi => mi.id);
  const { data: existingCardsCheck, error: checkError } = await supabase
    .from('menu_recipe_cards')
    .select('id, menu_item_id, data_hash')
    .in('menu_item_id', menuItemIds);

  if (checkError) {
    logger.warn(`Error checking for existing cards:`, checkError);
  } else {
    logger.dev(
      `Found ${existingCardsCheck?.length || 0} existing cards for ${menuItems.length} menu items`,
    );
    if (existingCardsCheck && existingCardsCheck.length > 0) {
      logger.dev(
        `Existing card menu_item_ids: ${existingCardsCheck.map(c => c.menu_item_id).join(', ')}`,
      );
    }
  }

  // Batch fetch all dishes and recipes upfront (reduces DB queries from N to 2-3)
  const menuItemDataCache = await batchFetchAllMenuItemData(supabase, menuItems);
  logger.dev(`Batch fetched ${menuItemDataCache.size} items for caching`);

  // Build menu item name map for sub-recipe cross-referencing
  const menuItemNameMap = new Map<string, string>();
  for (const menuItem of menuItems) {
    const menuItemData = lookupMenuItemDataFromCache(menuItemDataCache, menuItem);
    if (menuItemData) {
      menuItemNameMap.set(menuItem.id, menuItemData.name);
    }
  }

  // Track which items need generation vs can reuse existing cards
  const itemsToGenerate: Array<{
    menuItem: any;
    menuItemData: MenuItemData;
    signature: string;
    existingCardId?: string;
  }> = [];
  const itemsToLink: Array<{ menuItemId: string; cardId: string }> = [];
  let reusedCount = 0;
  let linkedCount = 0;

  // Check each menu item for cross-referencing opportunities
  for (const menuItem of menuItems) {
    const menuItemData = lookupMenuItemDataFromCache(menuItemDataCache, menuItem);

    if (!menuItemData) {
      logger.warn(`Skipping menu item ${menuItem.id} - failed to fetch data from cache`);
      continue;
    }

    // Normalize ingredients to generate hash
    const normalizedIngredients = normalizeToSingleServing(menuItemData);
    if (normalizedIngredients.length === 0) {
      logger.warn(`Skipping menu item ${menuItem.id} - no ingredients found`);
      continue;
    }

    // Track signature for this menu item (used for cross-referencing and preserving when generating)
    let signature = '';

    // Use cross-referencing only if migration has been run
    if (crossReferencingEnabled) {
      // Calculate recipe signature for cross-referencing
      signature = getRecipeSignature(menuItemData, menuItem) || '';
      if (signature) {
        logger.dev(
          `[Card Reuse] Menu item ${menuItem.id} signature: ${signature} (dish_id: ${menuItem.dish_id}, recipe_id: ${menuItem.recipe_id})`,
        );

        // Check if card exists by signature (cross-referencing)
        logger.dev(`[Card Reuse] Searching for existing card with signature ${signature}...`);
        const existingCard = await findExistingCardBySignature(supabase, signature, menuItem);
        if (existingCard) {
          logger.dev(
            `[Card Reuse] ✅ Found existing card ${existingCard.id} for signature ${signature}`,
          );
          // Card exists - check if data hash matches (data hasn't changed)
          const currentHash = generateDataHash(menuItemData, normalizedIngredients);
          logger.dev(
            `[Card Reuse] Comparing hashes - existing: ${existingCard.data_hash?.substring(0, 8) || 'none'}..., current: ${currentHash.substring(0, 8)}...`,
          );
          if (existingCard.data_hash === currentHash) {
            // Data hasn't changed, link to existing card
            itemsToLink.push({ menuItemId: menuItem.id, cardId: existingCard.id });
            linkedCount++;
            logger.dev(
              `[Card Reuse] ✅ Linking menu item ${menuItem.id} to existing card ${existingCard.id} (signature: ${signature}, hash matches)`,
            );
            continue;
          } else {
            // Data changed - need to regenerate card (will update existing card)
            logger.dev(
              `[Card Reuse] ⚠️ Card exists but data changed for menu item ${menuItem.id} (hash mismatch), will regenerate and update existing card...`,
            );
            // Add to generation list - the save logic will update the existing card
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
          // Fall through to old method check - cards created before migration won't have signature
        }
      } else {
        logger.dev(
          `[Card Reuse] Could not determine signature for menu item ${menuItem.id}, falling back to old method`,
        );
      }
    }

    // Old method: check existing card by menu_item_id (also used as fallback when cross-referencing enabled but no card found)
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
      // Card exists - check if hash matches
      logger.dev(
        `[Card Reuse] Comparing hashes - existing: ${existingCardOld.data_hash?.substring(0, 8) || 'none'}..., current: ${currentHash.substring(0, 8)}...`,
      );
      if (existingCardOld.data_hash === currentHash) {
        // Data hasn't changed, reuse existing card
        reusedCount++;
        logger.dev(
          `[Card Reuse] ✅ Reusing existing card ${existingCardOld.id} for menu item ${menuItem.id} (hash matches)`,
        );
      } else {
        // Data changed - need to regenerate (preserve signature if we have one)
        logger.dev(
          `[Card Reuse] ⚠️ Card exists for menu item ${menuItem.id} but hash changed (old: ${existingCardOld.data_hash?.substring(0, 8) || 'none'}..., new: ${currentHash.substring(0, 8)}...), will regenerate`,
        );
        itemsToGenerate.push({ menuItem, menuItemData, signature });
      }
    } else {
      // Card doesn't exist or error occurred
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
      // Generate new card (preserve signature if we have one from cross-referencing)
      itemsToGenerate.push({ menuItem, menuItemData, signature });
    }
  }

  const checkTime = Date.now() - startTime;
  logger.dev(
    `[generateRecipeCardsForMenu] Card reuse check complete in ${checkTime}ms: ${linkedCount} items linked to existing cards, ${itemsToGenerate.length} items need generation, ${reusedCount} reused (old method)`,
  );

  // Link menu items to existing cards
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

  // Filter menu items to only process those that need generation
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

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Process items in parallel batches to balance speed and rate limits
  // Process 3 items concurrently to avoid rate limits while maintaining performance
  const CONCURRENCY_LIMIT = 3;
  const batches = chunkArray(itemsToProcess, CONCURRENCY_LIMIT);

  const generationStartTime = Date.now();
  logger.dev(
    `[generateRecipeCardsForMenu] Processing ${itemsToProcess.length} items in parallel batches (${batches.length} batches of up to ${CONCURRENCY_LIMIT} items each) to balance speed and rate limits`,
  );

  // Process each batch in parallel
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    const batchStartTime = Date.now();
    logger.dev(
      `[generateRecipeCardsForMenu] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} items) - START`,
    );

    // Process all items in this batch in parallel
    const batchPromises = batch.map(async (menuItem, itemIndexInBatch) => {
      const globalIndex = batchIndex * CONCURRENCY_LIMIT + itemIndexInBatch;

      // Find the corresponding item data from itemsToGenerate
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

      try {
        logger.dev(`Looked up data for menu item ${menuItem.id} from cache:`, {
          hasData: !!menuItemData,
          name: menuItemData?.name,
          type: menuItemData?.type,
          ingredientCount: menuItemData?.directIngredients?.length || 0,
          subRecipeCount: menuItemData?.subRecipes?.length || 0,
        });

        if (!menuItemData) {
          const errorMsg = `Skipping menu item ${menuItem.id} - failed to fetch data from cache (no dish_id or recipe_id?)`;
          logger.warn(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Normalize all ingredients to single serving
        logger.dev(`Normalizing ingredients for ${menuItemData.name}...`);
        const normalizedIngredients = normalizeToSingleServing(menuItemData);
        logger.dev(`Normalized ingredients for ${menuItemData.name}:`, {
          count: normalizedIngredients.length,
          ingredients: normalizedIngredients
            .slice(0, 3)
            .map(i => `${i.name} (${i.quantity} ${i.unit})`),
        });

        if (normalizedIngredients.length === 0) {
          const errorMsg = `Skipping menu item ${menuItemData.name} - no ingredients found after normalization`;
          logger.warn(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Consolidate instructions from main item and sub-recipes
        const existingInstructions = consolidateInstructions(menuItemData);

        // Build card manually from existing instructions (or empty if none available)
        // Always generate a card, even if instructions are empty
        const hasInstructions = existingInstructions.trim().length > 0;
        if (hasInstructions) {
          logger.dev(
            `Using existing instructions for ${menuItemData.name} (skipping AI generation)`,
          );
        } else {
          logger.dev(
            `No instructions available for ${menuItemData.name} - generating card with empty method steps`,
          );
        }

        const parsedCard = buildRecipeCardFromInstructions(
          menuItemData,
          normalizedIngredients,
          existingInstructions,
        );
        logger.dev(
          `Built recipe card manually for ${menuItemData.name}: ${parsedCard.methodSteps.length} method steps`,
        );

        // Safety check - should never happen since buildRecipeCardFromInstructions always returns a card
        if (!parsedCard) {
          const errorMsg = `Failed to build recipe card for ${menuItemData.name} - unexpected error`;
          logger.error(errorMsg);
          return { success: false, error: errorMsg };
        }

        // Generate data hash for this card
        const dataHash = generateDataHash(menuItemData, normalizedIngredients);

        // Store structured data in database
        const cardContent = {
          raw_text: existingInstructions, // Store original instructions as raw text
          generated_at: new Date().toISOString(),
          generated_by: 'manual', // Indicate this was built manually, not by AI
        };

        // Prepare card data - start with required fields
        const cardData: any = {
          card_content: cardContent,
          title: parsedCard.title,
          base_yield: parsedCard.baseYield || 1, // Use parsed yield or default to 1
          ingredients: parsedCard.ingredients,
          method_steps: parsedCard.methodSteps,
          notes: parsedCard.notes.length > 0 ? parsedCard.notes.join('\n') : null,
          data_hash: dataHash, // Store hash for future comparison
          parsed_at: new Date().toISOString(),
        };

        // Always set menu_item_id (required by database NOT NULL constraint)
        cardData.menu_item_id = menuItem.id;

        // Add cross-referencing fields only if migration has been run
        if (crossReferencingEnabled && signature) {
          cardData.recipe_signature = signature;
          if (menuItem.recipe_id) {
            cardData.recipe_id = menuItem.recipe_id;
          } else if (menuItem.dish_id) {
            cardData.dish_id = menuItem.dish_id;
          }
        }

        // Save card - use appropriate method based on migration status
        let savedCardId: string;

        if (crossReferencingEnabled && existingCardId) {
          // Update existing card (cross-referencing method)
          const { data: updatedCard, error: updateError } = await supabase
            .from('menu_recipe_cards')
            .update(cardData)
            .eq('id', existingCardId)
            .select('id')
            .single();

          if (updateError) {
            const errorMsg = `Failed to update card for ${menuItemData.name}: ${updateError.message || String(updateError)}`;
            logger.error(`Failed to update recipe card for item ${menuItem.id}:`, updateError);
            return { success: false, error: errorMsg };
          }

          savedCardId = updatedCard?.id || existingCardId;
        } else if (crossReferencingEnabled) {
          // Check if card exists by signature
          const existingCard = await findExistingCardBySignature(supabase, signature, menuItem);
          if (existingCard) {
            // Update existing card
            const { data: updatedCard, error: updateError } = await supabase
              .from('menu_recipe_cards')
              .update(cardData)
              .eq('id', existingCard.id)
              .select('id')
              .single();

            if (updateError) {
              const errorMsg = `Failed to update card for ${menuItemData.name}: ${updateError.message || String(updateError)}`;
              logger.error(`Failed to update recipe card for item ${menuItem.id}:`, updateError);
              return { success: false, error: errorMsg };
            }

            savedCardId = updatedCard?.id || existingCard.id;
          } else {
            // Insert new card
            const { data: insertedCard, error: insertError } = await supabase
              .from('menu_recipe_cards')
              .insert(cardData)
              .select('id')
              .single();

            if (insertError) {
              const errorMsg = `Failed to save card for ${menuItemData.name}: ${insertError.message || String(insertError)}`;
              logger.error(`Failed to save recipe card for item ${menuItem.id}:`, insertError);
              return { success: false, error: errorMsg };
            }

            if (!insertedCard?.id) {
              const errorMsg = `Failed to save card for ${menuItemData.name}: No ID returned`;
              logger.error(`Failed to save recipe card for item ${menuItem.id}: No ID returned`);
              return { success: false, error: errorMsg };
            }

            savedCardId = insertedCard.id;
          }
        } else {
          // Old method: upsert by menu_item_id
          const { data: savedCard, error: saveError } = await supabase
            .from('menu_recipe_cards')
            .upsert(cardData, {
              onConflict: 'menu_item_id',
            })
            .select('id')
            .single();

          if (saveError) {
            const errorMsg = `Failed to save card for ${menuItemData.name}: ${saveError.message || String(saveError)}`;
            logger.error(`Failed to save recipe card for item ${menuItem.id}:`, saveError);
            return { success: false, error: errorMsg };
          }

          if (!savedCard?.id) {
            const errorMsg = `Failed to save card for ${menuItemData.name}: No ID returned`;
            logger.error(`Failed to save recipe card for item ${menuItem.id}: No ID returned`);
            return { success: false, error: errorMsg };
          }

          savedCardId = savedCard.id;
        }

        // Link menu item to card (only if cross-referencing is enabled)
        if (crossReferencingEnabled) {
          await linkMenuItemToCard(supabase, menuItem.id, savedCardId);
        }

        logger.dev(`Successfully generated recipe card for ${menuItemData.name}`);
        return { success: true };
      } catch (err) {
        const errorMsg = `Error for menu item ${menuItem.id}: ${err instanceof Error ? err.message : String(err)}`;
        logger.error(`Error generating recipe card for menu item ${menuItem.id}:`, err);
        return { success: false, error: errorMsg };
      }
    });

    // Wait for all items in this batch to complete
    const batchResults = await Promise.all(batchPromises);

    // Aggregate results from this batch
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

    // Small delay between batches to avoid rate limits (except for last batch)
    // Processing in parallel batches, so shorter delay is sufficient
    if (batchIndex < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between batches
    }
  }

  const generationDuration = Date.now() - generationStartTime;
  logger.dev(`[generateRecipeCardsForMenu] All batches complete in ${generationDuration}ms`);

  const skippedCount = itemsToProcess.length - successCount - errorCount;
  logger.dev(`Finished generating recipe cards for menu ${menuId}`, {
    reusedCount,
    successCount,
    errorCount,
    skippedCount,
    totalItems: menuItems.length,
    regeneratedItems: itemsToProcess.length,
    reusedItems: reusedCount,
    errors: errors.length > 0 ? errors.slice(0, 5) : undefined, // Limit to first 5 errors
  });

  // Check for billing errors specifically
  const hasBillingError = errors.some(
    err =>
      err.toLowerCase().includes('account is not active') ||
      err.toLowerCase().includes('billing') ||
      err.toLowerCase().includes('payment') ||
      err.toLowerCase().includes('subscription'),
  );

  // Throw error if no cards were generated successfully (and we had items to process)
  if (successCount === 0 && itemsToProcess.length > 0) {
    let errorMessage: string;
    if (hasBillingError) {
      errorMessage = `Failed to generate recipe cards: OpenAI account billing issue detected. Please check your OpenAI account billing details and ensure the account is active. This is not a rate limit issue - the account needs to be activated.`;
    } else {
      errorMessage = `Failed to generate any recipe cards. Processed ${itemsToProcess.length} items: ${successCount} succeeded, ${errorCount} errors, ${skippedCount} skipped.${errors.length > 0 ? ` First error: ${errors[0]}` : ' No errors logged - items may have been skipped silently (check if dishes/recipes have ingredients).'}`;
    }
    logger.error(errorMessage, {
      successCount,
      errorCount,
      skippedCount,
      totalItems: menuItems.length,
      sampleErrors: errors.slice(0, 3),
      hasBillingError,
    });
    throw new Error(errorMessage);
  }

  // Generate sub-recipe cards after main cards are complete
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
    // Don't fail main generation if sub-recipe generation fails
    logger.error(
      `[generateRecipeCardsForMenu] Sub-recipe card generation failed (non-blocking):`,
      subRecipeError,
    );
  }

  const totalTime = Date.now() - startTime;
  if (successCount > 0 || reusedCount > 0) {
    logger.dev(
      `[generateRecipeCardsForMenu] Recipe cards complete in ${totalTime}ms: ${successCount} generated, ${reusedCount} reused, ${linkedCount} linked out of ${menuItems.length} total menu items`,
    );
  } else {
    logger.warn(`[generateRecipeCardsForMenu] No cards generated or reused after ${totalTime}ms`);
  }
}
