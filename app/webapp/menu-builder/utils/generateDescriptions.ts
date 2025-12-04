/**
 * Generate menu item descriptions using AI
 *
 * Batch generates descriptions for menu items that don't have descriptions
 */

import { logger } from '@/lib/logger';
import type { MenuItem } from '../types';

/**
 * Generate descriptions for menu items that don't have descriptions.
 *
 * @param {MenuItem[]} menuItems - Array of menu items
 * @returns {Promise<Map<string, string>>} Map of menuItemId -> description
 */
export async function generateMenuDescriptions(
  menuItems: MenuItem[],
): Promise<Map<string, string>> {
  const descriptions = new Map<string, string>();

  // Find items that need descriptions
  const itemsNeedingDescriptions = menuItems.filter(item => {
    const isDish = !!item.dish_id;
    const isRecipe = !!item.recipe_id;
    const existingDescription = isDish ? item.dishes?.description : item.recipes?.description;

    return !existingDescription || existingDescription.trim() === '';
  });

  if (itemsNeedingDescriptions.length === 0) {
    logger.dev('[generateMenuDescriptions] No items need descriptions');
    return descriptions;
  }

  logger.dev(
    `[generateMenuDescriptions] Generating descriptions for ${itemsNeedingDescriptions.length} items`,
  );

  // Generate descriptions in parallel (with error handling per item)
  const descriptionPromises = itemsNeedingDescriptions.map(async item => {
    try {
      const isRecipe = !!item.recipe_id;
      let ingredients: any[] | undefined;

      // For recipes, try to fetch ingredients if available
      if (isRecipe && item.recipe_id) {
        try {
          const response = await fetch(`/api/recipes/${item.recipe_id}/ingredients`);
          if (response.ok) {
            const data = await response.json();
            ingredients = data.items || [];
          }
        } catch (err) {
          logger.warn('[generateMenuDescriptions] Failed to fetch recipe ingredients:', {
            recipeId: item.recipe_id,
            error: err instanceof Error ? err.message : String(err),
          });
          // Continue without ingredients
        }
      }

      const response = await fetch('/api/ai/menu-item-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuItem: item,
          ingredients,
          countryCode: 'AU',
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      if (data.description && data.description.trim()) {
        descriptions.set(item.id, data.description.trim());
        logger.dev(`[generateMenuDescriptions] Generated description for ${item.id}:`, {
          itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
          description: data.description.substring(0, 50) + '...',
        });
      } else {
        logger.warn(`[generateMenuDescriptions] No description generated for ${item.id}`);
      }
    } catch (error) {
      logger.error(`[generateMenuDescriptions] Failed to generate description for ${item.id}:`, {
        error: error instanceof Error ? error.message : String(error),
        itemName: item.dishes?.dish_name || item.recipes?.recipe_name,
      });
      // Continue - don't fail entire batch
    }
  });

  await Promise.all(descriptionPromises);

  logger.dev(
    `[generateMenuDescriptions] Generated ${descriptions.size} descriptions out of ${itemsNeedingDescriptions.length} items`,
  );

  return descriptions;
}
