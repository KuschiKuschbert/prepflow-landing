'use client';

import { format, addDays, parseISO } from 'date-fns';

interface DayTabBarProps {
  startDate: string;
  endDate: string | null;
  activeDay: number;
  onDayChange: (day: number) => void;
}

export function DayTabBar({ startDate, endDate, activeDay, onDayChange }: DayTabBarProps) {
  const start = parseISO(startDate);
  const end = endDate ? parseISO(endDate) : start;
  const totalDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);

  if (totalDays <= 1) return null;

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-[var(--background)] p-1">
      {days.map(day => {
        const dayDate = addDays(start, day - 1);
        const isActive = activeDay === day;

        return (
          <button
            key={day}
            onClick={() => onDayChange(day)}
            className={`flex flex-col items-center rounded-lg px-4 py-2 text-xs transition-all ${
              isActive
                ? 'bg-[var(--primary)]/15 font-semibold text-[var(--primary)]'
                : 'text-[var(--foreground-muted)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <span className="font-medium">Day {day}</span>
            <span className="mt-0.5 text-[10px] opacity-75">{format(dayDate, 'EEE, MMM d')}</span>
          </button>
        );
      })}
    </div>
  );
}
