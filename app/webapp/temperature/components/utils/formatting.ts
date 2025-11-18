/**
 * Temperature log formatting utilities.
 */

/**
 * Format time string to HH:MM format.
 *
 * @param {string} timeString - Time string in HH:MM:SS format
 * @returns {string} Formatted time string
 */
export function formatTime(timeString: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
}

/**
 * Format date string using provided formatter function.
 *
 * @param {string} dateString - Date string to format
 * @param {Function} formatDate - Date formatting function
 * @returns {string} Formatted date string
 */
export function formatDateString(dateString: string, formatDate: (d: Date) => string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return formatDate(date);
}
