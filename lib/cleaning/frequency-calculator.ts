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
export function calculateTaskDates(
  frequencyType: FrequencyType | string,
  startDate: Date,
  endDate: Date,
  taskCreatedDate?: Date,
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  // Use task created date or start date as reference for weekly/monthly calculations
  const referenceDate = taskCreatedDate ? new Date(taskCreatedDate) : new Date(startDate);

  switch (frequencyType) {
    case 'daily':
      // Every day
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
      break;

    case 'bi-daily':
      // Every 2 days, starting from reference date
      const biDailyStart = new Date(referenceDate);
      // Find the first occurrence in or before the range
      while (biDailyStart > current) {
        biDailyStart.setDate(biDailyStart.getDate() - 2);
      }
      while (biDailyStart < current) {
        biDailyStart.setDate(biDailyStart.getDate() + 2);
      }
      const biDailyCurrent = new Date(biDailyStart);
      while (biDailyCurrent <= end) {
        if (biDailyCurrent >= current) {
          dates.push(biDailyCurrent.toISOString().split('T')[0]);
        }
        biDailyCurrent.setDate(biDailyCurrent.getDate() + 2);
      }
      break;

    case 'monday':
    case 'tuesday':
    case 'wednesday':
    case 'thursday':
    case 'friday':
    case 'saturday':
    case 'sunday':
      // Specific day of week each week
      const dayNameMap: Record<string, number> = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0,
      };
      const targetDayOfWeek = dayNameMap[frequencyType];
      const dayOfWeekCurrent = new Date(current);
      // Find the first occurrence of this day of week in or after the start date
      while (dayOfWeekCurrent.getDay() !== targetDayOfWeek && dayOfWeekCurrent <= end) {
        dayOfWeekCurrent.setDate(dayOfWeekCurrent.getDate() + 1);
      }
      while (dayOfWeekCurrent <= end) {
        if (dayOfWeekCurrent >= current) {
          dates.push(dayOfWeekCurrent.toISOString().split('T')[0]);
        }
        dayOfWeekCurrent.setDate(dayOfWeekCurrent.getDate() + 7);
      }
      break;

    case 'weekly':
      // Same day of week each week
      const dayOfWeek = referenceDate.getDay();
      const weeklyCurrent = new Date(current);
      // Find the first occurrence of this day of week in or after the start date
      while (weeklyCurrent.getDay() !== dayOfWeek && weeklyCurrent <= end) {
        weeklyCurrent.setDate(weeklyCurrent.getDate() + 1);
      }
      while (weeklyCurrent <= end) {
        if (weeklyCurrent >= current) {
          dates.push(weeklyCurrent.toISOString().split('T')[0]);
        }
        weeklyCurrent.setDate(weeklyCurrent.getDate() + 7);
      }
      break;

    case 'monthly':
      // Same date each month
      const dayOfMonth = referenceDate.getDate();
      const monthlyCurrent = new Date(current);
      // Find the first occurrence of this day in or after the start date
      monthlyCurrent.setDate(dayOfMonth);
      if (monthlyCurrent < current) {
        monthlyCurrent.setMonth(monthlyCurrent.getMonth() + 1);
        monthlyCurrent.setDate(dayOfMonth);
      }
      while (monthlyCurrent <= end) {
        if (monthlyCurrent >= current) {
          dates.push(monthlyCurrent.toISOString().split('T')[0]);
        }
        monthlyCurrent.setMonth(monthlyCurrent.getMonth() + 1);
        monthlyCurrent.setDate(dayOfMonth);
      }
      break;

    case '3-monthly':
      // Same date every 3 months
      const quarterlyDayOfMonth = referenceDate.getDate();
      const quarterlyCurrent = new Date(current);
      quarterlyCurrent.setDate(quarterlyDayOfMonth);
      if (quarterlyCurrent < current) {
        quarterlyCurrent.setMonth(quarterlyCurrent.getMonth() + 3);
        quarterlyCurrent.setDate(quarterlyDayOfMonth);
      }
      while (quarterlyCurrent <= end) {
        if (quarterlyCurrent >= current) {
          dates.push(quarterlyCurrent.toISOString().split('T')[0]);
        }
        quarterlyCurrent.setMonth(quarterlyCurrent.getMonth() + 3);
        quarterlyCurrent.setDate(quarterlyDayOfMonth);
      }
      break;

    default:
      // Check if it's "every-X-days" format
      if (frequencyType.startsWith('every-') && frequencyType.endsWith('-days')) {
        const daysMatch = frequencyType.match(/every-(\d+)-days/);
        if (daysMatch) {
          const intervalDays = parseInt(daysMatch[1], 10);
          if (intervalDays > 0) {
            // Every N days, starting from reference date
            const everyNStart = new Date(referenceDate);
            // Find the first occurrence in or before the range
            while (everyNStart > current) {
              everyNStart.setDate(everyNStart.getDate() - intervalDays);
            }
            while (everyNStart < current) {
              everyNStart.setDate(everyNStart.getDate() + intervalDays);
            }
            const everyNCurrent = new Date(everyNStart);
            while (everyNCurrent <= end) {
              if (everyNCurrent >= current) {
                dates.push(everyNCurrent.toISOString().split('T')[0]);
              }
              everyNCurrent.setDate(everyNCurrent.getDate() + intervalDays);
            }
            break;
          }
        }
      }
      // Unknown frequency type, return empty array
      break;
  }

  return dates;
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
