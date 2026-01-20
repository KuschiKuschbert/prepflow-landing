import { collectRecipeAndDishIds } from './collectRecipeAndDishIds';
import { fetchDishData, fetchRecipeIngredients } from './fetchBatchData';
import { fetchKitchenSections } from './fetchKitchenSections';
import { fetchMenuData } from './fetchMenuData';
import { mergeDishRecipeIngredients } from './mergeDishRecipeIngredients';

export async function fetchAndMergeData(menuId: string) {
  // Fetch menu data
  const { menu, menuItems } = await fetchMenuData(menuId);

  if (!menuItems || menuItems.length === 0) {
    return {
      menu,
      menuItems: [],
      sectionsMap: new Map(),
      dishSectionsMap: new Map(),
      dishRecipesMap: new Map(),
      dishIngredientsMap: new Map(),
      recipeIngredientsMap: new Map(),
      recipeInstructionsMap: new Map(),
    };
  }

  // Fetch all kitchen sections
  const sectionsMap = await fetchKitchenSections();

  // Collect all recipe IDs and dish IDs for batch fetching
  const { recipeIds, dishIds, recipeInstructionsMap } = collectRecipeAndDishIds(menuItems);

  // Batch fetch all recipe ingredients upfront
  const recipeIngredientsMap = await fetchRecipeIngredients(recipeIds);

  // Batch fetch all dish data upfront
  const { dishSectionsMap, dishRecipesMap, dishIngredientsMap } = await fetchDishData(
    dishIds,
    recipeIds,
    recipeInstructionsMap,
  );

  // Merge dish recipe ingredients into main map
  await mergeDishRecipeIngredients(recipeIds, recipeIngredientsMap);

  return {
    menu,
    menuItems,
    sectionsMap,
    dishSectionsMap,
    dishRecipesMap,
    dishIngredientsMap,
    recipeIngredientsMap,
    recipeInstructionsMap,
  };
}
