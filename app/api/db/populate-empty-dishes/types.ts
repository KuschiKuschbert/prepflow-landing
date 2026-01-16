<<<<<<< HEAD
/**
 * Types for populate empty dishes functionality.
 */

export interface DishRecord {
=======
export interface PopulateDishItem {
>>>>>>> main
  id: string;
  dish_name: string;
}

<<<<<<< HEAD
export interface RecipeRecord {
  id: string;
  name?: string;
  recipe_name?: string;
}

export interface IngredientRecord {
=======
export interface PopulateRecipeItem {
  id: string;
  name: string;
}

export interface PopulateIngredientItem {
>>>>>>> main
  id: string;
  ingredient_name: string;
  unit: string;
}
<<<<<<< HEAD

export interface PopulatedDish {
  dish_id: string;
  dish_name: string;
  ingredients_added: number;
  ingredient_names: string[];
}

export interface SkippedDish {
  dish_id: string;
  dish_name: string;
  reason: string;
}

export interface DishError {
  dish_id: string;
  dish_name: string;
  error: string;
}

export interface PopulateDishesResult {
  populated: PopulatedDish[];
  skipped: SkippedDish[];
  errors: DishError[];
}

export interface PopulatedRecipe {
  recipe_id: string;
  recipe_name: string;
  ingredients_added: number;
  ingredient_names: string[];
}

export interface SkippedRecipe {
  recipe_id: string;
  recipe_name: string;
  reason: string;
}

export interface RecipeError {
  recipe_id: string;
  recipe_name: string;
  error: string;
}

export interface PopulateRecipesResult {
  populated: PopulatedRecipe[];
  skipped: SkippedRecipe[];
  errors: RecipeError[];
}
=======
>>>>>>> main
