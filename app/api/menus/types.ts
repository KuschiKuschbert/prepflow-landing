export interface Menu {
  id: string;
  user_id: string;
  menu_name: string;
  description: string | null;
  status: 'active' | 'archived' | 'draft' | string;
  currency: string;
  created_at: string;
  updated_at: string;
  items_count?: number; // Virtual field
}

export interface MenuItem {
  id: string;
  menu_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  dietary_info: Record<string, any> | null;
  is_available: boolean;
  sort_order: number;
  image_url: string | null;
}

export interface MenuCategory {
  id: string;
  menu_id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

export interface CreateMenuParams {
  userId: string;
  name: string;
  description?: string;
  currency?: string;
}

export interface UpdateMenuParams {
  id: string;
  menu_name?: string;
  description?: string | null;
  status?: string;
  currency?: string;
}

export interface FetchMenusParams {
  userId: string | null;
  page: number;
  pageSize: number;
  status?: string;
}

export interface MenuStatistics {
  totalItems: number;
  activeItems: number;
  averagePrice: number;
  categoriesCount: number;
}

export interface RawMenuItem extends Partial<MenuItem> {
  recommended_selling_price?: number | null;
  actual_selling_price?: number | null;
  category?: string;
  position?: number;
  region?: string | null;
  dishes?: {
    id: string;
    dish_name: string;
    description: string | null;
    selling_price: number | null;
    allergens?: string[];
    is_vegetarian?: boolean;
    is_vegan?: boolean;
    dietary_confidence?: string;
    dietary_method?: string;
  };
  recipes?: {
    id: string;
    name: string;
    recipe_name?: string; // For compatibility
    description: string | null;
    yield: number | null;
    allergens?: string[];
    is_vegetarian?: boolean;
    is_vegan?: boolean;
    dietary_confidence?: string;
    dietary_method?: string;
  };
  dish_id?: string | null;
  recipe_id?: string | null;
}

export interface EnrichedDishData {
  allergens: string[];
  isVegetarian: boolean | null;
  isVegan: boolean | null;
  dietaryConfidence: string | null;
  dietaryMethod: string | null;
}

export interface EnrichedRecipeData {
  allergens: string[];
  isVegetarian: boolean | null;
  isVegan: boolean | null;
  dietaryConfidence: string | null;
  dietaryMethod: string | null;
}

export interface EnrichedMenuItem extends RawMenuItem {
  recommended_selling_price?: number | null;
  allergens?: string[];
  is_vegetarian?: boolean | null;
  is_vegan?: boolean | null;
  dietary_confidence?: string | null;
  dietary_method?: string | null;
}
