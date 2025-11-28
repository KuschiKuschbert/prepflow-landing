/**
 * Types for COGSTableGrouped component.
 */

import type { COGSCalculation } from '../../types';

export interface RecipeGroup {
  recipeId: string;
  recipeName: string;
  quantity: number;
  yield: number;
  yieldUnit: string;
  calculations: COGSCalculation[];
  totalCost: number;
}
