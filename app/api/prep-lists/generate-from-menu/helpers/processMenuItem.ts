import { logger } from '@/lib/logger';
import {
  DBDishIngredient,
  DBDishRecipe,
  DBRecipeIngredient,
  RecipeGroupedItem,
  SectionData,
} from '../types';
import { processDish } from './processDish';
import { processRecipe } from './processRecipe';

interface RawMenuItem {
  id: string;
  category?: string | null;
  dish_id?: string | null;
  recipe_id?: string | null;
  dishes?: unknown; // justified: raw Supabase response
  recipes?: unknown; // justified: raw Supabase response
}

interface ProcessMenuItemParams {
  menuItem: RawMenuItem; // justified: incoming raw data from Supabase
  sectionsData: Map<string | null, SectionData>;
  unassignedItems: RecipeGroupedItem[];
  sectionsMap: Map<string, { id: string; name: string }>;
  dishSectionsMap: Map<string, { sectionId: string | null; sectionName: string }>;
  dishRecipesMap: Map<string, DBDishRecipe[]>;
  dishIngredientsMap: Map<string, DBDishIngredient[]>;
  recipeIngredientsMap: Map<string, DBRecipeIngredient[]>;
  recipeInstructionsMap: Map<string, string | null>;
}

export function processMenuItem({
  menuItem,
  sectionsData,
  unassignedItems,
  sectionsMap,
  dishSectionsMap,
  dishRecipesMap,
  dishIngredientsMap,
  recipeIngredientsMap,
  recipeInstructionsMap,
}: ProcessMenuItemParams) {
  try {
    // Handle dish - dishes relation might be an array or single object
    if (menuItem.dish_id) {
      const dishes = menuItem.dishes;
      if (dishes) {
        const dish = Array.isArray(dishes) ? dishes[0] : dishes;
        if (dish && dish.id && dish.dish_name) {
          const dishSection = dishSectionsMap.get(dish.id) || {
            sectionId: null,
            sectionName: 'Uncategorized',
          };
          const dishRecipes = dishRecipesMap.get(dish.id) || [];
          const dishIngredients = dishIngredientsMap.get(dish.id) || [];

          processDish(
            dish.id,
            dish.dish_name,
            menuItem.category || 'Uncategorized',
            sectionsData,
            unassignedItems,
            sectionsMap,
            dishSection,
            dishRecipes,
            dishIngredients,
            recipeIngredientsMap,
            recipeInstructionsMap,
          );
          return; // Skip recipe processing if dish was processed
        }
      }
    }

    // Handle recipe directly in menu - recipes relation might be an array or single object
    if (menuItem.recipe_id) {
      const recipes = menuItem.recipes;
      if (recipes) {
        const recipe = Array.isArray(recipes) ? recipes[0] : recipes;
        if (recipe && recipe.id && (recipe.recipe_name || recipe.name)) {
          const recipeIngredients = recipeIngredientsMap.get(recipe.id) || [];
          const instructions = recipeInstructionsMap.get(recipe.id) || null;

          processRecipe(
            recipe.id,
            recipe.recipe_name || recipe.name,
            null,
            null,
            sectionsData,
            unassignedItems,
            sectionsMap,
            1,
            instructions,
            recipeIngredients,
            null, // No dish section for standalone recipes
          );
        }
      }
    }
  } catch (itemError) {
    logger.error(`Error processing menu item ${menuItem.id}:`, itemError);
    // Continue processing other items even if one fails
  }
}
