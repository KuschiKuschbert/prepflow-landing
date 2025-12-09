import { logger } from '@/lib/logger';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MenuItemData } from '../fetchMenuItemData';
import { buildRecipeCardFromInstructions, generateDataHash } from '../cardBuilding';
import { findExistingCardBySignature, linkMenuItemToCard } from '../cardManagement';
import { consolidateInstructions, normalizeToSingleServing } from '../normalizeIngredients';

interface ProcessResult {
  success: boolean;
  error?: string;
}

/**
 * Processes a single menu item to generate or update its recipe card.
 *
 * @param {SupabaseClient} supabase - Supabase client instance.
 * @param {any} menuItem - The menu item to process.
 * @param {MenuItemData} menuItemData - The menu item data.
 * @param {string} signature - Recipe signature for cross-referencing.
 * @param {string} [existingCardId] - Existing card ID if updating.
 * @param {boolean} crossReferencingEnabled - Whether cross-referencing is enabled.
 * @returns {Promise<ProcessResult>} Processing result.
 */
export async function processMenuItem(
  supabase: SupabaseClient,
  menuItem: any,
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
    const cardData: any = {
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
}
