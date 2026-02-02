import { COGSCalculation } from '@/lib/types/cogs';
import { clearCalculations, removeCalculation } from '../utils/ingredientManagement';

/**
 * Create simple calculation callbacks.
 * Note: useCallback should be applied in the parent hook.
 *
 * @param {Function} setCalculations - Calculations setter
 * @returns {Object} Simple callbacks
 */
export function createSimpleCallbacks(
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
) {
  const removeCalculationCallback = (ingredientId: string) =>
    removeCalculation(setCalculations, ingredientId);

  const clearCalculationsCallback = () => clearCalculations(setCalculations);

  return {
    removeCalculation: removeCalculationCallback,
    clearCalculations: clearCalculationsCallback,
  };
}
