'use client';

import { useMemo } from 'react';
import { calculateTaskDates } from '@/lib/cleaning/frequency-calculator';
import type { FrequencyType } from '@/lib/cleaning/frequency-calculator';

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
      return [];
    }
  }, [frequencyType, startDate]);

  if (previewDates.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-[#2a2a2a] bg-[#2a2a2a]/30 p-3">
      <div className="mb-2 text-xs font-medium text-gray-400">Next Occurrences</div>
      <div className="flex flex-wrap gap-2">
        {previewDates.map((dateStr, index) => {
          const date = new Date(dateStr);
          const isToday = date.toDateString() === new Date().toDateString();
          return (
            <div
              key={dateStr}
              className={`rounded-lg px-2 py-1 text-xs ${
                isToday
                  ? 'border border-[#29E7CD]/30 bg-[#29E7CD]/20 text-[#29E7CD]'
                  : 'border border-[#2a2a2a] bg-[#1f1f1f] text-gray-300'
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
