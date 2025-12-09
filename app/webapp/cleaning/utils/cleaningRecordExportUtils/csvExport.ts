/**
 * CSV export utilities for cleaning records
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { logger } from '@/lib/logger';
import type { CleaningRecordExportData } from '../formatCleaningRecordsForPrint';
import { getAreaName, getTaskStatusForDate, formatFrequencyType, formatDate } from './helpers';

/**
 * Export cleaning records to CSV
 *
 * @param {CleaningRecordExportData} data - Cleaning records data
 * @returns {void} Downloads CSV file
 */
export function exportCleaningRecordsToCSV(data: CleaningRecordExportData): void {
  try {
    // Flatten tasks with completions into individual records
    const records: Array<{
      date: string;
      area: string;
      task: string;
      frequency: string;
      status: string;
      completedDate: string;
      notes: string;
    }> = [];

    data.tasks.forEach(task => {
      if (!task.frequency_type) return;

      const dates = new Set<string>();
      task.completions.forEach(c => dates.add(c.completion_date));

      if (data.dateRange) {
        const start = new Date(data.dateRange.start);
        const end = new Date(data.dateRange.end);
        const current = new Date(start);
        while (current <= end) {
          dates.add(current.toISOString().split('T')[0]);
          current.setDate(current.getDate() + 1);
        }
      }

      dates.forEach(date => {
        const status = getTaskStatusForDate(task, date);

        // Apply status filter if provided
        if (data.statusFilter && data.statusFilter !== 'all') {
          if (data.statusFilter === 'completed' && status !== 'Completed') return;
          if (data.statusFilter === 'pending' && status !== 'Pending') return;
          if (data.statusFilter === 'overdue' && status !== 'Overdue') return;
        }

        const completion = task.completions.find(c => c.completion_date === date);
        const areaName = getAreaName(task);
        const taskName = task.task_name || 'Unnamed Task';
        const frequency = formatFrequencyType(task.frequency_type);

        records.push({
          date: formatDate(date),
          area: areaName,
          task: taskName,
          frequency,
          status,
          completedDate: completion?.completed_at || completion?.completion_date || '',
          notes: completion?.notes || '',
        });
      });
    });

    // Sort by date (most recent first)
    records.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    const headers = ['Date', 'Area', 'Task', 'Frequency', 'Status', 'Completed Date', 'Notes'];

    // Generate filename with date range if available
    const dateStr = new Date().toISOString().split('T')[0];
    let filename = `cleaning_records_${dateStr}.csv`;
    if (data.dateRange) {
      const startSafe = data.dateRange.start.replace(/[^a-z0-9]/gi, '_');
      const endSafe = data.dateRange.end.replace(/[^a-z0-9]/gi, '_');
      filename = `cleaning_records_${startSafe}_to_${endSafe}.csv`;
    }

    // Export CSV
    exportToCSV(records, headers, filename);
  } catch (err) {
    logger.error('[Cleaning Record Export] CSV export error:', err);
    throw err;
  }
}
