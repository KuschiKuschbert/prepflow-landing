import { DBDishIngredient, SectionData } from '../../types';

export function processDishIngredients(
  dishId: string,
  dishName: string,
  dishIngredients: DBDishIngredient[],
  sectionsData: Map<string | null, SectionData>,
  dishSection: { sectionId: string | null; sectionName: string },
  recipeMultiplier: number,
) {
  if (dishIngredients && dishIngredients.length > 0) {
    const sectionKey = dishSection.sectionId || null;
    if (!sectionsData.has(sectionKey)) {
      sectionsData.set(sectionKey, {
        sectionId: dishSection.sectionId,
        sectionName: dishSection.sectionName,
        aggregatedIngredients: [],
        recipeGrouped: [],
        prepInstructions: [],
      });
    }

    const section = sectionsData.get(sectionKey)!;

    for (const di of dishIngredients) {
      const ingredient = di.ingredients;
      if (ingredient) {
        const ingredientId = di.ingredient_id;
        const ingredientName = ingredient.ingredient_name || ingredient.name || 'Unknown';

        const existing = section.aggregatedIngredients.find(
          agg => agg.ingredientId === ingredientId && agg.unit === di.unit,
        );

        if (existing) {
          existing.totalQuantity += Number(di.quantity) * recipeMultiplier;
          existing.sources.push({
            type: 'dish',
            id: dishId,
            name: dishName,
            quantity: Number(di.quantity) * recipeMultiplier,
          });
        } else {
          section.aggregatedIngredients.push({
            ingredientId,
            name: ingredientName,
            totalQuantity: Number(di.quantity) * recipeMultiplier,
            unit: di.unit,
            sources: [
              {
                type: 'dish',
                id: dishId,
                name: dishName,
                quantity: Number(di.quantity) * recipeMultiplier,
              },
            ],
          });
        }
      }
    }
  }
}
