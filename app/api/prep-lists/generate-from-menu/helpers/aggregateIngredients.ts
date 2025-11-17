interface IngredientSource {
  type: 'dish' | 'recipe';
  id: string;
  name: string;
  quantity?: number;
}

interface AggregatedIngredient {
  ingredientId: string;
  name: string;
  totalQuantity: number;
  unit: string;
  sources: IngredientSource[];
}

interface RecipeGroupedItem {
  recipeId: string;
  recipeName: string;
  dishId?: string;
  dishName?: string;
  ingredients: Array<{
    ingredientId: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
}

interface SectionData {
  sectionId: string | null;
  sectionName: string;
  aggregatedIngredients: AggregatedIngredient[];
  recipeGrouped: RecipeGroupedItem[];
}

export function aggregateIngredientsBySection(
  menuItems: any[],
  dishRecipes: any[],
  recipeIngredients: any[],
): SectionData[] {
  const sectionMap = new Map<string, SectionData>();

  // Process each menu item
  for (const item of menuItems) {
    const category = item.category || 'Uncategorized';
    const sectionId = item.dishes?.kitchen_section_id || null;
    const sectionName = category;

    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, {
        sectionId,
        sectionName,
        aggregatedIngredients: [],
        recipeGrouped: [],
      });
    }

    const section = sectionMap.get(sectionName)!;

    // If it's a dish, process its recipes
    if (item.dish_id && item.dishes) {
      const dishRecipesForDish = dishRecipes.filter(dr => dr.dish_id === item.dish_id);

      for (const dishRecipe of dishRecipesForDish) {
        const recipe = menuItems.find(mi => mi.recipe_id === dishRecipe.recipe_id)?.recipes;
        if (!recipe) continue;

        const recipeIngs = recipeIngredients.filter(ri => ri.recipe_id === dishRecipe.recipe_id);

        // Add to recipe grouped
        section.recipeGrouped.push({
          recipeId: dishRecipe.recipe_id,
          recipeName: recipe.recipe_name,
          dishId: item.dish_id,
          dishName: item.dishes.dish_name,
          ingredients: recipeIngs.map(ri => ({
            ingredientId: ri.ingredient_id,
            name: ri.ingredients?.ingredient_name || 'Unknown',
            quantity: (ri.quantity || 0) * (dishRecipe.quantity || 1),
            unit: ri.unit || '',
          })),
        });

        // Aggregate ingredients
        for (const ri of recipeIngs) {
          const ingredientId = ri.ingredient_id;
          const multiplier = (dishRecipe.quantity || 1) * (ri.quantity || 0);
          const existing = section.aggregatedIngredients.find(
            agg => agg.ingredientId === ingredientId,
          );

          if (existing) {
            existing.totalQuantity += multiplier;
            existing.sources.push({
              type: 'dish',
              id: item.dish_id,
              name: item.dishes.dish_name,
              quantity: dishRecipe.quantity,
            });
          } else {
            section.aggregatedIngredients.push({
              ingredientId,
              name: ri.ingredients?.ingredient_name || 'Unknown',
              totalQuantity: multiplier,
              unit: ri.unit || '',
              sources: [
                {
                  type: 'dish',
                  id: item.dish_id,
                  name: item.dishes.dish_name,
                  quantity: dishRecipe.quantity,
                },
              ],
            });
          }
        }
      }
    } else if (item.recipe_id && item.recipes) {
      // Direct recipe
      const recipeIngs = recipeIngredients.filter(ri => ri.recipe_id === item.recipe_id);

      section.recipeGrouped.push({
        recipeId: item.recipe_id,
        recipeName: item.recipes.recipe_name,
        ingredients: recipeIngs.map(ri => ({
          ingredientId: ri.ingredient_id,
          name: ri.ingredients?.ingredient_name || 'Unknown',
          quantity: ri.quantity || 0,
          unit: ri.unit || '',
        })),
      });

      for (const ri of recipeIngs) {
        const ingredientId = ri.ingredient_id;
        const existing = section.aggregatedIngredients.find(
          agg => agg.ingredientId === ingredientId,
        );

        if (existing) {
          existing.totalQuantity += ri.quantity || 0;
          existing.sources.push({
            type: 'recipe',
            id: item.recipe_id,
            name: item.recipes.recipe_name,
          });
        } else {
          section.aggregatedIngredients.push({
            ingredientId,
            name: ri.ingredients?.ingredient_name || 'Unknown',
            totalQuantity: ri.quantity || 0,
            unit: ri.unit || '',
            sources: [
              {
                type: 'recipe',
                id: item.recipe_id,
                name: item.recipes.recipe_name,
              },
            ],
          });
        }
      }
    }
  }

  return Array.from(sectionMap.values());
}
