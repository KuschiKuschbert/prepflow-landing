import { Recipe, RecipeIngredientWithDetails } from './recipes';

export interface KitchenSection {
  id: string;
  name: string;
  color: string;
}

export interface RecipeAnalysisData {
  recipe: Recipe;
  ingredients: RecipeIngredientWithDetails[];
  instructions?: string | null;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
}

export interface PrepListItem {
  id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  notes?: string;
  ingredients: Ingredient;
}

export interface PrepList {
  id: string;
  kitchen_section_id: string;
  name: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  kitchen_sections: KitchenSection;
  prep_list_items: PrepListItem[];
}

export interface PrepListCreationItem {
  ingredientId: string;
  quantity: string;
  unit: string;
  notes: string;
}

export interface PrepListFormData {
  kitchenSectionId: string;
  name: string;
  notes: string;
  items: PrepListCreationItem[];
}

// Menu-based prep list generation types
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
  prepNotes?: string[]; // Inline prep notes (cut shapes, marination, etc.)
}

export type PrepDetailType = 'cut_shape' | 'sauce' | 'marination' | 'pre_cooking' | 'technique';

export interface PrepDetail {
  type: PrepDetailType;
  ingredientId?: string;
  ingredientName?: string;
  description: string;
  details?: string;
}

export interface SauceDetail {
  name: string;
  ingredients: string[];
  instructions: string;
  recipeId?: string;
}

export interface MarinationDetail {
  ingredient: string;
  ingredientId?: string;
  method: string;
  duration?: string;
  recipeId?: string;
}

export interface RecipePrepDetails {
  recipeId: string;
  recipeName: string;
  prepDetails: PrepDetail[];
  sauces: SauceDetail[];
  marinations: MarinationDetail[];
  cutShapes: Array<{ ingredient: string; ingredientId?: string; shape: string; quantity?: string }>;
  preCookingSteps: Array<{ ingredient: string; ingredientId?: string; step: string }>;
  specialTechniques: Array<{ description: string; details?: string }>;
}

export interface RecipeGroupedItem {
  recipeId: string;
  recipeName: string;
  dishId?: string;
  dishName?: string;
  instructions?: string;
  prepDetails?: RecipePrepDetails;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
    prepNotes?: string[]; // Cut shapes, marination, etc.
  }>;
}

export interface PrepInstructionItem {
  recipeId: string;
  recipeName: string;
  instructions: string;
  dishId?: string;
  dishName?: string;
  sectionId?: string | null;
  sectionName?: string;
}

export interface PrepTechniquesSection {
  cutShapes: Array<{ ingredient: string; ingredientId?: string; shape: string; recipes: string[] }>;
  sauces: SauceDetail[];
  marinations: MarinationDetail[];
  preCookingSteps: Array<{
    ingredient: string;
    ingredientId?: string;
    step: string;
    recipes: string[];
  }>;
  specialTechniques: Array<{ description: string; details?: string; recipes: string[] }>;
}

export interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: AggregatedIngredient[];
  recipeGrouped: RecipeGroupedItem[];
  prepInstructions: PrepInstructionItem[];
  prepTechniques?: PrepTechniquesSection;
}

export interface GeneratedPrepListData {
  success: boolean;
  menuName: string;
  menuId: string;
  sections: SectionData[];
  unassignedItems?: RecipeGroupedItem[];
}

export interface Menu {
  id: string;
  menu_name: string;
  description?: string;
  items_count?: number;
  created_at: string;
  updated_at: string;
}
