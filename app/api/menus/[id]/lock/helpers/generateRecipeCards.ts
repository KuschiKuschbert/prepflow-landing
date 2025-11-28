/**
 * Generate Recipe Cards for Menu
 * Automatically generates professional recipe cards for all menu items when menu is locked
 */

import { generateAIResponse } from '@/lib/ai/ai-service';
import { chunkArray } from '@/lib/api/batch-utils';
import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { createHash } from 'crypto';
import { batchFetchAllMenuItemData, lookupMenuItemDataFromCache } from './batchFetchMenuItemData';
import { MenuItemData, MenuItemSubRecipe } from './fetchMenuItemData';
import {
  consolidateInstructions,
  NormalizedIngredient,
  normalizeToSingleServing,
} from './normalizeIngredients';
import { ParsedRecipeCard } from './parseRecipeCard';

/**
 * Sub-recipe type categories
 */
export type SubRecipeType = 'sauces' | 'marinades' | 'brines' | 'slowCooked' | 'other';

/**
 * Categorize a sub-recipe by its name using keyword matching
 */
function categorizeSubRecipe(recipeName: string): SubRecipeType {
  const nameLower = recipeName.toLowerCase();

  // Sauce keywords
  if (
    nameLower.includes('sauce') ||
    nameLower.includes('dressing') ||
    nameLower.includes('aioli') ||
    nameLower.includes('mayo') ||
    nameLower.includes('mayonnaise') ||
    nameLower.includes('vinaigrette') ||
    nameLower.includes('relish') ||
    nameLower.includes('chutney')
  ) {
    return 'sauces';
  }

  // Marinade keywords
  if (nameLower.includes('marinade') || nameLower.includes('marinated')) {
    return 'marinades';
  }

  // Brine keywords
  if (nameLower.includes('brine') || nameLower.includes('brined')) {
    return 'brines';
  }

  // Slow-cooked keywords
  if (
    nameLower.includes('slow') ||
    nameLower.includes('braised') ||
    nameLower.includes('confit') ||
    nameLower.includes('braise') ||
    nameLower.includes('slow-cooked') ||
    nameLower.includes('slow cooked')
  ) {
    return 'slowCooked';
  }

  // Default to other
  return 'other';
}

/**
 * Collected sub-recipe with metadata
 */
export interface CollectedSubRecipe {
  subRecipe: MenuItemSubRecipe;
  recipeId: string;
  type: SubRecipeType;
  usedByMenuItems: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number; // Quantity of recipe servings needed per menu item serving
  }>;
}

/**
 * Collect unique sub-recipes from all menu items
 * Deduplicates by recipeId and tracks which menu items use each sub-recipe
 */
function collectUniqueSubRecipes(
  menuItems: Array<{ id: string; dish_id?: string | null; recipe_id?: string | null }>,
  menuItemDataCache: Map<string, MenuItemData>,
  menuItemNameMap: Map<string, string>,
): CollectedSubRecipe[] {
  const subRecipeMap = new Map<string, CollectedSubRecipe>();

  // Iterate through all menu items
  for (const menuItem of menuItems) {
    const menuItemData = lookupMenuItemDataFromCache(menuItemDataCache, menuItem);
    if (!menuItemData) continue;

    const menuItemName = menuItemNameMap.get(menuItem.id) || menuItemData.name;

    // Process each sub-recipe in this menu item
    for (const subRecipe of menuItemData.subRecipes || []) {
      const recipeId = subRecipe.recipeId;

      if (!subRecipeMap.has(recipeId)) {
        // First time seeing this sub-recipe - create entry
        const type = categorizeSubRecipe(subRecipe.name);
        subRecipeMap.set(recipeId, {
          subRecipe,
          recipeId,
          type,
          usedByMenuItems: [],
        });
      }

      // Add this menu item to the list of items using this sub-recipe
      const collected = subRecipeMap.get(recipeId)!;
      collected.usedByMenuItems.push({
        menuItemId: menuItem.id,
        menuItemName,
        quantity: subRecipe.quantity,
      });
    }
  }

  return Array.from(subRecipeMap.values());
}

/**
 * Retry AI call with exponential backoff for rate limit errors
 * Does NOT retry on billing/account errors (those need manual intervention)
 */
