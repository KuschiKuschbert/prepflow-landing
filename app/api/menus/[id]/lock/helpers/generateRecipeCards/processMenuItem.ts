import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildRecipeCardFromInstructions, generateDataHash } from '../cardBuilding';
import { consolidateInstructions, normalizeToSingleServing } from '../normalizeIngredients';
import { MenuItemData } from '../types';
import { MenuItem } from './fetchMenuItems';
import { finalizeCardSave, saveCard } from './processMenuItem/saveCard';

interface ProcessResult {
  success: boolean;
  error?: string;
}

/**
 * Processes a single menu item to generate or update its recipe card.
 *
 * @param {SupabaseClient} supabase - Supabase client instance.
 * @param {MenuItem} menuItem - The menu item to process.
 * @param {MenuItemData} menuItemData - The menu item data.
 * @param {string} signature - Recipe signature for cross-referencing.
 * @param {string} [existingCardId] - Existing card ID if updating.
 * @param {boolean} crossReferencingEnabled - Whether cross-referencing is enabled.
 * @returns {Promise<ProcessResult>} Processing result.
 */
export async function processMenuItem(
  supabase: SupabaseClient,
  menuItem: MenuItem,
  menuItemData: MenuItemData,
  signature: string,
  existingCardId: string | undefined,
  crossReferencingEnabled: boolean,
): Promise<ProcessResult> {
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

    // Build card manually from existing instructions
    const hasInstructions = existingInstructions.trim().length > 0;
    if (hasInstructions) {
      logger.dev(`Using existing instructions for ${menuItemData.name} (skipping AI generation)`);
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

    if (!parsedCard) {
      const errorMsg = `Failed to build recipe card for ${menuItemData.name} - unexpected error`;
      logger.error(errorMsg);
      return { success: false, error: errorMsg };
    }

    // Generate data hash for this card
    const dataHash = generateDataHash(menuItemData, normalizedIngredients);

    // Store structured data in database
    const cardContent = {
      raw_text: existingInstructions,
      generated_at: new Date().toISOString(),
      generated_by: 'manual',
    };

    // Prepare card data
    const cardData: Record<string, unknown> = {
      card_content: cardContent,
      title: parsedCard.title,
      base_yield: parsedCard.baseYield || 1,
      ingredients: parsedCard.ingredients,
      method_steps: parsedCard.methodSteps,
      notes: parsedCard.notes.length > 0 ? parsedCard.notes.join('\n') : null,
      data_hash: dataHash,
      parsed_at: new Date().toISOString(),
      menu_item_id: menuItem.id,
    };

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
    const saveResult = await saveCard(
      supabase,
      cardData,
      signature,
      menuItem,
      menuItemData,
      crossReferencingEnabled,
      existingCardId,
    );

    if (!saveResult.success || !saveResult.cardId) {
      return { success: false, error: saveResult.error || 'Failed to save card' };
    }

    // Finalize card save (link menu item to card)
    return await finalizeCardSave(
      supabase,
      menuItem.id,
      saveResult.cardId,
      menuItemData,
      crossReferencingEnabled,
    );
  } catch (err) {
    const errorMsg = `Error for menu item ${menuItem.id}: ${err instanceof Error ? err.message : String(err)}`;
    logger.error(`Error generating recipe card for menu item ${menuItem.id}:`, err);
    return { success: false, error: errorMsg };
  }
}
