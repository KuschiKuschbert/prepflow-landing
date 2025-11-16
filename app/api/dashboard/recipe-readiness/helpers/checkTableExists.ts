/**
 * Check if a database error indicates a missing table.
 *
 * @param {any} error - Database error
 * @returns {boolean} True if table is missing
 */
export function isTableNotFound(error: any): boolean {
  const errorCode = error?.code;
  const errorMessage = error?.message || '';
  return (
    errorCode === '42P01' ||
    errorMessage.includes('does not exist') ||
    (errorMessage.includes('relation') && errorMessage.includes('does not exist'))
  );
}
