'use client';

import { useMemo } from 'react';

type GridFilter = 'today' | 'next2days' | 'week' | 'all';

interface UseFilteredDatesParams {
  filter: GridFilter;
  startDate: Date;
  endDate: Date;
}

interface FilteredDatesResult {
  filteredStartDate: Date;
  filteredEndDate: Date;
  dates: string[];
}

export function useFilteredDates({
  filter,
  startDate,
  endDate,
}: UseFilteredDatesParams): FilteredDatesResult {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filteredStart: Date;
    let filteredEnd: Date;

    switch (filter) {
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
        filteredEnd.setDate(filteredEnd.getDate() + 6); // Today + 6 days = 7 days total
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

    return {
      filteredStartDate: filteredStart,
      filteredEndDate: filteredEnd,
      dates: dateArray,
    };
  }, [filter, startDate, endDate]);
}
