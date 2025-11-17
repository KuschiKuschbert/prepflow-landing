import { logger } from '@/lib/logger';
import type { DishBuilderState } from '../../types';
import type { COGSCalculation } from '../../../cogs/types';

interface DishSaveProps {
  dishState: DishBuilderState;
  calculations: COGSCalculation[];
  setError: (error: string) => void;
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>;
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

export async function saveDish({
  dishState,
  calculations,
  setError,
  setDishState,
  setCalculations,
}: DishSaveProps): Promise<{ success: boolean; recipe?: any; dish?: any }> {
  if (!dishState.dishName.trim()) {
    setError('Dish name is required');
    return { success: false };
  }
  if (calculations.length === 0) {
    setError('At least one ingredient is required');
    return { success: false };
  }
  if (dishState.itemType === 'dish' && dishState.sellingPrice <= 0) {
    setError('Selling price must be greater than 0');
    return { success: false };
  }
  if (dishState.itemType === 'recipe' && (!dishState.yield || dishState.yield <= 0)) {
    setError('Yield must be greater than 0');
    return { success: false };
  }
  const resetForm = () => {
    setDishState({
      dishName: '',
      description: '',
      sellingPrice: 0,
      itemType: 'dish',
      yield: 1,
      yield_unit: 'portion',
      instructions: '',
    });
    setCalculations([]);
  };
  try {
    const itemIngredients = calculations.map(calc => ({
      ingredient_id: calc.ingredientId,
      quantity: calc.quantity,
      unit: calc.unit,
    }));
    if (dishState.itemType === 'recipe') {
      const recipeResponse = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dishState.dishName.trim(),
          yield: dishState.yield || 1,
          yield_unit: dishState.yield_unit || 'portion',
          category: 'Uncategorized',
          description: dishState.description?.trim() || null,
          instructions: dishState.instructions?.trim() || null,
        }),
      });
      const recipeResult = await recipeResponse.json();
      if (!recipeResponse.ok) {
        setError(recipeResult.error || recipeResult.message || 'Failed to save recipe');
        return { success: false };
      }
      const recipeId = recipeResult.recipe?.id || recipeResult.recipe?.[0]?.id;
      if (!recipeId) {
        setError('Failed to get recipe ID after creation');
        return { success: false };
      }
      const ingredientsResponse = await fetch(`/api/recipes/${recipeId}/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: itemIngredients.map(ing => ({
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
          isUpdate: false,
        }),
      });
      if (!ingredientsResponse.ok) {
        const ingredientsResult = await ingredientsResponse.json();
        setError(ingredientsResult.error || 'Failed to save recipe ingredients');
        return { success: false };
      }
      resetForm();
      return { success: true, recipe: recipeResult.recipe };
    } else {
      const response = await fetch('/api/dishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dish_name: dishState.dishName.trim(),
          description: dishState.description.trim() || null,
          selling_price: dishState.sellingPrice,
          ingredients: itemIngredients,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || result.message || 'Failed to save dish');
        return { success: false };
      }
      resetForm();
      return { success: true, dish: result.dish };
    }
  } catch (err) {
    logger.error(`Error saving ${dishState.itemType}:`, err);
    setError(err instanceof Error ? err.message : `Failed to save ${dishState.itemType}`);
    return { success: false };
  }
}
