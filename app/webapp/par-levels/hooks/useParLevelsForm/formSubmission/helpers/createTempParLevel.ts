import type { ParLevel, Ingredient } from '../../../../types';

interface CreateTempParLevelParams {
  formData: {
    ingredientId: string;
    unit: string;
  };
  ingredients: Ingredient[];
  parLevelValue: number;
  reorderPointValue: number;
  tempId: string;
}

export function createTempParLevel({
  formData,
  ingredients,
  parLevelValue,
  reorderPointValue,
  tempId,
}: CreateTempParLevelParams): ParLevel {
  const selectedIngredient = ingredients.find(ing => ing.id === formData.ingredientId);
  return {
    id: tempId,
    ingredient_id: formData.ingredientId,
    par_level: parLevelValue,
    reorder_point: reorderPointValue,
    unit: formData.unit,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ingredients: {
      id: selectedIngredient?.id || formData.ingredientId,
      ingredient_name: selectedIngredient?.ingredient_name || '',
      unit: selectedIngredient?.unit,
      category: selectedIngredient?.category,
    },
  };
}
