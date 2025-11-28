/**
 * Types for recipe cards API.
 */

export interface RecipeCard {
  id: string;
  menuItemId: string; // Backward compatibility
  menuItemIds: string[]; // All menu items using this card
  menuItemName: string; // Backward compatibility
  menuItemNames: string[]; // All menu item names
  title: string;
  baseYield: number;
  ingredients: any[];
  methodSteps: any[];
  notes: string[];
  parsedAt: string | null;
  recipeId: string | null;
  dishId: string | null;
  recipeSignature: string | null;
}

export interface SubRecipeCard extends RecipeCard {
  subRecipeType: string;
  usedByMenuItems: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number;
  }>;
}

export interface GroupedSubRecipeCards {
  sauces: SubRecipeCard[];
  marinades: SubRecipeCard[];
  brines: SubRecipeCard[];
  slowCooked: SubRecipeCard[];
  other: SubRecipeCard[];
}

export interface CardMapEntry {
  card: any;
  menuItemIds: string[];
  menuItemNames: string[];
}

export interface ItemOrder {
  category: string;
  position: number;
}
