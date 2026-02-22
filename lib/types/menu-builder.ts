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
  menu_type?: string;
  food_per_person_kg?: number | null;
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
    image_url?: string | null;
    image_url_alternative?: string | null;
    image_url_modern?: string | null;
    image_url_minimalist?: string | null;
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
    image_url?: string | null;
    image_url_alternative?: string | null;
    image_url_modern?: string | null;
    image_url_minimalist?: string | null;
  };
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  dietary_confidence?: string;
  dietary_method?: string;
  region?: string | null;
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

export interface RecipeCardData {
  id: string;
  menuItemId: string; // First menu item (backward compatibility)
  menuItemIds?: string[]; // All menu items using this card (cross-referencing)
  menuItemName: string; // First menu item name (backward compatibility)
  menuItemNames?: string[]; // All menu item names (cross-referencing)
  title: string;
  baseYield: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  methodSteps: string[];
  notes: string[];
  parsedAt: string | null;
  recipeId?: string | null; // For direct recipe menu items
  dishId?: string | null; // For dish menu items
  recipeSignature?: string | null; // Composite identifier for cross-referencing
  subRecipeType?: 'sauces' | 'marinades' | 'brines' | 'slowCooked' | 'other'; // For sub-recipe cards
  usedByMenuItems?: Array<{
    menuItemId: string;
    menuItemName: string;
    quantity: number;
  }>; // Cross-reference for sub-recipe cards
}

export interface SubRecipeCards {
  sauces: RecipeCardData[];
  marinades: RecipeCardData[];
  brines: RecipeCardData[];
  slowCooked: RecipeCardData[];
  other: RecipeCardData[];
}
export interface RecipeCardsViewProps {
  menuId: string;
}
