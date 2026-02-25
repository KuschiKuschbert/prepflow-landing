import type { Recipe, RecipeIngredientWithDetails } from '../recipes';

export interface KitchenSection {
  id: string;
  name?: string;
  section_name?: string;
  color?: string;
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

export interface Menu {
  id: string;
  menu_name: string;
  description?: string;
  items_count?: number;
  created_at: string;
  updated_at: string;
}
