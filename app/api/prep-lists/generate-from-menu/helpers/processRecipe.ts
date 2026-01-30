import {
  DBIngredient,
  DBRecipeIngredient,
  IngredientSimple,
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

  // Determine section
  const sectionId = dishSection?.sectionId || null;
  const sectionName = dishSection?.sectionName || 'Uncategorized';
  const sectionKey = sectionId || null;

  // Initialize section if needed
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

  // Add Recipe Grouped Item
  section.recipeGrouped.push(
    createRecipeGroupedItem(
      recipeId,
      recipeName,
      dishId,
      dishName,
      recipeInstructions,
      recipeIngredients,
      recipeMultiplier,
    ),
  );

  // Add Prep Instructions
  if (recipeInstructions?.trim()) {
    section.prepInstructions.push({
      recipeId,
      recipeName,
      instructions: recipeInstructions,
      dishId: dishId || undefined,
      dishName: dishName || undefined,
      sectionId,
      sectionName,
    });
  }

  // Aggregate Ingredients
  aggregateIngredients(section, recipeIngredients, recipeId, recipeName, recipeMultiplier);
}

function createRecipeGroupedItem(
  recipeId: string,
  recipeName: string,
  dishId: string | null,
  dishName: string | null,
  instructions: string | null | undefined,
  ingredients: DBRecipeIngredient[],
  multiplier: number,
): RecipeGroupedItem {
  return {
    recipeId,
    recipeName,
    dishId: dishId || undefined,
    dishName: dishName || undefined,
    instructions: instructions || undefined,
    ingredients: ingredients.map((ri: DBRecipeIngredient): IngredientSimple => {
      const ingredient = ri.ingredients || ({} as DBIngredient);
      return {
        ingredientId: ingredient.id || ri.ingredient_id,
        name: ingredient.ingredient_name || ingredient.name || 'Unknown',
        quantity: Number(ri.quantity) * multiplier,
        unit: ri.unit,
      };
    }),
  };
}

function aggregateIngredients(
  section: SectionData,
  ingredients: DBRecipeIngredient[],
  recipeId: string,
  recipeName: string,
  multiplier: number,
) {
  for (const ri of ingredients) {
    const ingredient = ri.ingredients || ({} as DBIngredient);
    if (!ingredient) continue;

    const ingredientId = ri.ingredient_id;
    const ingredientName = ingredient.ingredient_name || ingredient.name || 'Unknown';
    const quantity = Number(ri.quantity) * multiplier;

    const existing = section.aggregatedIngredients.find(
      agg => agg.ingredientId === ingredientId && agg.unit === ri.unit,
    );

    if (existing) {
      existing.totalQuantity += quantity;
      existing.sources.push({
        type: 'recipe',
        id: recipeId,
        name: recipeName,
        quantity: multiplier,
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
            quantity: multiplier,
          },
        ],
      });
    }
  }
}
