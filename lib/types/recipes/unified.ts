import type { Dish } from './dish';
import type { Recipe } from './recipe';

/** Unified item types for Recipes & Dishes view */
export type UnifiedItemType = 'recipe' | 'dish';

export interface Ingredient {
  id: string;
  ingredient_name: string;
  unit: string;
  category?: string;
  cost_per_unit?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
  supplier_name?: string;
}

export type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

import type { RecipeSortField } from './recipe';
import type { DishSortField } from './dish';

export type UnifiedSortField = RecipeSortField | DishSortField;
