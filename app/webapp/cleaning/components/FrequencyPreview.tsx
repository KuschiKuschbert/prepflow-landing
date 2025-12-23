'use client';

import { useMemo } from 'react';
import { calculateTaskDates } from '@/lib/cleaning/frequency-calculator';
import type { FrequencyType } from '@/lib/cleaning/frequency-calculator';
import { logger } from '@/lib/logger';

interface FrequencyPreviewProps {
  frequencyType: FrequencyType | string;
  startDate?: Date;
}

/**
 * Frequency Preview Component
 * Shows next task occurrences based on selected frequency
 */
export function FrequencyPreview({ frequencyType, startDate }: FrequencyPreviewProps) {
  const previewDates = useMemo(() => {
    if (!frequencyType) return [];

    const today = startDate || new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30); // Add 30 days

    try {
      const dates = calculateTaskDates(frequencyType, today, endDate, today);
      return dates.slice(0, 5); // Show next 5 occurrences
    } catch (error) {
      logger.error('[FrequencyPreview.tsx] Error in catch block:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

      return [];
    }
  }, [frequencyType, startDate]);

  if (previewDates.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-3">
      <div className="mb-2 text-xs font-medium text-[var(--foreground-muted)]">Next Occurrences</div>
      <div className="flex flex-wrap gap-2">
        {previewDates.map((dateStr, index) => {
          const date = new Date(dateStr);
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={dateStr}
              className={`rounded-lg px-2 py-1 text-xs ${
                isToday
                  ? 'border border-[var(--primary)]/30 bg-[var(--primary)]/20 text-[var(--primary)]'
                  : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-secondary)]'
              }`}
            >
              {isToday
                ? 'Today'
                : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
