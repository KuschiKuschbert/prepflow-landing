/**
 * Types and interfaces for recipe card generation.
 */

import { MenuItemSubRecipe } from './fetchMenuItemData';

/**
 * Sub-recipe type categories
 */
export type SubRecipeType = 'sauces' | 'marinades' | 'brines' | 'slowCooked' | 'other';

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
