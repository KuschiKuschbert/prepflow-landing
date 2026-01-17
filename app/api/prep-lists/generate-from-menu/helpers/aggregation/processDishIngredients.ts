import type {
    AggregatedIngredient,
    DBDishRecipe,
    DBRecipeIngredient,
    MenuItemData,
    SectionData
} from '../../types';

interface ProcessDishParams {
  item: MenuItemData;
  dishRecipes: DBDishRecipe[];
  recipeIngredients: DBRecipeIngredient[];
  menuItems: MenuItemData[];
  section: SectionData;
}

export function processDishIngredients({
  item,
  dishRecipes,
  recipeIngredients,
  menuItems,
  section,
}: ProcessDishParams): void {
  const itemDish = item.dishes
    ? Array.isArray(item.dishes)
      ? item.dishes[0]
      : item.dishes
    : null;

  if (!itemDish) return;

  const dishRecipesForDish = dishRecipes.filter(dr => dr.dish_id === item.dish_id);

  for (const dishRecipe of dishRecipesForDish) {
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
      dishId: item.dish_id ?? undefined,
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
      addToAggregation(
        section.aggregatedIngredients,
        ri,
        (dishRecipe.quantity || 1) * (ri.quantity || 0),
        { type: 'dish', id: item.dish_id!, name: itemDish.dish_name, quantity: dishRecipe.quantity },
      );
    }
  }
}

function addToAggregation(
  aggregated: AggregatedIngredient[],
  ri: DBRecipeIngredient,
  quantity: number,
  source: { type: 'dish' | 'recipe'; id: string; name: string; quantity?: number },
): void {
  const existing = aggregated.find(agg => agg.ingredientId === ri.ingredient_id);

  if (existing) {
    existing.totalQuantity += quantity;
    existing.sources.push(source);
  } else {
    aggregated.push({
      ingredientId: ri.ingredient_id,
      name: ri.ingredients?.ingredient_name || 'Unknown',
      totalQuantity: quantity,
      unit: ri.unit || '',
      sources: [source],
    });
  }
}
