/** Dish and dish-related types */
export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
  category?: string;
  created_at: string;
  updated_at: string;
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  dietary_confidence?: string;
  dietary_method?: string;
  image_url?: string | null;
  image_url_alternative?: string | null;
  image_url_modern?: string | null;
  image_url_minimalist?: string | null;
  plating_methods_images?: Record<string, string | null>;
}

export interface DishRecipe {
  id: string;
  dish_id: string;
  recipe_id: string;
  quantity: number;
  recipes?: {
    id: string;
    recipe_name: string;
    description?: string;
    yield: number;
    yield_unit: string;
    selling_price?: number;
  };
}

export interface DishIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients?: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    cost_per_unit_incl_trim?: number;
    unit: string;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
    supplier_name?: string;
    category?: string;
  };
}

export interface DishWithDetails extends Dish {
  recipes?: DishRecipe[];
  ingredients?: DishIngredient[];
  consumables?: DishIngredient[];
}

export interface DishCostData {
  total_cost: number;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  contributingMargin: number;
  contributingMarginPercent: number;
  recommendedPrice: number;
}

export type DishSortField = 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';
