import { NormalizedIngredientData } from '@/lib/ingredients/normalizeIngredientData';
import { createOptimisticIngredient, replaceTempIngredient } from './optimisticIngredientAdd';

interface OptimisticUpdateProps<T> {
  normalized: NormalizedIngredientData;
  originalIngredients: T[];
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<T>) => void;
  DEFAULT_INGREDIENT: Partial<T>;
}

/**
 * Perform optimistic update for ingredient addition.
 *
 * @param {OptimisticUpdateProps<T>} props - Optimistic update props
 * @returns {string} Temporary ingredient ID
 */
export function performOptimisticUpdate<T extends { id: string }>({
  normalized,
  originalIngredients,
  setIngredients,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
  DEFAULT_INGREDIENT,
}: OptimisticUpdateProps<T>): string {
  const tempIngredient = createOptimisticIngredient<T>(normalized);
  const tempId = tempIngredient.id;

  setIngredients(prev => {
    originalIngredients.length = 0;
    originalIngredients.push(...prev);
    return [...prev, tempIngredient];
  });

  if (setShowAddForm) setShowAddForm(false);
  if (setWizardStep) setWizardStep(1);
  if (setNewIngredient) setNewIngredient(DEFAULT_INGREDIENT);

  return tempId;
}

/**
 * Replace temporary ingredient with server response.
 *
 * @param {T[]} ingredients - Current ingredients
 * @param {string} tempId - Temporary ingredient ID
 * @param {T} serverIngredient - Ingredient from server
 * @param {Function} setIngredients - Ingredients setter
 */
export function replaceWithServerIngredient<T extends { id: string }>(
  ingredients: T[],
  tempId: string,
  serverIngredient: T,
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>,
): void {
  setIngredients(prev => replaceTempIngredient(prev, tempId, serverIngredient));
}
