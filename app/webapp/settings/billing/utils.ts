/**
 * Format date string to Australian locale format
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Calculate usage percentage
 */
export function getUsagePercentage(used: number, limit: number | null | undefined): number {
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}
