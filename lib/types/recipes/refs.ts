import type { Recipe } from './recipe';
import type { RecipeIngredientWithDetails } from './recipe';

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
  recipePrices: Record<string, import('./recipe').RecipePriceData>;
  selectedRecipes: Set<string>;
  onSelectRecipe: (recipeId: string) => void;
  onPreviewRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (recipe: Recipe) => void;
  capitalizeRecipeName: (name: string) => string;
}
