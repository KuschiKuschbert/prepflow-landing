import { DBDishRecipe, DBRecipeIngredient, RecipeGroupedItem, SectionData } from '../../types';
import { processRecipe } from '../processRecipe';

export function processDishRecipes(
  dishId: string,
  dishName: string,
  dishRecipes: DBDishRecipe[],
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: RecipeGroupedItem[],
  sectionsMap: Map<string, { id: string; name: string }>,
  dishSection: { sectionId: string | null; sectionName: string },
  recipeIngredientsMap: Map<string, DBRecipeIngredient[]>,
  recipeInstructionsMap: Map<string, string | null>,
  recipeMultiplier: number,
) {
  if (dishRecipes && dishRecipes.length > 0) {
    for (const dr of dishRecipes) {
      const recipe = dr.recipes;
      if (recipe && recipe.id) {
        const recipeIngredients = recipeIngredientsMap.get(recipe.id) || [];
        const instructions = recipeInstructionsMap.get(recipe.id) || null;

        processRecipe(
          recipe.id,
          recipe.recipe_name,
          dishId,
          dishName,
          sectionsData,
          unassignedItems,
          sectionsMap,
          (dr.quantity || 1) * recipeMultiplier,
          instructions,
          recipeIngredients,
          dishSection, // Pass dish section to recipe
        );
      }
    }
  }
}
