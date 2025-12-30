/**
 * Formatting utilities for payroll calculations.
 */

/**
 * Formats currency amount for display.
 *
 * @param {number} amount - Amount in AUD
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats hours for display.
 *
 * @param {number} hours - Hours (decimal)
 * @returns {string} Formatted hours string (e.g., "8.5h" or "8h 30m")
 */
export function formatHours(hours: number): string {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (minutes === 0) {
    return `${wholeHours}h`;
  }

  return `${wholeHours}h ${minutes}m`;
}


