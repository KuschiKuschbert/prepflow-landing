/**
 * Group ingredients by sort option
 */

import { IngredientWithParLevel } from '../../../helpers/schemas';

export function groupIngredients(
  ingredients: IngredientWithParLevel[],
  sortBy: string,
): Record<string, IngredientWithParLevel[]> {
  const groupedIngredients: Record<string, IngredientWithParLevel[]> = {};

  if (sortBy === 'storage') {
    // Group by storage
    ingredients.forEach(ing => {
      const storage = ing.storage || 'Uncategorized';
      if (!groupedIngredients[storage]) {
        groupedIngredients[storage] = [];
      }
      groupedIngredients[storage].push(ing);
    });

    // Sort within each group by name
    Object.keys(groupedIngredients).forEach(key => {
      groupedIngredients[key].sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));
    });
  } else if (sortBy === 'name') {
    // Sort all by name, then group by first letter or just show as single group
    const sorted = [...ingredients].sort((a, b) =>
      a.ingredient_name.localeCompare(b.ingredient_name),
    );
    groupedIngredients['All Ingredients'] = sorted;
  } else if (sortBy === 'category') {
    // Group by category
    ingredients.forEach(ing => {
      const category = ing.category || 'Uncategorized';
      if (!groupedIngredients[category]) {
        groupedIngredients[category] = [];
      }
      groupedIngredients[category].push(ing);
    });

    // Sort within each group by name
    Object.keys(groupedIngredients).forEach(key => {
      groupedIngredients[key].sort((a, b) => a.ingredient_name.localeCompare(b.ingredient_name));
    });
  }

  return groupedIngredients;
}
