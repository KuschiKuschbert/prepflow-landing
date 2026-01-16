import { useCallback, useEffect } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import { logger } from '@/lib/logger';
import type { Shift } from '../../../types';

interface UseRosterWeekNavigationProps {
  weekStartDate?: Date;
  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
  setShifts: (shifts: Shift[]) => void;
}

/**
 * Hook for managing week navigation and fetching shifts
 */
export function useRosterWeekNavigation({
  weekStartDate,
  currentWeekStart,
  setCurrentWeekStart,
  setShifts,
}: UseRosterWeekNavigationProps) {
  // Initialize week start
  useEffect(() => {
    if (weekStartDate) {
      setCurrentWeekStart(startOfWeek(weekStartDate, { weekStartsOn: 0 }));
    }
  }, [weekStartDate, setCurrentWeekStart]);

  // Refetch shifts when week changes
  useEffect(() => {
    const fetchShiftsForWeek = async () => {
      try {
        const weekEnd = addDays(currentWeekStart, 6);
        const weekStartStr = format(currentWeekStart, 'yyyy-MM-dd');
        const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

        const response = await fetch(
          `/api/roster/shifts?start_date=${weekStartStr}&end_date=${weekEndStr}&status=all`,
        );
        const data = await response.json();
        if (data.success && data.shifts) {
          setShifts(data.shifts);
        }
      } catch (err) {
        logger.error('Failed to fetch shifts for week', err);
      }
    };

    // Only fetch if we have a valid week start (not initial mount with no weekStartDate)
    if (currentWeekStart) {
      fetchShiftsForWeek();
    }
  }, [currentWeekStart, setShifts]);

  const navigateWeek = useCallback(
    (direction: 'prev' | 'next') => {
      const newDate = addDays(currentWeekStart, direction === 'next' ? 7 : -7);
      setCurrentWeekStart(newDate);
    },
    [currentWeekStart, setCurrentWeekStart],
  );

  return {
    navigateWeek,
  };
}
