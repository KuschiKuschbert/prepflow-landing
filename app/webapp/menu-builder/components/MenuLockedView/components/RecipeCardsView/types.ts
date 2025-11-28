/**
 * Types for RecipeCardsView component.
 */

export interface RecipeCardData {
  id: string;
  menuItemId: string; // First menu item (backward compatibility)
  menuItemIds?: string[]; // All menu items using this card (cross-referencing)
  menuItemName: string; // First menu item name (backward compatibility)
  menuItemNames?: string[]; // All menu item names (cross-referencing)
  title: string;
  baseYield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
  parsedAt: string | null;
  recipeId?: string | null; // For direct recipe menu items
  dishId?: string | null; // For dish menu items
  recipeSignature?: string | null; // Composite identifier for cross-referencing
  subRecipeType?: 'sauces' | 'marinades' | 'brines' | 'slowCooked' | 'other'; // For sub-recipe cards
  usedByMenuItems?: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number;
  }>; // Cross-reference for sub-recipe cards
}

export interface RecipeCardsViewProps {
  menuId: string;
}

export interface SubRecipeCards {
  sauces: RecipeCardData[];
  marinades: RecipeCardData[];
  brines: RecipeCardData[];
  slowCooked: RecipeCardData[];
  other: RecipeCardData[];
}
