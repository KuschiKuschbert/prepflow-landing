export { type IngredientRow, type MethodStepRow } from '../../recipe-cards/types';
import { IngredientRow, MethodStepRow } from '../../recipe-cards/types';

export interface RecipeCardData {
  id: string;
  title: string;
  baseYield: number;
  ingredients: IngredientRow[];
  methodSteps: MethodStepRow[];
  notes: string[];
  category: string;
}
