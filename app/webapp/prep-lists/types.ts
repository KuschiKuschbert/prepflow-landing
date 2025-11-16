export interface KitchenSection {
  id: string;
  name: string;
  color: string;
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

export interface PrepListFormData {
  kitchenSectionId: string;
  name: string;
  notes: string;
  items: Array<{
    ingredientId: string;
    quantity: string;
    unit: string;
    notes: string;
  }>;
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
}

export interface RecipeGroupedItem {
  recipeId: string;
  recipeName: string;
  dishId?: string;
  dishName?: string;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
}

export interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: AggregatedIngredient[];
  recipeGrouped: RecipeGroupedItem[];
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
