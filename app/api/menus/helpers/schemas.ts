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
  is_locked: z.boolean().optional(),
  locked_at: z.string().nullable().optional(),
  locked_by: z.string().nullable().optional(),
  menu_type: z.string().default('a_la_carte'),
  food_per_person_kg: z.number().nullable().optional(),
  expected_guests: z.number().int().min(0).nullable().optional(),
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
  description: z.string().nullable().optional(),
  currency: z.string().optional().default('AUD'),
  menu_type: z.enum(['a_la_carte', 'function']).default('a_la_carte'),
  food_per_person_kg: z.number().optional(),
  expected_guests: z.number().int().min(0).nullable().optional(),
});

export const updateMenuSchema = z.object({
  menu_name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(['active', 'archived', 'draft']).or(z.string()).optional(),
  currency: z.string().optional(),
  menu_type: z.enum(['a_la_carte', 'function']).optional(),
  food_per_person_kg: z.number().nullable().optional(),
  expected_guests: z.number().int().min(0).nullable().optional(),
});

// --- Inferred Types ---

export type Menu = z.infer<typeof menuSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type MenuCategory = z.infer<typeof menuCategorySchema>;
export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;

// --- Menus Statistics Types ---

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
  /** Price per person (function menus only): sum of per-serving item prices */
  price_per_person?: number | null;
}
