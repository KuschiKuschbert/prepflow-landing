/**
 * Hook for calculating stats dates based on grid filter
 */

import { useMemo } from 'react';

export function useStatsDates(
  gridFilter: 'today' | 'next2days' | 'week' | 'all',
  startDate: Date,
  endDate: Date,
) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredStart: Date;
    let filteredEnd: Date;

    switch (gridFilter) {
      case 'today':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        break;
      case 'next2days':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        filteredEnd.setDate(filteredEnd.getDate() + 2);
        break;
      case 'week':
        filteredStart = new Date(today);
        filteredEnd = new Date(today);
        filteredEnd.setDate(filteredEnd.getDate() + 6);
        break;
      case 'all':
      default:
        filteredStart = new Date(startDate);
        filteredEnd = new Date(endDate);
        break;
    }

    const dateArray: string[] = [];
    const current = new Date(filteredStart);
    const end = new Date(filteredEnd);

    while (current <= end) {
      dateArray.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }

    return dateArray;
  }, [gridFilter, startDate, endDate]);
}



