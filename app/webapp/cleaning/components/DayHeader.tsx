'use client';

import React, { useMemo } from 'react';

interface DayHeaderProps {
  date: Date;
  isToday?: boolean;
}

/**
 * Day Header Component
 * Displays day name and date for the cleaning grid
 * Optimized with memoization to prevent unnecessary re-renders
 */
function DayHeader({ date, isToday = false }: DayHeaderProps) {
  // Use date.getTime() as dependency to properly detect date changes
  const dateKey = useMemo(() => date.getTime(), [date]);

  const { dayName, dayNumber, monthName } = useMemo(() => {
    return {
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      monthName: date.toLocaleDateString('en-US', { month: 'short' }),
    };
  }, [date]);

  return (
    <div
      className={`flex flex-1 flex-col items-center justify-center border-r border-[var(--border)] bg-gradient-to-br from-[var(--muted)]/50 to-[var(--muted)]/20 px-3 py-4 text-center ${
        isToday ? 'bg-gradient-to-br from-[var(--primary)]/20 to-[var(--primary)]/10' : ''
      }`}
    >
      <div
        className={`text-xs font-medium ${isToday ? 'text-[var(--primary)]' : 'text-[var(--foreground-muted)]'}`}
      >
        {dayName}
      </div>
      <div
        className={`text-lg font-bold ${isToday ? 'text-[var(--primary)]' : 'text-[var(--foreground)]'}`}
      >
        {dayNumber}
      </div>
      <div
        className={`text-xs ${isToday ? 'text-[var(--primary)]' : 'text-[var(--foreground-subtle)]'}`}
      >
        {monthName}
      </div>
    </div>
  );
}

export const MemoizedDayHeader = React.memo(DayHeader);
