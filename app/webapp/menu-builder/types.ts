export interface Menu {
  id: string;
  menu_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  items_count?: number;
  is_locked?: boolean;
  locked_at?: string;
  locked_by?: string;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  dish_id?: string;
  recipe_id?: string;
  category: string;
  position: number;
  actual_selling_price?: number;
  recommended_selling_price?: number;
  dishes?: {
    id: string;
    dish_name: string;
    description?: string;
    selling_price: number;
    allergens?: string[];
    is_vegetarian?: boolean;
    is_vegan?: boolean;
    dietary_confidence?: string;
    dietary_method?: string;
  };
  recipes?: {
    id: string;
    recipe_name: string;
    description?: string;
    yield?: number;
    selling_price?: number;
    allergens?: string[];
    is_vegetarian?: boolean;
    is_vegan?: boolean;
    dietary_confidence?: string;
    dietary_method?: string;
  };
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  dietary_confidence?: string;
  dietary_method?: string;
}

export interface MenuStatistics {
  total_items: number;
  total_dishes: number;
  total_recipes: number;
  total_cogs: number;
  total_revenue: number;
  gross_profit: number;
  average_profit_margin: number;
  food_cost_percent: number;
}

export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
}

export interface Recipe {
  id: string;
  recipe_name: string;
  description?: string;
  yield?: number;
  yield_unit?: string;
  category?: string;
  instructions?: string;
  selling_price?: number;
}
