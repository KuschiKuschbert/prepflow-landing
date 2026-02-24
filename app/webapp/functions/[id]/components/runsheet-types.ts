/**
 * Shared types for runsheet components and hooks.
 * Extracted to avoid circular dependencies (RunsheetPanel <-> hooks/components).
 */

import type { RunsheetItem } from '@/app/api/functions/helpers/schemas';

export type RunsheetItemWithRelations = RunsheetItem & {
  menus?: { id: string; menu_name: string; menu_type: string } | null;
  dishes?: {
    id: string;
    dish_name: string;
    selling_price: number;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
  recipes?: {
    id: string;
    recipe_name: string;
    is_vegetarian?: boolean | null;
    is_vegan?: boolean | null;
    allergens?: string[] | null;
  } | null;
};

export interface DishOption {
  id: string;
  dish_name: string;
  selling_price: number;
}

export interface RecipeOption {
  id: string;
  recipe_name: string;
}

export interface MenuOption {
  id: string;
  menu_name: string;
  menu_type: string;
}
