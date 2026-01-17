import { IngredientGroup, IngredientRow } from './types';

export function groupIngredients(ingredients: IngredientRow[]): Record<string, IngredientGroup> {
  const ingGroups: Record<string, IngredientGroup> = {};
  ingredients.forEach(row => {
    const key = [
      String(row.ingredient_name || '')
        .toLowerCase()
        .trim(),
      row.supplier || '',
      row.brand || '',
      row.pack_size || '',
      row.unit || '',
      row.cost_per_unit ?? '',
    ].join('|');
    if (!ingGroups[key]) ingGroups[key] = { ids: [] };
    ingGroups[key].ids.push(row.id);
  });
  return ingGroups;
}
