interface RecipeGroupedItem {
  recipeId: string;
  recipeName: string;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
}

interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalQuantity: number;
  unit: string;
  sources: Array<{
    type: 'recipe';
    id: string;
    name: string;
  }>;
}

export function aggregateIngredientsFromRecipes(
  recipes: RecipeGroupedItem[],
): AggregatedIngredient[] {
  const aggregated = new Map<string, AggregatedIngredient>();

  for (const recipe of recipes) {
    for (const ing of recipe.ingredients) {
      const key = `${ing.ingredientId}-${ing.unit}`;
      const existing = aggregated.get(key);

      if (existing) {
        existing.totalQuantity += ing.quantity;
        existing.sources.push({
          type: 'recipe',
          id: recipe.recipeId,
          name: recipe.recipeName,
        });
      } else {
        aggregated.set(key, {
          ingredientId: ing.ingredientId,
          name: ing.name,
          totalQuantity: ing.quantity,
          unit: ing.unit,
          sources: [
            {
              type: 'recipe',
              id: recipe.recipeId,
              name: recipe.recipeName,
            },
          ],
        });
      }
    }
  }

  return Array.from(aggregated.values());
}

