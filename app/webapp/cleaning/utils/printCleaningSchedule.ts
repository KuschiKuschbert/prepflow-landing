/**
 * Print utility for cleaning schedules
 * Formats cleaning schedule
 * Uses unified print template with Cyber Carrot branding
 */

import { printWithTemplate } from '@/lib/exports/print-template';
import { formatCleaningScheduleForPrint } from './formatCleaningScheduleForPrint';

export interface CleaningTask {
  id: string | number;
  area_id: string | number;
  assigned_date: string;
  completed_date: string | null;
  status: 'pending' | 'completed' | 'overdue';
  notes: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  cleaning_areas: {
    id: string | number;
    name: string;
    description: string;
    frequency_days: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface CleaningArea {
  id: string | number;
  name: string;
  description: string;
  frequency_days: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
