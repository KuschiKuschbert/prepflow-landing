/**
 * Types for dish sections page.
 */

export interface KitchenSection {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
  menu_dishes: MenuDish[];
}

export interface MenuDish {
  id: string;
  name: string;
  description?: string;
  selling_price: number;
  category: string;
  kitchen_section_id?: string;
}