async function generateAIResponseWithRetry(
  prompt: string,
  maxRetries = 3,
  initialDelay = 2000,
): Promise<{ content: string; error?: string }> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await Promise.race([
        generateAIResponse([{ role: 'user', content: prompt }], 'AU', {
          temperature: 0.7,
          maxTokens: 2000,
          useCache: true,
          cacheTTL: 24 * 60 * 60 * 1000,
        }),
        new Promise<{ content: ''; error: string }>((_, reject) =>
          setTimeout(() => reject(new Error('AI service timeout after 60 seconds')), 60000),
        ),
      ]);

      // If we got content, return it even if there's an error field (might be a warning)
      if (response.content) {
        return response;
      }

      // Log the full response for debugging
      logger.dev(`AI response (no content) on attempt ${attempt + 1}:`, {
        hasError: !!response.error,
        error: response.error,
        responseType: typeof response,
        responseKeys: Object.keys(response),
      });

      // Check for billing/account errors - don't retry these
      const errorLower = (response.error || '').toLowerCase();
      if (
        errorLower.includes('account is not active') ||
        errorLower.includes('billing') ||
        errorLower.includes('payment') ||
        errorLower.includes('subscription') ||
        errorLower.includes('insufficient_quota')
      ) {
        logger.error('AI account billing issue detected - not retrying:', {
          error: response.error,
          attempt: attempt + 1,
        });
        return { content: '', error: response.error || 'AI account billing issue' };
      }

      // If no content and error mentions rate limit (but not billing), retry
      if (response.error && errorLower.includes('rate limit')) {
        if (attempt < maxRetries) {
          const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s
          logger.warn(
            `Rate limit hit, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
          );
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // If we have an error but it's not retryable, return it
      if (response.error) {
        return { content: '', error: response.error };
      }

      // No content and no error - this is unusual
      logger.warn(`AI returned no content and no error on attempt ${attempt + 1}`);
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        logger.dev(`Retrying in ${delay}ms due to empty response`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return { content: '', error: 'AI service returned no content and no error message' };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage = lastError.message.toLowerCase();

      logger.dev(`AI call exception on attempt ${attempt + 1}:`, {
        error: lastError.message,
        stack: lastError.stack,
        errorType: error?.constructor?.name,
      });

      // Check for billing/account errors - don't retry these
      if (
        errorMessage.includes('account is not active') ||
        errorMessage.includes('billing') ||
        errorMessage.includes('payment') ||
        errorMessage.includes('subscription') ||
        errorMessage.includes('insufficient_quota')
      ) {
        logger.error('AI account billing issue detected - not retrying:', {
          error: lastError.message,
          attempt: attempt + 1,
        });
        return { content: '', error: lastError.message };
      }

      // Retry on rate limit errors only
      if (errorMessage.includes('rate limit') && attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff: 2s, 4s, 8s
        logger.warn(
          `Rate limit error, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Don't retry on other errors or if we've exhausted retries
      return { content: '', error: lastError.message };
    }
  }

  return { content: '', error: lastError?.message || 'Max retries exceeded' };
}

/**
 * Build recipe card manually from existing instructions (without AI)
 * Converts existing instructions into structured recipe card format
 */
