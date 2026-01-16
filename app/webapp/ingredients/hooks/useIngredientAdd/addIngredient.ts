/**
 * Core logic for adding an ingredient
 */

import { normalizeIngredientData } from '@/lib/ingredients/normalizeIngredientDataMain';
import { formatIngredientInsertError, handleIngredientInsertError } from '../helpers/errorHandling';
import { formatIngredientErrorMessage } from '../helpers/errorMessageFormatting';
import { handleIngredientInsert } from '../helpers/handleIngredientInsert';
import { performOptimisticUpdate, replaceWithServerIngredient } from '../helpers/optimisticUpdate';

interface AddIngredientParams<T> {
  ingredientData: Partial<T>;
  originalIngredients: T[];
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>;
  setError: (error: string) => void;
  setShowAddForm?: (show: boolean) => void;
  setWizardStep?: (step: number) => void;
  setNewIngredient?: (ingredient: Partial<T>) => void;
  DEFAULT_INGREDIENT: Partial<T>;
}

/**
 * Add ingredient with optimistic update and error handling
 */
export async function addIngredient<
  T extends { id: string; ingredient_name: string; cost_per_unit: number },
>({
  ingredientData,
  originalIngredients,
  setIngredients,
  setError,
  setShowAddForm,
  setWizardStep,
  setNewIngredient,
  DEFAULT_INGREDIENT,
}: AddIngredientParams<T>): Promise<{ success: boolean; tempId?: string; error?: string }> {
  const { normalized, error: normalizeError } = normalizeIngredientData(ingredientData);
  if (normalizeError) {
    setError(normalizeError);
    throw new Error(normalizeError);
  }

  // Perform optimistic update
  const tempId = performOptimisticUpdate({
    normalized,
    originalIngredients,
    setIngredients,
    setShowAddForm,
    setWizardStep,
    setNewIngredient,
    DEFAULT_INGREDIENT,
  });

  // Insert ingredient (with API fallback)
  const { data, error } = await handleIngredientInsert(normalized, ingredientData);

  if (error) {
    handleIngredientInsertError(
      error,
      originalIngredients,
      setIngredients,
      setError,
      setShowAddForm,
    );
    throw new Error(formatIngredientInsertError(error));
  }

  // Replace temp ingredient with real ingredient from server
  if (data) {
    replaceWithServerIngredient([], tempId, data as T, setIngredients);
  }

  return { success: true, tempId };
}

/**
 * Handle error rollback for ingredient addition
 */
export function rollbackIngredientAdd<T>(
  originalIngredients: T[],
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>,
  setShowAddForm?: (show: boolean) => void,
  error?: unknown,
  setError?: (error: string) => void,
): void {
  if (originalIngredients.length > 0) {
    setIngredients(originalIngredients);
  }
  if (setShowAddForm) setShowAddForm(true);
  if (setError && error) {
    setError(`Failed to add ingredient: ${formatIngredientErrorMessage(error)}`);
  }
}
