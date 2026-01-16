/**
 * Types for recipe cards API.
 */

export interface IngredientRow {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface MethodStepRow {
  stepNumber: number;
  instruction: string;
}

export interface RecipeCard {
  id: string;
  menuItemId: string; // Backward compatibility
  menuItemIds: string[]; // All menu items using this card
  menuItemName: string; // Backward compatibility
  menuItemNames: string[]; // All menu item names
  title: string;
  baseYield: number;
  ingredients: IngredientRow[];
  methodSteps: MethodStepRow[];
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

export interface RecipeCardDB {
  id: string;
  menu_item_id?: string;
  recipe_id: string | null;
  dish_id: string | null;
  recipe_signature: string | null;
  title: string;
  base_yield: number;
  ingredients: IngredientRow[];
  method_steps: MethodStepRow[];
  notes: string[] | string | null;
  card_content: Record<string, unknown> | null; // JSONB column
  parsed_at: string | null;
}

export interface CardMapEntry {
  card: RecipeCardDB;
  menuItemIds: string[];
  menuItemNames: string[];
}

export interface ItemOrder {
  category: string;
  position: number;
}
