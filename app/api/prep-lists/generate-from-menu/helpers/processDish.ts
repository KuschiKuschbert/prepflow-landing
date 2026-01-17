import {
  DBDishIngredient,
  DBDishRecipe,
  DBRecipeIngredient,
  RecipeGroupedItem,
  SectionData,
} from '../types';
import { processDishIngredients } from './processDish/processDishIngredients';
import { processDishRecipes } from './processDish/processDishRecipes';

export function processDish(
  dishId: string,
  dishName: string,
  category: string,
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: RecipeGroupedItem[],
  sectionsMap: Map<string, { id: string; name: string }>,
  dishSection: { sectionId: string | null; sectionName: string },
  dishRecipes: DBDishRecipe[],
  dishIngredients: DBDishIngredient[],
  recipeIngredientsMap: Map<string, DBRecipeIngredient[]>,
  recipeInstructionsMap: Map<string, string | null>,
  recipeMultiplier: number = 1,
) {
  // Process dish recipes using pre-fetched data
  processDishRecipes(
    dishId,
    dishName,
    dishRecipes,
    sectionsData,
    unassignedItems,
    sectionsMap,
    dishSection,
    recipeIngredientsMap,
    recipeInstructionsMap,
    recipeMultiplier,
  );

  // Process standalone dish ingredients using pre-fetched data
  processDishIngredients(
    dishId,
    dishName,
    dishIngredients,
    sectionsData,
    dishSection,
    recipeMultiplier,
  );
}
