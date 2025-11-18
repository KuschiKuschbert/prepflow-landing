import { saveDish as saveDishHelper } from '../utils/dishSave';
import { DishBuilderState } from '../../types';
import { COGSCalculation } from '../../../cogs/types';

interface DishCallbacksProps {
  dishState: DishBuilderState;
  calculations: COGSCalculation[];
  setError: (error: string) => void;
  setDishState: React.Dispatch<React.SetStateAction<DishBuilderState>>;
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>;
}

/**
 * Create dish-related callbacks.
 * Note: useCallback should be applied in the parent hook.
 *
 * @param {DishCallbacksProps} props - Callback dependencies
 * @returns {Object} Dish callbacks
 */
export function createDishCallbacks({
  dishState,
  calculations,
  setError,
  setDishState,
  setCalculations,
}: DishCallbacksProps) {
  const saveDishCallback = async () =>
    saveDishHelper({ dishState, calculations, setError, setDishState, setCalculations });

  return {
    saveDish: saveDishCallback,
  };
}
