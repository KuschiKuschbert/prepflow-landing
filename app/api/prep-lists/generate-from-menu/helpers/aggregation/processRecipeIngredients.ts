import type {
  AggregatedIngredient,
  DBRecipeIngredient,
  MenuItemData,
  SectionData,
} from '../../types';

interface ProcessRecipeParams {
  item: MenuItemData;
  recipeIngredients: DBRecipeIngredient[];
  section: SectionData;
}

export function processRecipeIngredients({
  item,
  recipeIngredients,
  section,
}: ProcessRecipeParams): void {
  const itemRecipe = Array.isArray(item.recipes) ? item.recipes[0] : item.recipes;
  if (!itemRecipe) return;

  const recipeIngs = recipeIngredients.filter(ri => ri.recipe_id === item.recipe_id);

  section.recipeGrouped.push({
    recipeId: item.recipe_id!,
    recipeName: itemRecipe.recipe_name || itemRecipe.name,
    ingredients: recipeIngs.map(ri => ({
      ingredientId: ri.ingredient_id,
      name: ri.ingredients?.ingredient_name || 'Unknown',
      quantity: ri.quantity || 0,
      unit: ri.unit || '',
    })),
  });

  for (const ri of recipeIngs) {
    addToAggregation(section.aggregatedIngredients, ri, ri.quantity || 0, {
      type: 'recipe',
      id: item.recipe_id!,
      name: itemRecipe.recipe_name || itemRecipe.name,
    });
  }
}

function addToAggregation(
  aggregated: AggregatedIngredient[],
  ri: DBRecipeIngredient,
  quantity: number,
  source: { type: 'dish' | 'recipe'; id: string; name: string },
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
