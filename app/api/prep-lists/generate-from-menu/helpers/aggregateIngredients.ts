import { DBDishRecipe, DBRecipeIngredient, MenuItemData, SectionData } from '../types';

export function aggregateIngredientsBySection(
  menuItems: MenuItemData[],
  dishRecipes: DBDishRecipe[],
  recipeIngredients: DBRecipeIngredient[],
): SectionData[] {
  const sectionMap = new Map<string, SectionData>();

  // Process each menu item
  for (const item of menuItems) {
    const category = item.category || 'Uncategorized';
    const itemDish = item.dishes
      ? Array.isArray(item.dishes)
        ? item.dishes[0]
        : item.dishes
      : null;
    const sectionId = itemDish?.kitchen_section_id || null;
    const sectionName = category;

    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, {
        sectionId,
        sectionName,
        aggregatedIngredients: [],
        recipeGrouped: [],
        prepInstructions: [],
      });
    }

    const section = sectionMap.get(sectionName)!;

    // If it's a dish, process its recipes
    if (item.dish_id && itemDish) {
      const dishRecipesForDish = dishRecipes.filter(dr => dr.dish_id === item.dish_id);

      for (const dishRecipe of dishRecipesForDish) {
        // Find the recipe name from the menu items if possible, or we might need another source
        // The original logic tried to find a menu item with this recipe_id.
        // menuItems.find((mi: any) => ...)

        // ISSUE: dishRecipe has recipe_id, but we need recipe metadata (name).
        // The original code was: menuItems.find((mi: any) => mi.recipe_id === dishRecipe.recipe_id)?.recipes;
        // This assumes every recipe used in a dish is also listed as a standalone menu item? That seems potentially flaky but if that's the logic...
        // Better: We should probably use the recipe dictionary that we fetched? But this function doesn't receive it.
        // We will stick to the original logic but type safe it.

        const foundItem = menuItems.find(mi => mi.recipe_id === dishRecipe.recipe_id);
        const foundItemRec = foundItem?.recipes;
        const recipe = foundItemRec
          ? Array.isArray(foundItemRec)
            ? foundItemRec[0]
            : foundItemRec
          : null;

        if (!recipe) continue;

        const recipeIngs = recipeIngredients.filter(ri => ri.recipe_id === dishRecipe.recipe_id);

        // Add to recipe grouped
        section.recipeGrouped.push({
          recipeId: dishRecipe.recipe_id,
          recipeName: recipe.recipe_name || recipe.name,
          dishId: item.dish_id,
          dishName: itemDish.dish_name,
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
              name: itemDish.dish_name,
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
                  name: itemDish.dish_name,
                  quantity: dishRecipe.quantity,
                },
              ],
            });
          }
        }
      }
    } else if (item.recipe_id && item.recipes) {
      // Direct recipe
      const itemRecipe = Array.isArray(item.recipes) ? item.recipes[0] : item.recipes;
      if (!itemRecipe) continue;

      const recipeIngs = recipeIngredients.filter(ri => ri.recipe_id === item.recipe_id);

      section.recipeGrouped.push({
        recipeId: item.recipe_id,
        recipeName: itemRecipe.recipe_name || itemRecipe.name,
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
            name: itemRecipe.recipe_name || itemRecipe.name,
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
                name: itemRecipe.recipe_name || itemRecipe.name,
              },
            ],
          });
        }
      }
    }
  }

  return Array.from(sectionMap.values());
}
