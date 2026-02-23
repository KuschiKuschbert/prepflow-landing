/**
 * Type definitions for Prep List Generation API
 */

export interface IngredientSource {
  type: 'dish' | 'recipe';
  id: string;
  name: string;
  quantity?: number;
}

export interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalQuantity: number;
  unit: string;
  sources: IngredientSource[];
}

export interface IngredientSimple {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeGroupedItem {
  recipeId: string;
  recipeName: string;
  dishId?: string;
  dishName?: string;
  instructions?: string;
  ingredients: IngredientSimple[];
}

export interface PrepInstructionItem {
  recipeId: string;
  recipeName: string;
  instructions: string;
  dishId?: string;
  dishName?: string;
  sectionId: string | null;
  sectionName: string;
}

export interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: AggregatedIngredient[];
  recipeGrouped: RecipeGroupedItem[];
  prepInstructions: PrepInstructionItem[];
}

// Database / Join Types

export interface DBKitchenSection {
  id: string;
  /** Schema may use name or section_name depending on migration */
  name?: string;
  section_name?: string;
}

export interface DBRecipe {
  id: string;
  recipe_name: string;
  instructions: string | null;
}

export interface DBIngredient {
  id: string;
  ingredient_name: string;
  name?: string; // Some views might have this
}

export interface DBRecipeIngredient {
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: DBIngredient | null;
}

export interface DBDishRecipe {
  dish_id: string;
  recipe_id: string;
  quantity: number;
  recipes: DBRecipe | null;
}

export interface DBDishIngredient {
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients: DBIngredient | null;
}

export interface DBDishSection {
  dish_id: string;
  section_id: string;
  kitchen_sections: DBKitchenSection | null;
}

export interface DishSectionData {
  sectionId: string | null;
  sectionName: string;
}

export interface DishRecipeData {
  recipe_id: string;
  quantity: number;
  recipe: DBRecipe | null;
}

export interface MenuItemDish {
  id: string;
  dish_name: string;
  description: string | null;
  kitchen_section_id?: string; // Optional as it might be joined or not
}

export interface MenuItemRecipe {
  id: string;
  name: string;
  description: string | null;
  yield: number | null;
  instructions: string | null;
  recipe_name?: string; // Alias for name
}

export interface MenuItemData {
  id: string;
  dish_id: string | null;
  recipe_id: string | null;
  category: string | null;
  dishes: MenuItemDish | MenuItemDish[] | null;
  recipes: MenuItemRecipe | MenuItemRecipe[] | null;
}
