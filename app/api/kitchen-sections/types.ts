/**
 * Type definitions for Kitchen Sections API
 */

export interface KitchenSection {
  id: string;
  name: string | null;
  section_name?: string | null; // For compatibility with older schema versions or different views
  description: string | null;
  color: string | null;
  color_code?: string | null; // For compatibility
  created_at: string;
  updated_at: string;
}

export interface Dish {
  id: string;
  dish_name?: string; // from 'dishes' table
  name?: string; // from 'menu_dishes' table
  description: string | null;
  selling_price: number | null;
  category: string | null;
  kitchen_section_id?: string | null;
}

export interface DishSection {
  dish_id: string;
  section_id: string;
}

export interface NormalizedDish {
  id: string;
  name: string;
  description: string | null;
  selling_price: number | null;
  category: string;
  kitchen_section_id: string | null;
}

export interface SectionWithDishes {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
  updated_at: string;
  menu_dishes: NormalizedDish[];
}
