/**
 * Print utility for cleaning schedules
 * Formats cleaning schedule
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import { formatCleaningScheduleForPrint } from './formatCleaningScheduleForPrint';
import type { CleaningArea, CleaningTask } from './cleaning-schedule-types';

export type { CleaningArea, CleaningTask } from './cleaning-schedule-types';

/**
 * Print cleaning schedule using unified template
 *
 * @param {CleaningTask[]} tasks - Cleaning tasks to print
 * @param {Date} startDate - Start date for the schedule
 * @param {Date} endDate - End date for the schedule
 * @param {string} title - Optional title (default: 'Cleaning Schedule')
 * @returns {void} Opens print dialog
 */
export function printCleaningSchedule(
  tasks: CleaningTask[],
  startDate: Date,
  endDate: Date,
  title: string = 'Cleaning Schedule',
): void {
  const contentHtml = formatCleaningScheduleForPrint(tasks, startDate, endDate);

  printWithTemplate({
    title: title,
    subtitle: `Schedule from ${startDate.toLocaleDateString('en-AU')} to ${endDate.toLocaleDateString('en-AU')}`,
    content: contentHtml,
    totalItems: tasks.length,
    customMeta: `Generated: ${new Date().toLocaleDateString('en-AU')}`,
  });
}
