/**
 * Types for price audit functionality.
 */

export interface DishRecord {
  id: string;
  dish_name: string;
}

export interface RecipeRecord {
  id: string;
  name?: string;
  recipe_name?: string;
}


export interface PriceAuditResult {
  itemId: string;
  itemName: string;
  itemType: 'dish' | 'recipe';
  menuBuilderPrice: number | null;
  recipeDishBuilderPrice: number | null;
  discrepancy: number;
  discrepancyPercent: number;
  issues: string[];
}

