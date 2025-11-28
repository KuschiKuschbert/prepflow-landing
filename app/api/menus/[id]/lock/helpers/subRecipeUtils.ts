/**
 * Utilities for sub-recipe categorization and collection.
 */

import { logger } from '@/lib/logger';
import { lookupMenuItemDataFromCache } from './batchFetchMenuItemData';
import { MenuItemData, MenuItemSubRecipe } from './fetchMenuItemData';
import { CollectedSubRecipe, SubRecipeType } from './recipe-card-types';

/**
 * Categorize a sub-recipe by its name using keyword matching
 */
export function categorizeSubRecipe(recipeName: string): SubRecipeType {
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
 * Collect unique sub-recipes from all menu items
 * Deduplicates by recipeId and tracks which menu items use each sub-recipe
 */
export function collectUniqueSubRecipes(
  menuItems: Array<{ id: string; dish_id?: string | null; recipe_id?: string | null }>,
  menuItemDataCache: Map<string, MenuItemData>,
  menuItemNameMap: Map<string, string>,
): CollectedSubRecipe[] {
  const subRecipeMap = new Map<string, CollectedSubRecipe>();

  // Iterate through all menu items
  for (const menuItem of menuItems) {
    const menuItemData = lookupMenuItemDataFromCache(menuItemDataCache, menuItem);
    if (!menuItemData) continue;

    // Check if this menu item has sub-recipes
    if (!menuItemData.subRecipes || menuItemData.subRecipes.length === 0) {
      continue;
    }

    const menuItemName = menuItemNameMap.get(menuItem.id) || menuItem.id;

    // Process each sub-recipe
    for (const subRecipe of menuItemData.subRecipes) {
      const recipeId = subRecipe.recipeId;

      // Check if we've already collected this sub-recipe
      if (subRecipeMap.has(recipeId)) {
        // Add this menu item to the usage list
        const existing = subRecipeMap.get(recipeId)!;
        existing.usedByMenuItems.push({
          menuItemId: menuItem.id,
          menuItemName,
          quantity: subRecipe.quantity,
        });
      } else {
        // New sub-recipe - create entry
        const type = categorizeSubRecipe(subRecipe.name);
        subRecipeMap.set(recipeId, {
          subRecipe,
          recipeId,
          type,
          usedByMenuItems: [
            {
              menuItemId: menuItem.id,
              menuItemName,
              quantity: subRecipe.quantity,
            },
          ],
        });
      }
    }
  }

  const collected = Array.from(subRecipeMap.values());
  logger.dev(`[collectUniqueSubRecipes] Collected ${collected.length} unique sub-recipes`);
  return collected;
}
