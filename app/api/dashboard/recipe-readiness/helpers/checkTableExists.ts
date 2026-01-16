/**
 * Check if a database error indicates a missing table.
 *
 * @param {any} error - Database error
 * @returns {boolean} True if table is missing
 */
export function isTableNotFound(error: unknown): boolean {
  const err = error as { code?: string; message?: string };
  const errorCode = err?.code;
  const errorMessage = err?.message || '';
  return (
    errorCode === '42P01' ||
    errorMessage.includes('does not exist') ||
    (errorMessage.includes('relation') && errorMessage.includes('does not exist'))
  );
}
