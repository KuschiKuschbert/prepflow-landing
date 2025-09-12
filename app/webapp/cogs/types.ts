export interface Ingredient {
  id: string;
  ingredient_name: string;
  unit?: string;
  cost_per_unit: number;
  cost_per_unit_as_purchased?: number;
  cost_per_unit_incl_trim?: number;
  trim_peel_waste_percentage?: number;
  yield_percentage?: number;
}

export interface Recipe {
  id: string;
  name: string;
  yield?: number;
}

export interface RecipeIngredient {
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit?: string;
}

export interface COGSCalculation {
  recipeId: string;
  ingredientId: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  totalCost: number;
  wasteAdjustedCost: number;
  yieldAdjustedCost: number;
}

export interface PricingCalculation {
  sellPriceExclGST: number;
  sellPriceInclGST: number;
  gstAmount: number;
  actualGrossProfit: number;
  grossProfitDollar: number;
  contributingMargin: number;
  contributingMarginPercent: number;
}

export interface PricingStrategy {
  type: 'charm' | 'whole' | 'real';
  targetGrossProfit: number;
}

export interface DishFormData {
  dishName: string;
  dishPortions: number;
  dishNameLocked: boolean;
  recipeExists: boolean | null;
  checkingRecipe: boolean;
}

export interface IngredientFormData {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface COGSPageState {
  ingredients: Ingredient[];
  recipes: Recipe[];
  selectedRecipe: string;
  recipeIngredients: RecipeIngredient[];
  calculations: COGSCalculation[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  showAddIngredient: boolean;
  editingIngredient: string | null;
  editQuantity: number;
  ingredientSearch: string;
  showSuggestions: boolean;
  selectedIngredient: Ingredient | null;
  newIngredient: Partial<RecipeIngredient>;
  targetGrossProfit: number;
  sellPriceExclGST: number;
  sellPriceInclGST: number;
  pricingStrategy: 'charm' | 'whole' | 'real';
}
