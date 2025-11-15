'use client';

import { useState } from 'react';
import { DateRange, PerformanceItem } from '../types';
import { fetchPerformanceData as fetchPerformanceApi } from '../utils/performance-api';

export function usePreviousPeriodData() {
  const [previousPeriodData, setPreviousPeriodData] = useState<PerformanceItem[] | null>(null);

  const fetchPreviousPeriodData = async (dateRange?: DateRange) => {
    if (!dateRange?.startDate || !dateRange?.endDate) {
      setPreviousPeriodData(null);
      return;
    }

    try {
      const daysDiff = Math.ceil(
        (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const previousEndDate = new Date(dateRange.startDate);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      previousEndDate.setHours(23, 59, 59, 999);
      const previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousStartDate.getDate() - daysDiff + 1);
      previousStartDate.setHours(0, 0, 0, 0);

      const previousRange: DateRange = {
        startDate: previousStartDate,
        endDate: previousEndDate,
        preset: 'custom',
      };

      const previousState = await fetchPerformanceApi(previousRange);
      setPreviousPeriodData(previousState.performanceItems);
    } catch (error) {
      console.warn('Could not fetch previous period data for trends:', error);
      setPreviousPeriodData(null);
    }
  };

  return {
    previousPeriodData,
    fetchPreviousPeriodData,
  };
}
