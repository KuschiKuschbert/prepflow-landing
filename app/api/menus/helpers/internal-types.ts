// --- Join Types for Statistics ---

export interface IngredientJoinData {
  cost_per_unit: number;
  cost_per_unit_incl_trim: number | null;
  trim_peel_waste_percentage: number | null;
  yield_percentage: number | null;
  ingredient_name?: string;
  id?: string;
}

export interface DishRecipeJoinData {
  recipe_id: string;
  quantity: string | number;
  recipes: {
    id: string;
    name: string;
  } | null;
}

export interface RecipeIngredientJoinData {
  quantity: string | number;
  unit: string | null;
  ingredients: IngredientJoinData | null;
}

// --- Menu Item Data Types ---

export interface MenuDishRelation {
  id: string;
  dish_name: string;
  selling_price: number | null;
}

export interface MenuRecipeRelation {
  id: string;
  name: string;
  yield: number | null;
}

export interface MenuItemWithRelations {
  dish_id: string | null;
  recipe_id: string | null;
  actual_selling_price: number | null;
  recommended_selling_price: number | null;
  dishes?: MenuDishRelation | MenuDishRelation[];
  recipes?: MenuRecipeRelation | MenuRecipeRelation[];
}

export interface ParLevel {
  ingredient_id: string;
  par_level: number;
  reorder_point: number;
  unit: string;
}

export interface IngredientWithParLevel {
  id: string;
  ingredient_name: string;
  brand?: string;
  pack_size?: string;
  pack_size_unit?: string;
  pack_price?: number;
  cost_per_unit: number;
  unit?: string;
  storage?: string;
  category?: string;
  par_level?: number;
  reorder_point?: number;
  par_unit?: string;
}
