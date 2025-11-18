import { PostgrestError } from '@supabase/supabase-js';

interface ApiError {
  message: string;
  isApiError: true;
}

type InsertError = PostgrestError | ApiError;

/**
 * Format error message from insert error.
 *
 * @param {InsertError} error - Error object
 * @returns {string} Formatted error message
 */
export function formatIngredientInsertError(error: InsertError): string {
  if ('isApiError' in error && error.isApiError) {
    return error.message;
  }
  const pgError = error as { code?: string; message?: string; details?: string; hint?: string };
  return (
    pgError.message ||
    (pgError.code
      ? `Database error (${pgError.code})${pgError.details ? `: ${pgError.details}` : ''}${pgError.hint ? ` Hint: ${pgError.hint}` : ''}`
      : 'Failed to add ingredient')
  );
}

/**
 * Handle ingredient insert error with rollback.
 *
 * @param {InsertError} error - Error object
 * @param {T[]} originalIngredients - Original ingredients for rollback
 * @param {Function} setIngredients - Ingredients state setter
 * @param {Function} setError - Error state setter
 * @param {Function} setShowAddForm - Show form state setter (optional)
 */
export function handleIngredientInsertError<T>(
  error: InsertError,
  originalIngredients: T[],
  setIngredients: React.Dispatch<React.SetStateAction<T[]>>,
  setError: (error: string) => void,
  setShowAddForm?: (show: boolean) => void,
): void {
  // Revert optimistic update on error
  setIngredients(originalIngredients);
  // Reopen form on error
  if (setShowAddForm) setShowAddForm(true);
  const errorMsg = formatIngredientInsertError(error);
  setError(`Failed to add ingredient: ${errorMsg}`);
}
