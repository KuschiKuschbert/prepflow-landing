// Dish Builder Types
import { COGSCalculation, PricingCalculation, Ingredient, Recipe } from '../cogs/types';

export interface DishBuilderState {
  dishName: string;
  description: string;
  sellingPrice: number;
  itemType: 'dish' | 'recipe';
  // Recipe-specific fields
  yield?: number;
  yield_unit?: string;
  instructions?: string;
}

export interface DishIngredient {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
}

export interface ExpandedRecipeIngredient {
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
}

// Re-export types from COGS for convenience
export type { COGSCalculation, PricingCalculation, Ingredient, Recipe };
