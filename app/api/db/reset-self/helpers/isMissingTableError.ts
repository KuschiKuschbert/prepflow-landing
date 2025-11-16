/**
 * Check if error message indicates a missing table.
 *
 * @param {string | undefined} msg - Error message
 * @returns {boolean} True if error indicates missing table
 */
export function isMissingTableError(msg: string | undefined): boolean {
  if (!msg) return false;
  const m = msg.toLowerCase();
  return (
    m.includes('could not find the table') ||
    (m.includes('does not exist') && (m.includes('relation') || m.includes('table'))) ||
    m.includes('schema cache')
  );
}