function buildRecipeCardFromInstructions(
  menuItemData: MenuItemData,
  normalizedIngredients: NormalizedIngredient[],
  existingInstructions: string,
): ParsedRecipeCard {
  // Split instructions into steps
  // Handle both numbered steps (1., 2., etc.) and plain text
  const instructionLines = existingInstructions
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const methodSteps: string[] = [];
  let currentStep = '';

  for (const line of instructionLines) {
    // Skip markdown headers (##, **, etc.)
    if (line.match(/^#{1,6}\s/) || line.match(/^\*\*/)) {
      continue;
    }

    // Check for numbered steps (1., 2., 1), etc.)
    const stepMatch = line.match(/^\d+[\.\)]\s*(.+)$/);
    if (stepMatch) {
      // Save previous step if exists
      if (currentStep) {
        methodSteps.push(currentStep.trim());
      }
      currentStep = stepMatch[1].trim();
    } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
      // Bullet point - treat as step
      if (currentStep) {
        methodSteps.push(currentStep.trim());
      }
      currentStep = line.replace(/^[-•*]\s*/, '').trim();
    } else if (line.length > 0) {
      // Continue current step or start new one
      if (currentStep) {
        currentStep += ' ' + line;
      } else {
        currentStep = line;
      }
    }
  }

  // Add final step
  if (currentStep) {
    methodSteps.push(currentStep.trim());
  }

  // If no steps extracted, use the full instructions as a single step
  if (methodSteps.length === 0 && existingInstructions.trim().length > 0) {
    // Remove markdown formatting
    const cleaned = existingInstructions
      .replace(/\*\*/g, '')
      .replace(/^#{1,6}\s/gm, '')
      .trim();
    if (cleaned.length > 0) {
      methodSteps.push(cleaned);
    }
  }

  return {
    title: menuItemData.name,
    baseYield: 1, // Always normalized to 1 serving
    ingredients: normalizedIngredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity,
      unit: ing.unit,
    })),
    methodSteps,
    notes: [], // No notes from existing instructions
  };
}

/**
 * Generate data hash for a menu item to detect changes
 * Hash includes: normalized ingredients, instructions, description, yield
 */
function generateDataHash(
  menuItemData: MenuItemData,
  normalizedIngredients: NormalizedIngredient[],
): string {
  // Sort ingredients for consistent hashing
  const sortedIngredients = normalizedIngredients
    .map(ing => `${ing.name.toLowerCase()}|${ing.quantity}|${ing.unit.toLowerCase()}`)
    .sort()
    .join(';');

  // Include all relevant data in hash
  const hashData = {
    name: menuItemData.name,
    description: menuItemData.description || '',
    instructions: menuItemData.instructions || '',
    baseYield: menuItemData.baseYield,
    yieldUnit: menuItemData.yieldUnit,
    ingredients: sortedIngredients,
    subRecipes: menuItemData.subRecipes
      .map(sr => `${sr.name}|${sr.quantity}|${sr.yield}`)
      .sort()
      .join(';'),
  };

  const hashString = JSON.stringify(hashData);
  return createHash('sha256').update(hashString).digest('hex');
}

/**
 * Fetch existing recipe cards with their data hashes
 */
async function fetchExistingCards(
  supabase: any,
  menuItemIds: string[],
): Promise<Map<string, { dataHash: string | null; parsedAt: string | null }>> {
  if (menuItemIds.length === 0) {
    return new Map();
  }

  const { data: cards, error } = await supabase
    .from('menu_recipe_cards')
    .select('menu_item_id, data_hash, parsed_at')
    .in('menu_item_id', menuItemIds);

  if (error) {
    logger.warn('Failed to fetch existing recipe cards:', error);
    return new Map();
  }

  const cardMap = new Map<string, { dataHash: string | null; parsedAt: string | null }>();
  for (const card of cards || []) {
    cardMap.set(card.menu_item_id, {
      dataHash: card.data_hash || null,
      parsedAt: card.parsed_at || null,
    });
  }

  return cardMap;
}

/**
 * Delete specific recipe cards by menu item IDs
 */
async function deleteCardsForItems(supabase: any, menuItemIds: string[]) {
  if (menuItemIds.length === 0) {
    return;
  }

  const { error: deleteError } = await supabase
    .from('menu_recipe_cards')
    .delete()
    .in('menu_item_id', menuItemIds);

  if (deleteError) {
    logger.warn('Failed to delete recipe cards:', deleteError);
  }
}

/**
 * Get recipe signature for cross-referencing
 * Returns a unique identifier for the recipe(s) used by a menu item
 *
 * @param menuItemData - Menu item data with type and sub-recipes
 * @param menuItem - Menu item with dish_id or recipe_id
 * @returns Recipe signature string or null if cannot determine
 */
