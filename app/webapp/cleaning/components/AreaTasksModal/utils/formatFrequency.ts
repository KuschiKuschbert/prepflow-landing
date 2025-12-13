/**
 * Utility function to format frequency type for display
 */

export function formatFrequencyType(frequency: string): string {
  const map: Record<string, string> = {
    daily: 'Daily',
    'bi-daily': 'Bi-Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    '3-monthly': 'Every 3 Months',
  };
  return map[frequency] || frequency;
}
