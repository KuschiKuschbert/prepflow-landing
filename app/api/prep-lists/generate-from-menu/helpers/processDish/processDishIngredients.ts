import { DBDishIngredient, SectionData } from '../../types';
import { updateAggregatedIngredient } from './helpers/updateAggregatedIngredient';

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
      updateAggregatedIngredient(section, di, dishId, dishName, recipeMultiplier);
    }
  }
}
