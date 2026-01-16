/**
 * Centralized types for Dishes API
 */

export interface DishRecord {
  id: string;
  dish_name: string;
  description?: string;
  category?: string;
  selling_price?: number;
  cost?: number;
  margin?: number;
  allergens?: string[];
  dietary_info?: Record<string, unknown>;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface AllergenSource {
  source_type: 'recipe' | 'ingredient';
  source_id: string;
  source_name: string;
  quantity?: number;
  unit?: string;
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

export interface IngredientRecord {
  id: string;
  ingredient_name: string;
  brand?: string;
  category?: string;
  cost_per_unit?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  allergens?: string[];
  allergen_source?: {
    manual?: boolean;
    ai?: boolean;
  };
}

export interface RecipeRecord {
  id: string;
  name?: string;
  recipe_name: string;
  allergens?: string[];
  instructions?: string;
}

export interface DishIngredientRecord {
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients?: IngredientRecord;
}

export interface DishRecipeRecord {
  dish_id: string;
  recipe_id: string;
  quantity: number;
  recipes?: RecipeRecord;
}

export interface DishWithRelations extends DishRecord {
  dish_ingredients?: DishIngredientRecord[];
  dish_recipes?: DishRecipeRecord[];
}
