import { logger } from '@/lib/logger';
import type { DishBuilderState } from '../../types';
import type { COGSCalculation } from '../../../cogs/types';
import { validateDishState } from '../helpers/validateDish';
import { saveRecipe } from '../helpers/saveRecipe';
import { saveDishItem } from '../helpers/saveDishItem';

interface DishSaveProps {
  dishState: DishBuilderState;
  calculations: COGSCalculation[];
  setError: (error: string) => void;
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>;
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

const DEFAULT_DISH_STATE: DishBuilderState = {
  dishName: '',
  description: '',
  sellingPrice: 0,
  itemType: 'dish',
  yield: 1,
  yield_unit: 'portion',
  instructions: '',
};

/**
 * Reset form to default state.
 *
 * @param {Function} setDishState - Dish state setter
 * @param {Function} setCalculations - Calculations setter
 */
function resetForm(
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>,
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
): void {
  setDishState(DEFAULT_DISH_STATE);
  setCalculations([]);
}

export async function saveDish({
  dishState,
  calculations,
  setError,
  setDishState,
  setCalculations,
}: DishSaveProps): Promise<{ success: boolean; recipe?: any; dish?: any }> {
  // Validate dish state
  const validationError = validateDishState(dishState, calculations);
  if (validationError) {
    setError(validationError);
    return { success: false };
  }

  try {
    const itemIngredients = calculations.map(calc => ({
      ingredient_id: calc.ingredientId,
      quantity: calc.quantity,
      unit: calc.unit,
    }));

    if (dishState.itemType === 'recipe') {
      const result = await saveRecipe({ dishState, itemIngredients });
      if (!result.success) {
        setError(result.error || 'Failed to save recipe');
        return { success: false };
      }
      resetForm(setDishState, setCalculations);
      return { success: true, recipe: result.recipe };
    } else {
      const result = await saveDishItem({ dishState, itemIngredients });
      if (!result.success) {
        setError(result.error || 'Failed to save dish');
        return { success: false };
      }
      resetForm(setDishState, setCalculations);
      return { success: true, dish: result.dish };
    }
  } catch (err) {
    logger.error(`Error saving ${dishState.itemType}:`, err);
    setError(err instanceof Error ? err.message : `Failed to save ${dishState.itemType}`);
    return { success: false };
  }
}
