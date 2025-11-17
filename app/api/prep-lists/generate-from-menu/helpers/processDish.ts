import { processRecipe } from './processRecipe';

interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: any[];
  recipeGrouped: any[];
  prepInstructions: any[];
}

export function processDish(
  dishId: string,
  dishName: string,
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: any[],
  sectionsMap: Map<string, { id: string; name: string }>,
  dishSection: { sectionId: string | null; sectionName: string },
  dishRecipes: Array<{ recipe_id: string; quantity: number; recipe: any }>,
  dishIngredients: any[],
  recipeIngredientsMap: Map<string, any[]>,
  recipeInstructionsMap: Map<string, string | null>,
) {
  const sectionId = dishSection.sectionId;
  const sectionName = dishSection.sectionName;

  // Process dish recipes using pre-fetched data
  if (dishRecipes && dishRecipes.length > 0) {
    for (const dr of dishRecipes) {
      const recipe = dr.recipe;
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
          dr.quantity || 1,
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
      const ingredient = (di as any).ingredients;
      if (ingredient) {
        const ingredientId = ingredient.id;
        const ingredientName = ingredient.ingredient_name || ingredient.name;

        const existing = section.aggregatedIngredients.find(
          (agg: any) => agg.ingredientId === ingredientId && agg.unit === di.unit,
        );

        if (existing) {
          existing.totalQuantity += Number(di.quantity);
          existing.sources.push({
            type: 'dish',
            id: dishId,
            name: dishName,
          });
        } else {
          section.aggregatedIngredients.push({
            ingredientId,
            name: ingredientName,
            totalQuantity: Number(di.quantity),
            unit: di.unit,
            sources: [
              {
                type: 'dish',
                id: dishId,
                name: dishName,
              },
            ],
          });
        }
      }
    }
  }
}
