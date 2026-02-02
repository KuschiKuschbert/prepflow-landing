import { Dish, Recipe } from '@/lib/types/recipes';

export type UnifiedItem = (Dish & { itemType: 'dish' }) | (Recipe & { itemType: 'recipe' });

export type DishSortField = 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';

export type RecipeSortField =
  | 'name'
  | 'recommended_price'
  | 'profit_margin'
  | 'contributing_margin'
  | 'created';

export type UnifiedSortField = DishSortField | RecipeSortField;
