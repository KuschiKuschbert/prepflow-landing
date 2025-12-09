/**
 * Sub-recipe card generation utilities.
 */

import { logger } from '@/lib/logger';
import { createSupabaseAdmin } from '@/lib/supabase';
import { batchFetchAllMenuItemData, lookupMenuItemDataFromCache } from './batchFetchMenuItemData';
import { MenuItemData } from './fetchMenuItemData';
import { buildRecipeCardFromInstructions, generateDataHash } from './cardBuilding';
import { consolidateInstructions, NormalizedIngredient } from './normalizeIngredients';
import { CollectedSubRecipe } from './recipe-card-types';
import { collectUniqueSubRecipes } from './subRecipeUtils';
import { saveSubRecipeCard } from './subRecipeCardGeneration/saveSubRecipeCard';

/**
 * Generate recipe card for a single sub-recipe
 */
export async function generateSubRecipeCard(
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

    // Save card to database
    const saveResult = await saveSubRecipeCard(
      supabase,
      cardData,
      recipeId,
      dataHash,
      subRecipe.name,
      usedByMenuItems,
      crossReferencingEnabled,
    );

    if (!saveResult.success) {
      return { success: false, error: saveResult.error };
    }

    return { success: true, cardId: saveResult.cardId };
  } catch (err) {
    const errorMsg = `Error generating sub-recipe card for ${collectedSubRecipe.subRecipe.name}: ${err instanceof Error ? err.message : String(err)}`;
    logger.error(errorMsg, err);
    return { success: false, error: errorMsg };
  }
}

/**
 * Generate recipe cards for all sub-recipes used in menu items
 */
export async function generateSubRecipeCards(
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
