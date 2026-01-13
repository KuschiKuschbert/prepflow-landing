import { z } from 'zod';

// --- Base Schemas ---

export const menuSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  menu_name: z.string().min(1, 'Menu name is required'),
  description: z.string().nullable(),
  status: z.enum(['active', 'archived', 'draft']).or(z.string()),
  currency: z.string().default('AUD'),
  created_at: z.string(),
  updated_at: z.string(),
  items_count: z.number().optional(),
});

export const menuItemSchema = z.object({
  id: z.string().uuid(),
  menu_id: z.string().uuid(),
  category_id: z.string().uuid().nullable(),
  name: z.string().min(1, 'Item name is required'),
  description: z.string().nullable(),
  price: z.number().nonnegative(),
  currency: z.string(),
  dietary_info: z.record(z.string(), z.any()).nullable(),
  is_available: z.boolean().default(true),
  sort_order: z.number().int(),
  image_url: z.string().nullable(),
});

export const menuCategorySchema = z.object({
  id: z.string().uuid(),
  menu_id: z.string().uuid(),
  name: z.string().min(1, 'Category name is required'),
  description: z.string().nullable(),
  sort_order: z.number().int(),
});

// --- Input Schemas ---

export const createMenuSchema = z.object({
  menu_name: z.string().min(1, 'Menu name is required'),
  description: z.string().optional(),
  currency: z.string().optional().default('AUD'),
});

export const updateMenuSchema = z.object({
  menu_name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['active', 'archived', 'draft']).or(z.string()).optional(),
  currency: z.string().optional(),
});

// --- Inferred Types ---

export type Menu = z.infer<typeof menuSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;

// --- Menus Statistics Types ---

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

export interface MenuItemWithRelations {
  dish_id: string | null;
  recipe_id: string | null;
  actual_selling_price: number | null;
  recommended_selling_price: number | null;
  dishes?:
    | {
        id: string;
        dish_name: string;
        selling_price: number | null;
      }
    | {
        id: string;
        dish_name: string;
        selling_price: number | null;
      }[];
  recipes?:
    | {
        id: string;
        name: string;
        yield: number | null;
      }
    | {
        id: string;
        name: string;
        yield: number | null;
      }[];
}

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

export interface CreateMenuItemInput {
  dish_id?: string;
  recipe_id?: string;
  category?: string;
  position?: number;
}

export interface UpdateMenuItemInput {
  category?: string;
  position?: number;
  actual_selling_price?: number | null;
  region?: string | null;
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

// --- Response Schemas ---

export interface MenuResponse {
  success: boolean;
  message?: string;
  menu?: Menu;
  menus?: Menu[];
  count?: number;
  statistics?: MenuStatistics;
}
