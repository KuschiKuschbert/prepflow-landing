/**
 * Format currency in Australian Dollars
 */
export function formatCurrency(amount: number, includeSymbol: boolean = true): string {
  if (includeSymbol) {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  }
  return new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

