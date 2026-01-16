/**
 * Export utilities for cleaning schedules
 * Supports CSV, PDF, HTML export formats
 */

import { exportToCSV } from '@/lib/csv/csv-utils';
import { exportHTMLReport, exportPDFReport } from '@/lib/exports/export-html';
import { logger } from '@/lib/logger';
import { formatCleaningScheduleForPrint } from './formatCleaningScheduleForPrint';
import type { CleaningTask } from './printCleaningSchedule';

const CSV_HEADERS = [
  'Area',
  'Assigned Date',
  'Completed Date',
  'Status',
  'Frequency (Days)',
  'Notes',
];

/**
 * Map cleaning task to CSV row format
 *
 * @param {CleaningTask} task - Cleaning task to map
 * @returns {Record<string, any>} CSV row object
 */
function mapCleaningTaskToCSVRow(task: CleaningTask): Record<string, unknown> {
  return {
    Area: task.cleaning_areas.name || '',
    'Assigned Date': task.assigned_date
      ? new Date(task.assigned_date).toLocaleDateString('en-AU')
      : '',
    'Completed Date': task.completed_date
      ? new Date(task.completed_date).toLocaleDateString('en-AU')
      : '',
    Status: task.status || '',
    'Frequency (Days)': task.cleaning_areas.frequency_days || 0,
    Notes: task.notes || '',
  };
}

/**
 * Export cleaning schedules to CSV
 *
 * @param {CleaningTask[]} tasks - Cleaning tasks to export
 */
export function exportCleaningScheduleToCSV(tasks: CleaningTask[]): void {
  if (!tasks || tasks.length === 0) {
    return;
  }

  const csvData = tasks.map(mapCleaningTaskToCSVRow);
  const filename = `cleaning-schedule-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(csvData, CSV_HEADERS, filename);
}

/**
 * Export cleaning schedule to HTML
 *
 * @param {CleaningTask[]} tasks - Cleaning tasks to export
 * @param {Date} startDate - Start date for the schedule
 * @param {Date} endDate - End date for the schedule
 */
export function exportCleaningScheduleToHTML(
  tasks: CleaningTask[],
  startDate: Date,
  endDate: Date,
): void {
  if (!tasks || tasks.length === 0) {
    return;
  }

  const contentHtml = formatCleaningScheduleForPrint(tasks, startDate, endDate);
  const dateRangeMeta = `From: ${startDate.toLocaleDateString('en-AU')} To: ${endDate.toLocaleDateString('en-AU')}`;

  exportHTMLReport({
    title: 'Cleaning Schedule',
    subtitle: 'Overview of Cleaning Tasks',
    content: contentHtml,
    filename: `cleaning-schedule-${new Date().toISOString().split('T')[0]}.html`,
    totalItems: tasks.length,
    customMeta: dateRangeMeta,
  });
}

/**
 * Export cleaning schedule to PDF (via API)
 *
 * @param {CleaningTask[]} tasks - Cleaning tasks to export
 * @param {Date} startDate - Start date for the schedule
 * @param {Date} endDate - End date for the schedule
 */
export async function exportCleaningScheduleToPDF(
  tasks: CleaningTask[],
  startDate: Date,
  endDate: Date,
): Promise<void> {
  if (!tasks || tasks.length === 0) {
    return;
  }

  try {
    const contentHtml = formatCleaningScheduleForPrint(tasks, startDate, endDate);
    const dateRangeMeta = `From: ${startDate.toLocaleDateString('en-AU')} To: ${endDate.toLocaleDateString('en-AU')}`;

    await exportPDFReport({
      title: 'Cleaning Schedule',
      subtitle: 'Overview of Cleaning Tasks',
      content: contentHtml,
      filename: `cleaning-schedule-${new Date().toISOString().split('T')[0]}.pdf`,
      totalItems: tasks.length,
      customMeta: dateRangeMeta,
    });
  } catch (error) {
    logger.error('[exportCleaningSchedules] Error exporting to PDF:', {
      error: error instanceof Error ? error.message : String(error),
      taskCount: tasks.length,
    });
    throw error; // Re-throw to let caller handle
  }
}
