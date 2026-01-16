/**
 * Format error message for ingredient insertion failures.
 *
 * @param {any} error - Error object
 * @returns {string} Formatted error message
 */
export function formatIngredientErrorMessage(error: unknown): string {
  const err = error as { message?: string; code?: string; details?: string; hint?: string };
  return (
    err?.message ||
    (err?.code
      ? `Database error (${err.code})${err?.details ? `: ${err.details}` : ''}${err?.hint ? ` Hint: ${err.hint}` : ''}`
      : err?.details || 'Failed to add ingredient')
  );
}
