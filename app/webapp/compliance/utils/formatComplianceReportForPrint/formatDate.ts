/**
 * Format date in Australian format
 *
 * @param {string | null | undefined} dateString - Date string to format
 * @returns {string} Formatted date or 'N/A'
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
