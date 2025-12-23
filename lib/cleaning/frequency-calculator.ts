/**
 * Frequency Calculator for Cleaning Tasks
 * Calculates which days a task should appear based on frequency type
 */

export type FrequencyType =
  | 'daily'
  | 'bi-daily'
  | 'weekly'
  | 'monthly'
  | '3-monthly'
  | `every-${number}-days`
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Calculate which dates a task should appear in a given date range
 *
 * @param frequencyType - The frequency type of the task
 * @param startDate - Start date of the range (inclusive)
 * @param endDate - End date of the range (inclusive)
 * @param taskCreatedDate - Date when the task was created (for weekly/monthly calculations)
 * @returns Array of dates (as ISO date strings) when the task should appear
 */
import { calculateDaily } from './frequency-calculator/helpers/calculateDaily';
import { calculateBiDaily } from './frequency-calculator/helpers/calculateBiDaily';
import { calculateDayOfWeek } from './frequency-calculator/helpers/calculateDayOfWeek';
import { calculateWeekly } from './frequency-calculator/helpers/calculateWeekly';
import { calculateMonthly } from './frequency-calculator/helpers/calculateMonthly';
import { calculateQuarterly } from './frequency-calculator/helpers/calculateQuarterly';
import { calculateEveryNDays } from './frequency-calculator/helpers/calculateEveryNDays';

export function calculateTaskDates(
  frequencyType: FrequencyType | string,
  startDate: Date,
  endDate: Date,
  taskCreatedDate?: Date,
): string[] {
  // Use task created date or start date as reference for weekly/monthly calculations
  const referenceDate = taskCreatedDate ? new Date(taskCreatedDate) : new Date(startDate);

  switch (frequencyType) {
    case 'daily':
      return calculateDaily(startDate, endDate);

    case 'bi-daily':
      return calculateBiDaily(startDate, endDate, referenceDate);

    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
    case 'saturday':
    case 'sunday':
      return calculateDayOfWeek(startDate, endDate, frequencyType);

    case 'weekly':
      return calculateWeekly(startDate, endDate, referenceDate);

    case 'monthly':
      return calculateMonthly(startDate, endDate, referenceDate);

    case '3-monthly':
      return calculateQuarterly(startDate, endDate, referenceDate);

    default:
      // Check if it's "every-X-days" format
      if (frequencyType.startsWith('every-') && frequencyType.endsWith('-days')) {
        const daysMatch = frequencyType.match(/every-(\d+)-days/);
        if (daysMatch) {
          const intervalDays = parseInt(daysMatch[1], 10);
          if (intervalDays > 0) {
            return calculateEveryNDays(startDate, endDate, referenceDate, intervalDays);
          }
        }
      }
      // Unknown frequency type, return empty array
      return [];
  }
}

/**
 * Check if a task should appear on a specific date
 *
 * @param frequencyType - The frequency type of the task
 * @param date - The date to check
 * @param taskCreatedDate - Date when the task was created
 * @returns True if task should appear on this date
 */
export function shouldTaskAppearOnDate(
  frequencyType: FrequencyType | string,
  date: Date,
  taskCreatedDate?: Date,
): boolean {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const dates = calculateTaskDates(frequencyType, startDate, endDate, taskCreatedDate);
  const dateStr = date.toISOString().split('T')[0];
  return dates.includes(dateStr);
}
