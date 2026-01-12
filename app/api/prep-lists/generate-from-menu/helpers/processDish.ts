import {
    DBDishIngredient,
    DBDishRecipe,
    DBRecipeIngredient,
    RecipeGroupedItem,
    SectionData
} from '../types';
import { processRecipe } from './processRecipe';

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
  const sectionId = dishSection.sectionId;
  const sectionName = dishSection.sectionName;

  // Process dish recipes using pre-fetched data
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

  // Process standalone dish ingredients using pre-fetched data
  if (dishIngredients && dishIngredients.length > 0) {
    const sectionKey = sectionId || null;
    if (!sectionsData.has(sectionKey)) {
      sectionsData.set(sectionKey, {
        sectionId,
        sectionName,
        aggregatedIngredients: [],
        recipeGrouped: [],
        prepInstructions: [],
      });
    }

    const section = sectionsData.get(sectionKey)!;

    for (const di of dishIngredients) {
      const ingredient = di.ingredients;
      if (ingredient) {
        const ingredientId = di.ingredient_id;
        const ingredientName = ingredient.ingredient_name || ingredient.name || 'Unknown';

        const existing = section.aggregatedIngredients.find(
          (agg) => agg.ingredientId === ingredientId && agg.unit === di.unit,
        );

        if (existing) {
          existing.totalQuantity += Number(di.quantity) * recipeMultiplier;
          existing.sources.push({
            type: 'dish',
            id: dishId,
            name: dishName,
            quantity: Number(di.quantity) * recipeMultiplier,
          });
        } else {
          section.aggregatedIngredients.push({
            ingredientId,
            name: ingredientName,
            totalQuantity: Number(di.quantity) * recipeMultiplier,
            unit: di.unit,
            sources: [
              {
                type: 'dish',
                id: dishId,
                name: dishName,
                quantity: Number(di.quantity) * recipeMultiplier,
              },
            ],
          });
        }
      }
    }
  }
}
