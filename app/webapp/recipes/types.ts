// Recipe Types
export interface Recipe {
  id: string;
  recipe_name: string;
  description?: string;
  instructions?: string;
  yield: number;
  yield_unit: string;
  category?: string;
  created_at: string;
  updated_at: string;
  selling_price?: number;
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  dietary_confidence?: string;
  dietary_method?: string;
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  ingredient_id: string;
  ingredient_name: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  total_cost: number;
  supplier_name?: string;
  category?: string;
}

export interface RecipeIngredientWithDetails extends RecipeIngredient {
  ingredients: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    cost_per_unit_incl_trim?: number;
    unit: string;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
    supplier_name?: string;
    category?: string;
  };
}

export interface COGSCalculation {
  id: string;
  ingredient_id: string;
  ingredientId: string;
  ingredient_name: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  total_cost: number;
  yieldAdjustedCost: number;
  supplier_name?: string;
  category?: string;
}

export interface RecipePriceData {
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  cost_per_serving: number;
  recommendedPrice: number;
  foodCostPercent: number;
  contributingMargin: number;
  contributingMarginPercent: number;
}

// Dish Types
export interface Dish {
  id: string;
  dish_name: string;
  description?: string;
  selling_price: number;
  category?: string;
  created_at: string;
  updated_at: string;
  allergens?: string[];
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  dietary_confidence?: string;
  dietary_method?: string;
}

// Unified Item Types (for Recipes & Dishes view)
export type UnifiedItemType = 'recipe' | 'dish';

export interface UnifiedItem {
  id: string;
  type: UnifiedItemType;
  name: string;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
  // Recipe-specific fields
  yield?: number;
  yield_unit?: string;
  // Dish-specific fields
  selling_price?: number;
}

export interface DishRecipe {
  id: string;
  dish_id: string;
  recipe_id: string;
  quantity: number;
  recipes?: {
    id: string;
    recipe_name: string;
    description?: string;
    yield: number;
    yield_unit: string;
    selling_price?: number;
  };
}

export interface DishIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredients?: {
    id: string;
    ingredient_name: string;
    cost_per_unit: number;
    unit: string;
  };
}

export interface DishWithDetails extends Dish {
  recipes?: DishRecipe[];
  ingredients?: DishIngredient[];
  consumables?: DishIngredient[]; // Consumables are stored in dish_ingredients but filtered by category
}

export interface DishCostData {
  total_cost: number;
  selling_price: number;
  gross_profit: number;
  gross_profit_margin: number;
  food_cost_percent: number;
  contributingMargin: number;
  contributingMarginPercent: number;
  recommendedPrice: number;
}
