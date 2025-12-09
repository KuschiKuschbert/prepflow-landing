/**
 * Record processing utilities for cleaning records formatting
 */

import type { TaskWithCompletions } from '@/lib/cleaning/completion-logic';
import { getTaskStatusForDate } from './helpers';
import type { CleaningRecordExportData } from '../formatCleaningRecordsForPrint';

export interface CleaningRecord {
  task: TaskWithCompletions;
  date: string;
  status: { status: string; color: string; completedDate?: string };
}

/**
 * Process cleaning tasks into individual records
 *
 * @param {CleaningRecordExportData} data - Cleaning records data
 * @returns {CleaningRecord[]} Array of processed records
 */
export function processCleaningRecords(data: CleaningRecordExportData): CleaningRecord[] {
  const { tasks, dateRange, statusFilter } = data;

  // Flatten tasks with completions into individual records
  const records: CleaningRecord[] = [];

  tasks.forEach(task => {
    if (!task.frequency_type) return;

    // Get all dates this task should appear on
    const dates = new Set<string>();

    // Add dates from completions
    task.completions.forEach(completion => {
      dates.add(completion.completion_date);
    });

    // If date range provided, add dates in range
    if (dateRange) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      const current = new Date(start);

      while (current <= end) {
        dates.add(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    }

    // Create records for each date
    dates.forEach(date => {
      const status = getTaskStatusForDate(task, date);

      // Apply status filter if provided
      if (statusFilter && statusFilter !== 'all') {
        if (statusFilter === 'completed' && status.status !== 'Completed') return;
        if (statusFilter === 'pending' && status.status !== 'Pending') return;
        if (statusFilter === 'overdue' && status.status !== 'Overdue') return;
      }

      records.push({ task, date, status });
    });
  });

  // Sort records by date (most recent first)
  records.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });

  return records;
}
