/**
 * Format error message for ingredient insertion failures.
 *
 * @param {any} error - Error object
 * @returns {string} Formatted error message
 */
export function formatIngredientErrorMessage(error: any): string {
  return (
    error?.message ||
    (error?.code
      ? `Database error (${error.code})${error?.details ? `: ${error.details}` : ''}${error?.hint ? ` Hint: ${error.hint}` : ''}`
      : error?.details || 'Failed to add ingredient')
  );
}
