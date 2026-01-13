import {
  DBIngredient,
  DBRecipeIngredient,
  IngredientSimple,
  PrepInstructionItem,
  RecipeGroupedItem,
  SectionData,
} from '../types';

export function processRecipe(
  recipeId: string,
  recipeName: string,
  dishId: string | null,
  dishName: string | null,
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: RecipeGroupedItem[],
  sectionsMap: Map<string, { id: string; name: string }>,
  recipeMultiplier: number = 1,
  recipeInstructions?: string | null,
  recipeIngredients?: DBRecipeIngredient[],
  dishSection?: { sectionId: string | null; sectionName: string } | null,
) {
  // Use pre-fetched ingredients or return if none provided
  if (!recipeIngredients || recipeIngredients.length === 0) {
    return;
  }

  // Determine section - use dish section if provided, otherwise Uncategorized
  let sectionId: string | null = null;
  let sectionName = 'Uncategorized';

  if (dishSection) {
    sectionId = dishSection.sectionId;
    sectionName = dishSection.sectionName;
  }

  const sectionKey = sectionId || null;

  // Prepare recipe grouped item
  const recipeGroupedItem: RecipeGroupedItem = {
    recipeId,
    recipeName,
    dishId: dishId || undefined,
    dishName: dishName || undefined,
    instructions: recipeInstructions || undefined,
    ingredients: recipeIngredients.map((ri: DBRecipeIngredient): IngredientSimple => {
      const ingredient = ri.ingredients || ({} as DBIngredient);
      return {
        ingredientId: ingredient.id || ri.ingredient_id,
        name: ingredient.ingredient_name || ingredient.name || 'Unknown',
        quantity: Number(ri.quantity) * recipeMultiplier,
        unit: ri.unit,
      };
    }),
  };

  // Add to recipe grouped
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
  section.recipeGrouped.push(recipeGroupedItem);

  // If recipe has instructions, add to prep instructions
  if (recipeInstructions && recipeInstructions.trim().length > 0) {
    const prepInstructionItem: PrepInstructionItem = {
      recipeId,
      recipeName,
      instructions: recipeInstructions,
      dishId: dishId || undefined,
      dishName: dishName || undefined,
      sectionId,
      sectionName,
    };
    section.prepInstructions.push(prepInstructionItem);
  }

  // Add to aggregated ingredients
  for (const ri of recipeIngredients) {
    const ingredient = ri.ingredients || ({} as DBIngredient);
    // Determine ingredient ID/Name. If join failed, ingredient might be null.
    // ri.ingredient_id should exist on the join row itself.
    if (ingredient) {
      const ingredientId = ri.ingredient_id;
      const ingredientName = ingredient.ingredient_name || ingredient.name || 'Unknown';
      const quantity = Number(ri.quantity) * recipeMultiplier;

      const existing = section.aggregatedIngredients.find(
        agg => agg.ingredientId === ingredientId && agg.unit === ri.unit,
      );

      if (existing) {
        existing.totalQuantity += quantity;
        existing.sources.push({
          type: 'recipe',
          id: recipeId,
          name: recipeName,
          quantity: recipeMultiplier,
        });
      } else {
        section.aggregatedIngredients.push({
          ingredientId,
          name: ingredientName,
          totalQuantity: quantity,
          unit: ri.unit,
          sources: [
            {
              type: 'recipe',
              id: recipeId,
              name: recipeName,
              quantity: recipeMultiplier,
            },
          ],
        });
      }
    }
  }
}
