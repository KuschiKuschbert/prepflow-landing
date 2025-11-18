import type { COGSCalculation } from '../../../../cogs/types';

/**
 * Remove a calculation by ingredient ID.
 *
 * @param {React.Dispatch<React.SetStateAction<COGSCalculation[]>>} setCalculations - Setter function
 * @param {string} ingredientId - Ingredient ID to remove
 */
export function removeCalculation(
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
  ingredientId: string,
): void {
  setCalculations(prev => prev.filter(calc => calc.ingredientId !== ingredientId));
}

/**
 * Clear all calculations.
 *
 * @param {React.Dispatch<React.SetStateAction<COGSCalculation[]>>} setCalculations - Setter function
 */
export function clearCalculations(
  setCalculations: React.Dispatch<React.SetStateAction<COGSCalculation[]>>,
): void {
  setCalculations([]);
}
