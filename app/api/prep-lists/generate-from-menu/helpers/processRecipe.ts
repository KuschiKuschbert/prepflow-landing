interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: any[];
  recipeGrouped: any[];
  prepInstructions: any[];
}

export function processRecipe(
  recipeId: string,
  recipeName: string,
  dishId: string | null,
  dishName: string | null,
  sectionsData: Map<string | null, SectionData>,
  unassignedItems: any[],
  sectionsMap: Map<string, { id: string; name: string }>,
  recipeMultiplier: number = 1,
  recipeInstructions?: string | null,
  recipeIngredients?: any[],
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
  const recipeGroupedItem = {
    recipeId,
    recipeName,
    dishId: dishId || undefined,
    dishName: dishName || undefined,
    instructions: recipeInstructions || undefined,
    ingredients: recipeIngredients.map((ri: any) => {
      const ingredient = ri.ingredients || {};
      return {
        ingredientId: ingredient.id,
        name: ingredient.ingredient_name || ingredient.name,
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
    const prepInstructionItem = {
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
    const ingredient = (ri as any).ingredients;
    if (ingredient) {
      const ingredientId = ingredient.id;
      const ingredientName = ingredient.ingredient_name || ingredient.name;
      const quantity = Number(ri.quantity) * recipeMultiplier;

      const existing = section.aggregatedIngredients.find(
        (agg: any) => agg.ingredientId === ingredientId && agg.unit === ri.unit,
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
