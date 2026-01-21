/**
 * Types for ingredient form logic.
 */

import { Ingredient } from '../types';
export type { Ingredient };

export interface UseIngredientFormLogicProps {
  ingredient?: Ingredient | null;
  onSave: (ingredient: Partial<Ingredient>) => Promise<void>;
}
