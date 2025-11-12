export interface DishCOGSCalculation {
  source: 'recipe' | 'ingredient';
  recipeId?: string;
  recipeName?: string;
  recipeQuantity?: number;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  wasteAdjustedCost: number;
  yieldAdjustedCost: number;
}

export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id: string;
  name: string;
  yield?: number;
}

export interface Ingredient {
  id: string;
  ingredient_name: string;
  unit?: string;
  cost_per_unit?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}
