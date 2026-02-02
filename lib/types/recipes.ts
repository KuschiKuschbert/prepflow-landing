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
  // Image URLs for different plating methods
  image_url?: string | null; // Classic plating (primary)
  image_url_alternative?: string | null; // Rustic plating
  image_url_modern?: string | null; // Modern plating
  image_url_minimalist?: string | null; // Minimalist plating
  // Additional plating method images stored as JSON
  // Keys: landscape, futuristic, hide_and_seek, super_bowl, bathing, deconstructed, stacking, brush_stroke, free_form
  plating_methods_images?: Record<string, string | null>;
  notes?: string;
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
  notes?: string;
  is_missing?: boolean;
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
  // Identification
  id?: string;
  recipeId?: string;
  recipe_id?: string;
  ingredientId: string;
  ingredient_id: string;

  // Basic info
  ingredientName: string;
  ingredient_name: string;
  quantity: number;
  unit: string;

  // Costs
  costPerUnit: number;
  cost_per_unit: number;
  totalCost: number;
  total_cost: number;

  // Adjusted costs
  wasteAdjustedCost: number;
  waste_adjusted_cost?: number;
  yieldAdjustedCost: number;
  yield_percentage?: number;

  // Metadata
  supplier_name?: string;
  category?: string;
  isConsumable?: boolean;
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
  // Image URLs for different plating methods
  image_url?: string | null; // Classic plating (primary)
  image_url_alternative?: string | null; // Rustic plating
  image_url_modern?: string | null; // Modern plating
  image_url_minimalist?: string | null; // Minimalist plating
  // Additional plating method images stored as JSON
  // Keys: landscape, futuristic, hide_and_seek, super_bowl, bathing, deconstructed, stacking, brush_stroke, free_form
  plating_methods_images?: Record<string, string | null>;
}

// Unified Item Types (for Recipes & Dishes view)
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
    cost_per_unit_incl_trim?: number;
    unit: string;
    trim_peel_waste_percentage?: number;
    yield_percentage?: number;
    supplier_name?: string;
    category?: string;
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

export type DishSortField = 'name' | 'selling_price' | 'cost' | 'profit_margin' | 'created';

export type RecipeSortField =
  | 'name'
  | 'recommended_price'
  | 'profit_margin'
  | 'contributing_margin'
  | 'created';

export type UnifiedSortField = DishSortField | RecipeSortField;

export interface SubscriptionRefs {
  refreshRecipePricesRef: {
    current: (
      recipes: Recipe[],
      fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>,
      fetchBatchRecipeIngredients?: (
        recipeIds: string[],
      ) => Promise<Record<string, RecipeIngredientWithDetails[]>>,
    ) => Promise<void>;
  };
  fetchRecipeIngredientsRef: {
    current: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  };
  fetchBatchRecipeIngredientsRef: {
    current:
      | ((recipeIds: string[]) => Promise<Record<string, RecipeIngredientWithDetails[]>>)
      | undefined;
  };
  onIngredientsChangeRef: {
    current: ((recipeId: string) => void) | undefined;
  };
  onRecipeUpdatedRef: {
    current: ((recipeId: string) => void) | undefined;
  };
  fetchRecipesRef: {
    current: () => Promise<void>;
  };
  recipesRef: {
    current: Recipe[];
  };
  pendingRecipeIdsRef: {
    current: Set<string>;
  };
  pendingRefreshTypeRef: {
    current: Set<'prices' | 'recipes'>;
  };
  debounceTimerRef: {
    current: NodeJS.Timeout | null;
  };
}
export interface UseRecipeHandlersParams {
  selectedRecipe: Recipe | null;
  previewYield: number;
  recipeIngredients: RecipeIngredientWithDetails[];
  aiInstructions: string;
  fetchRecipeIngredients: (recipeId: string) => Promise<RecipeIngredientWithDetails[]>;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setRecipeIngredients: (ingredients: RecipeIngredientWithDetails[]) => void;
  setPreviewYield: (yieldValue: number) => void;
  setShowUnifiedModal: (show: boolean) => void;
  setEditingRecipe: (recipe: Recipe | null) => void;
  setShowRecipeEditDrawer: (show: boolean) => void;
  setError: (error: string) => void;
  clearChangedFlag: (recipeId: string) => void;
  generateAIInstructions: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
  ) => Promise<void>;
  handleDuplicateRecipe: (recipe: Recipe) => Promise<Recipe | null>;
  handleShareRecipe: (
    recipe: Recipe,
    ingredients: RecipeIngredientWithDetails[],
    aiInstructions: string,
  ) => void;
}

export interface RecipeCardProps {
  recipe: Recipe;
  recipePrices: Record<string, RecipePriceData>;
  selectedRecipes: Set<string>;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
}
