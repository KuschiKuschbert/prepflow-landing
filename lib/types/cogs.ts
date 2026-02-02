import {
  COGSCalculation as BaseCOGSCalculation,
  Ingredient,
  Recipe,
  RecipeIngredient,
} from './recipes';

export type { Ingredient, Recipe, RecipeIngredient };

// Redefine COGSCalculation if specific cogs-only fields are needed,
// but for now we've unified it in BaseCOGSCalculation.
export type COGSCalculation = BaseCOGSCalculation;

export interface RecipeGroup {
  recipeId: string;
  recipeName: string;
  quantity: number;
  yield: number;
  yieldUnit: string;
  calculations: COGSCalculation[];
  totalCost: number;
}

export interface PricingCalculation {
  sellPriceExclGST: number;
  sellPriceInclGST: number;
  grossProfitDollar: number;
  actualGrossProfit: number;
  contributingMargin: number;
  contributingMarginPercent: number;
  gstAmount: number;
}

export interface PricingStrategy {
  name: string;
  multiplier: number;
  description: string;
}

export interface DishFormData {
  dishName: string;
  dishPortions: number;
  dishNameLocked: boolean;
  recipeExists: boolean;
  checkingRecipe: boolean;
}

export interface IngredientFormData {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface COGSPageState {
  calculations: COGSCalculation[];
  totalCost: number;
  loading: boolean;
  error: string | null;
}
