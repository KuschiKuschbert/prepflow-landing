/**
 * Convert a timeFilter string into ISO date range params for server queries.
 * Extracted from useEquipmentLogs to keep hook under size limit.
 */
export function getDateRange(timeFilter: '24h' | '7d' | '30d' | 'all'): {
  dateFrom: string | null;
  dateTo: string | null;
} {
  const today = new Date();
  const toISO = (d: Date) => d.toISOString().split('T')[0];
  const todayStr = toISO(today);

  switch (timeFilter) {
    case '24h': {
      const from = new Date(today);
      from.setDate(from.getDate() - 1);
      return { dateFrom: toISO(from), dateTo: todayStr };
    }
    case '7d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 7);
      return { dateFrom: toISO(from), dateTo: todayStr };
    }
    case '30d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { dateFrom: toISO(from), dateTo: todayStr };
    }
    case 'all':
    default:
      return { dateFrom: null, dateTo: null };
  }
}
