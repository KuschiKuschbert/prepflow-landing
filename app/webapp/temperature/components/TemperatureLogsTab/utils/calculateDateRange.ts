import type { TemperatureLog } from '../../../types';
import type { DateRange } from '../types';

/**
 * Calculate date range from logs or selected date
 */
export function calculateDateRange(
  logs: TemperatureLog[],
  selectedDate: string,
): DateRange | undefined {
  if (logs.length > 0) {
    const dates = logs.map(log => log.log_date).sort();
    return {
      start: dates[0],
      end: dates[dates.length - 1],
    };
  } else if (selectedDate) {
    return {
      start: selectedDate,
      end: selectedDate,
    };
  }
  return undefined;
}
