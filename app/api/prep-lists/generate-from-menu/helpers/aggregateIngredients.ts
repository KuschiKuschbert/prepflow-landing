import { DBDishRecipe, DBRecipeIngredient, MenuItemData, SectionData } from '../types';
import { processDishIngredients } from './aggregation/processDishIngredients';
import { processRecipeIngredients } from './aggregation/processRecipeIngredients';

export function aggregateIngredientsBySection(
  menuItems: MenuItemData[],
  dishRecipes: DBDishRecipe[],
  recipeIngredients: DBRecipeIngredient[],
): SectionData[] {
  const sectionMap = new Map<string, SectionData>();

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

    if (item.dish_id && itemDish) {
      processDishIngredients({
        item,
        dishRecipes,
        recipeIngredients,
        menuItems,
        section,
      });
    } else if (item.recipe_id && item.recipes) {
      processRecipeIngredients({
        item,
        recipeIngredients,
        section,
      });
    }
  }

  return Array.from(sectionMap.values());
}