function getRecipeSignature(
  menuItemData: MenuItemData,
  menuItem: { dish_id?: string | null; recipe_id?: string | null },
): string | null {
  // Case 1: Direct recipe menu item
  if (menuItem.recipe_id) {
    return menuItem.recipe_id;
  }

  // Case 2: Dish menu item
  if (menuItem.dish_id) {
    // Case 2a: Dish with recipes - use sorted recipe IDs joined with ":"
    if (menuItemData.subRecipes && menuItemData.subRecipes.length > 0) {
      const recipeIds = menuItemData.subRecipes
        .map(sr => sr.recipeId)
        .sort()
        .join(':');
      return recipeIds;
    }

    // Case 2b: Dish without recipes (direct ingredients only) - use dish_id
    return `dish:${menuItem.dish_id}`;
  }

  // Cannot determine signature
  logger.warn('Cannot determine recipe signature - menu item has neither dish_id nor recipe_id');
  return null;
}

/**
 * Find existing recipe card by signature
 * Checks for existing cards that match the recipe signature
 *
 * @param supabase - Supabase client
 * @param signature - Recipe signature to search for
 * @param menuItem - Menu item with dish_id or recipe_id
 * @returns Existing card if found, null otherwise
 */
async function findExistingCardBySignature(
  supabase: any,
  signature: string,
  menuItem: { dish_id?: string | null; recipe_id?: string | null },
): Promise<{ id: string; data_hash: string | null } | null> {
  try {
    // Case 1: Direct recipe - search by recipe_id
    if (menuItem.recipe_id && signature === menuItem.recipe_id) {
      logger.dev(`[findExistingCardBySignature] Searching by recipe_id: ${menuItem.recipe_id}`);
      const { data: card, error } = await supabase
        .from('menu_recipe_cards')
        .select('id, data_hash')
        .eq('recipe_id', menuItem.recipe_id)
        .single();

      if (error) {
        // Check if column doesn't exist (migration not run)
        if (error.message?.includes('column') && error.message.includes('does not exist')) {
          logger.dev(
            '[findExistingCardBySignature] recipe_id column does not exist, migration not run - skipping cross-reference lookup',
          );
          return null;
        }
        // No card found or other error - return null
        if (error.code === 'PGRST116') {
          // No rows returned - this is fine
          logger.dev(
            `[findExistingCardBySignature] No card found for recipe_id ${menuItem.recipe_id} (PGRST116)`,
          );
          return null;
        }
        logger.warn('[findExistingCardBySignature] Error finding card by recipe_id:', error);
        return null;
      }

      logger.dev(
        `[findExistingCardBySignature] ✅ Found card ${card?.id} for recipe_id ${menuItem.recipe_id}`,
      );
      return card;
    }

    // Case 2: Dish - search by dish_id and recipe_signature
    if (menuItem.dish_id) {
      logger.dev(
        `[findExistingCardBySignature] Searching by dish_id: ${menuItem.dish_id}, signature: ${signature}`,
      );
      const { data: card, error } = await supabase
        .from('menu_recipe_cards')
        .select('id, data_hash')
        .eq('dish_id', menuItem.dish_id)
        .eq('recipe_signature', signature)
        .single();

      if (error) {
        // Check if columns don't exist (migration not run)
        if (error.message?.includes('column') && error.message.includes('does not exist')) {
          logger.dev(
            '[findExistingCardBySignature] dish_id or recipe_signature columns do not exist, migration not run - skipping cross-reference lookup',
          );
          return null;
        }
        // No card found or other error - return null
        if (error.code === 'PGRST116') {
          // No rows returned - this is fine
          logger.dev(
            `[findExistingCardBySignature] No card found for dish_id ${menuItem.dish_id} with signature ${signature} (PGRST116)`,
          );
          return null;
        }
        logger.warn(
          '[findExistingCardBySignature] Error finding card by dish_id and signature:',
          error,
        );
        return null;
      }

      logger.dev(
        `[findExistingCardBySignature] ✅ Found card ${card?.id} for dish_id ${menuItem.dish_id} with signature ${signature}`,
      );
      return card;
    }

    logger.dev(
      '[findExistingCardBySignature] Cannot determine search method - no recipe_id or dish_id',
    );
    return null;
  } catch (err) {
    logger.warn('[findExistingCardBySignature] Exception:', err);
    return null;
  }
}

/**
 * Link menu item to recipe card
 * Creates a junction record in menu_item_recipe_card_links
 *
 * @param supabase - Supabase client
 * @param menuItemId - Menu item ID
 * @param cardId - Recipe card ID
 */
