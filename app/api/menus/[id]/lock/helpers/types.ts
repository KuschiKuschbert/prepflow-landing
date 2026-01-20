export interface MenuItemIngredient {
  name: string;
  quantity: number;
  unit: string;
  source?: string; // 'direct' | 'recipe:recipe_name'
}

export interface MenuItemSubRecipe {
  name: string;
  recipeId: string;
  quantity: number; // Quantity of recipe servings needed
  yield: number; // Recipe's yield (servings)
  yieldUnit: string;
  ingredients: MenuItemIngredient[];
  instructions?: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  description?: string;
  type: 'dish' | 'recipe';
  baseYield: number; // Yield for this dish/recipe
  yieldUnit: string;
  directIngredients: MenuItemIngredient[];
  subRecipes: MenuItemSubRecipe[];
  instructions?: string;
}

export interface RawIngredientJoin {
  ingredient_name: string;
}

export interface RawRecipeIngredientJoin {
  quantity: number | string | null;
  unit: string | null;
  ingredients: RawIngredientJoin | null;
}

export interface RawRecipeResult {
  id: string;
  name: string;
  recipe_name?: string;
  description: string | null;
  yield: number | null;
  yield_unit: string | null;
  instructions: string | null;
  recipe_ingredients: RawRecipeIngredientJoin[];
}

export interface RawDishIngredientJoin {
  quantity: number | string | null;
  unit: string | null;
  ingredients: RawIngredientJoin | null;
}

export interface RawDishRecipeJoin {
  quantity: number | string | null;
  recipes: RawRecipeResult | null;
}

export interface RawDishResult {
  id: string;
  dish_name: string;
  description: string | null;
  dish_ingredients: RawDishIngredientJoin[];
  dish_recipes: RawDishRecipeJoin[];
}
