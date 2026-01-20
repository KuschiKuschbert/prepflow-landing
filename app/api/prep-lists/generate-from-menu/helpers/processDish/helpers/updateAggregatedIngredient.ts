import { AggregatedIngredient, DBDishIngredient } from '../../../types';

export function updateAggregatedIngredient(
  feature: {
    aggregatedIngredients: AggregatedIngredient[];
  },
  di: DBDishIngredient,
  dishId: string,
  dishName: string,
  recipeMultiplier: number,
) {
  const ingredient = di.ingredients;
  if (!ingredient) return;

  const ingredientId = di.ingredient_id;
  const ingredientName = ingredient.ingredient_name || ingredient.name || 'Unknown';
  const quantityToAdd = Number(di.quantity) * recipeMultiplier;

  const existing = feature.aggregatedIngredients.find(
    agg => agg.ingredientId === ingredientId && agg.unit === di.unit,
  );

  if (existing) {
    existing.totalQuantity += quantityToAdd;
    existing.sources.push({
      type: 'dish',
      id: dishId,
      name: dishName,
      quantity: quantityToAdd,
    });
  } else {
    feature.aggregatedIngredients.push({
      ingredientId,
      name: ingredientName,
      totalQuantity: quantityToAdd,
      unit: di.unit,
      sources: [
        {
          type: 'dish',
          id: dishId,
          name: dishName,
          quantity: quantityToAdd,
        },
      ],
    });
  }
}