async function linkMenuItemToCard(
  supabase: any,
  menuItemId: string,
  cardId: string,
): Promise<void> {
  try {
    const { error } = await supabase.from('menu_item_recipe_card_links').upsert(
      {
        menu_item_id: menuItemId,
        recipe_card_id: cardId,
      },
      { onConflict: 'menu_item_id,recipe_card_id' },
    );

    if (error) {
      // Check if table doesn't exist (migration not run)
      if (error.message?.includes('relation') && error.message.includes('does not exist')) {
        logger.dev(
          'menu_item_recipe_card_links table does not exist, migration not run - skipping link creation',
        );
        return;
      }
      logger.warn('Failed to link menu item to card:', error);
      // Don't throw - this is not critical, card still exists
    }
  } catch (err) {
    logger.warn('Exception in linkMenuItemToCard:', err);
    // Don't throw - this is not critical
  }
}

/**
 * Generate recipe card for a single sub-recipe
 */
async function generateSubRecipeCard(
  supabase: any,
  collectedSubRecipe: CollectedSubRecipe,
  crossReferencingEnabled: boolean,
): Promise<{ success: boolean; error?: string; cardId?: string }> {
  try {
    const { subRecipe, recipeId, usedByMenuItems } = collectedSubRecipe;

    // Safety check: ensure we have at least one menu item using this sub-recipe
    if (!usedByMenuItems || usedByMenuItems.length === 0) {
      logger.warn(`Skipping sub-recipe ${subRecipe.name} - no menu items using it`);
      return { success: false, error: 'No menu items using this sub-recipe' };
    }

    // Normalize ingredients to single serving (using sub-recipe's yield)
    const normalizedIngredients: NormalizedIngredient[] = subRecipe.ingredients.map(ing => ({
      name: ing.name,
      quantity: ing.quantity / subRecipe.yield, // Normalize to 1 serving
      unit: ing.unit,
      sources: [`recipe:${subRecipe.name}`],
    }));

    if (normalizedIngredients.length === 0) {
      logger.warn(`Skipping sub-recipe ${subRecipe.name} - no ingredients found`);
      return { success: false, error: 'No ingredients found' };
    }

    // Use sub-recipe's instructions if available
    const instructions = subRecipe.instructions || '';

    // Build card from instructions
    const menuItemDataForSubRecipe: MenuItemData = {
      id: recipeId,
      name: subRecipe.name,
      type: 'recipe',
      baseYield: subRecipe.yield,
      yieldUnit: subRecipe.yieldUnit,
      directIngredients: subRecipe.ingredients,
      subRecipes: [],
      instructions,
    };

    const parsedCard = buildRecipeCardFromInstructions(
      menuItemDataForSubRecipe,
      normalizedIngredients,
      instructions,
    );

    // Generate data hash
    const dataHash = generateDataHash(menuItemDataForSubRecipe, normalizedIngredients);

    // Prepare card data
    const cardContent = {
      raw_text: instructions,
      generated_at: new Date().toISOString(),
      generated_by: 'manual',
      sub_recipe_type: collectedSubRecipe.type,
      used_by_menu_items: usedByMenuItems.map(mi => ({
        menu_item_id: mi.menuItemId,
        menu_item_name: mi.menuItemName,
        quantity: mi.quantity,
      })),
    };

    const cardData: any = {
      card_content: cardContent,
      title: parsedCard.title,
      base_yield: subRecipe.yield, // Use sub-recipe's actual yield
      ingredients: parsedCard.ingredients,
      method_steps: parsedCard.methodSteps,
      notes: parsedCard.notes.length > 0 ? parsedCard.notes.join('\n') : null,
      data_hash: dataHash,
      parsed_at: new Date().toISOString(),
      // Sub-recipe cards: recipe_id set, dish_id null, menu_item_id set to first menu item (for backward compatibility)
      recipe_id: recipeId,
      dish_id: null,
      menu_item_id: usedByMenuItems[0]?.menuItemId || null, // Required field, use first menu item
      recipe_signature: recipeId, // Use recipe ID as signature for cross-referencing
    };

    // Check if card already exists for this sub-recipe
    let savedCardId: string;

    if (crossReferencingEnabled) {
      const { data: existingCard, error: findError } = await supabase
        .from('menu_recipe_cards')
        .select('id, data_hash')
        .eq('recipe_id', recipeId)
        .is('dish_id', null)
        .single();

      if (!findError && existingCard) {
        // Card exists - check if data changed
        if (existingCard.data_hash === dataHash) {
          // Data hasn't changed, reuse existing card
          savedCardId = existingCard.id;
          logger.dev(`Reusing existing sub-recipe card ${savedCardId} for ${subRecipe.name}`);
        } else {
          // Data changed - update card
          const { data: updatedCard, error: updateError } = await supabase
            .from('menu_recipe_cards')
            .update(cardData)
            .eq('id', existingCard.id)
            .select('id')
            .single();

          if (updateError) {
            logger.error(`Failed to update sub-recipe card for ${subRecipe.name}:`, updateError);
            return { success: false, error: updateError.message };
          }

          savedCardId = updatedCard?.id || existingCard.id;
          logger.dev(`Updated sub-recipe card ${savedCardId} for ${subRecipe.name}`);
        }
      } else {
        // Card doesn't exist - create new
        const { data: insertedCard, error: insertError } = await supabase
          .from('menu_recipe_cards')
          .insert(cardData)
          .select('id')
          .single();

        if (insertError) {
          logger.error(`Failed to create sub-recipe card for ${subRecipe.name}:`, insertError);
          return { success: false, error: insertError.message };
        }

        if (!insertedCard?.id) {
          return { success: false, error: 'No ID returned from insert' };
        }

        savedCardId = insertedCard.id;
        logger.dev(`Created new sub-recipe card ${savedCardId} for ${subRecipe.name}`);
      }

      // Link all menu items that use this sub-recipe to the card
      for (const menuItemUsage of usedByMenuItems) {
        await linkMenuItemToCard(supabase, menuItemUsage.menuItemId, savedCardId);
      }
    } else {
      // Old method: just create card for first menu item
      const { data: insertedCard, error: insertError } = await supabase
        .from('menu_recipe_cards')
        .insert(cardData)
        .select('id')
        .single();

      if (insertError) {
        logger.error(`Failed to create sub-recipe card for ${subRecipe.name}:`, insertError);
        return { success: false, error: insertError.message };
      }

      if (!insertedCard?.id) {
        return { success: false, error: 'No ID returned from insert' };
      }

      savedCardId = insertedCard.id;
    }

    return { success: true, cardId: savedCardId };
  } catch (err) {
    const errorMsg = `Error generating sub-recipe card for ${collectedSubRecipe.subRecipe.name}: ${err instanceof Error ? err.message : String(err)}`;
    logger.error(errorMsg, err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Generate recipe cards for all sub-recipes used in menu items
 */
async function generateSubRecipeCards(
  supabase: any,
  menuId: string,
  menuItems: Array<{ id: string; dish_id?: string | null; recipe_id?: string | null }>,
  menuItemDataCache: Map<string, MenuItemData>,
  menuItemNameMap: Map<string, string>,
  crossReferencingEnabled: boolean,
): Promise<{ successCount: number; errorCount: number; errors: string[] }> {
  logger.dev(`[generateSubRecipeCards] Starting sub-recipe card generation for menu ${menuId}`);

  // Collect unique sub-recipes
  const collectedSubRecipes = collectUniqueSubRecipes(
    menuItems,
    menuItemDataCache,
    menuItemNameMap,
  );

  if (collectedSubRecipes.length === 0) {
    logger.dev(`[generateSubRecipeCards] No sub-recipes found in menu ${menuId}`);
    return { successCount: 0, errorCount: 0, errors: [] };
  }

  logger.dev(`[generateSubRecipeCards] Found ${collectedSubRecipes.length} unique sub-recipes`);

  let successCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  // Generate cards for each sub-recipe
  for (const collectedSubRecipe of collectedSubRecipes) {
    const result = await generateSubRecipeCard(
      supabase,
      collectedSubRecipe,
      crossReferencingEnabled,
    );
    if (result.success) {
      successCount++;
    } else {
      errorCount++;
      if (result.error) {
        errors.push(result.error);
      }
    }
  }

  logger.dev(`[generateSubRecipeCards] Complete: ${successCount} succeeded, ${errorCount} failed`);

  return { successCount, errorCount, errors };
}

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
