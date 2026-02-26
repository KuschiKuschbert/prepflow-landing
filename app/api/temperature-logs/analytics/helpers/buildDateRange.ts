/**
 * Calculate start/end dates for a period string or explicit dateFrom/dateTo.
 * Returns ISO date strings (YYYY-MM-DD).
 */
export function buildDateRange(
  period: string | null,
  dateFrom: string | null,
  dateTo: string | null,
): { dateFrom: string; dateTo: string } {
  const today = new Date();
  const toStr = (d: Date) => d.toISOString().split('T')[0];

  if (dateFrom && dateTo) {
    return { dateFrom, dateTo };
  }

  const todayStr = toStr(today);

  switch (period) {
    case '24h': {
      const from = new Date(today);
      from.setDate(from.getDate() - 1);
      return { dateFrom: toStr(from), dateTo: todayStr };
    }
    case '7d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 7);
      return { dateFrom: toStr(from), dateTo: todayStr };
    }
    case '30d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { dateFrom: toStr(from), dateTo: todayStr };
    }
    case '90d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 90);
      return { dateFrom: toStr(from), dateTo: todayStr };
    }
    case '1y': {
      const from = new Date(today);
      from.setFullYear(from.getFullYear() - 1);
      return { dateFrom: toStr(from), dateTo: todayStr };
    }
    case 'all':
    default: {
      return { dateFrom: '2000-01-01', dateTo: todayStr };
    }
  }
}
