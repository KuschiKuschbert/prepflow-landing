import { LucideIcon, Moon, Sun, Sunrise, Sunset } from 'lucide-react';
import { TemperatureLog } from '../../types';

/**
 * Time period utilities for temperature logs.
 */

/**
 * Get time period information based on hour of day.
 *
 * @param {string} time - Time string in HH:MM format
 * @returns {Object} Time period information with period, label, and icon component
 */
export function getTimePeriod(time: string): {
  period: string;
  label: string;
  icon: LucideIcon;
} {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 5 && hour < 9)
    return { period: 'morning', label: 'Morning (5:00-8:59)', icon: Sunrise };
  if (hour >= 9 && hour < 12)
    return { period: 'late-morning', label: 'Late Morning (9:00-11:59)', icon: Sun };
  if (hour >= 12 && hour < 14)
    return { period: 'midday', label: 'Midday (12:00-13:59)', icon: Sun };
  if (hour >= 14 && hour < 17)
    return { period: 'afternoon', label: 'Afternoon (14:00-16:59)', icon: Sun };
  if (hour >= 17 && hour < 20)
    return { period: 'dinner', label: 'Dinner Prep (17:00-19:59)', icon: Sunset };
  if (hour >= 20 && hour < 22)
    return { period: 'evening', label: 'Evening (20:00-21:59)', icon: Moon };
  return { period: 'night', label: 'Night (22:00-4:59)', icon: Moon };
}

/**
 * Group temperature logs by time period.
 *
 * @param {TemperatureLog[]} logs - Array of temperature logs
 * @returns {Array} Array of grouped logs by time period
 */
export function groupLogsByTimePeriod(logs: TemperatureLog[]): Array<{
  period: string;
  label: string;
  icon: LucideIcon;
  logs: TemperatureLog[];
}> {
  const grouped = logs.reduce(
    (acc, log) => {
      const timePeriod = getTimePeriod(log.log_time);
      if (!acc[timePeriod.period]) {
        acc[timePeriod.period] = {
          period: timePeriod.period,
          label: timePeriod.label,
          icon: timePeriod.icon,
          logs: [],
        };
      }
      acc[timePeriod.period].logs.push(log);
      return acc;
    },
    {} as Record<
      string,
      { period: string; label: string; icon: LucideIcon; logs: TemperatureLog[] }
    >,
  );
  const periodOrder = [
    'morning',
    'late-morning',
    'midday',
    'afternoon',
    'dinner',
    'evening',
    'night',
  ];
  return periodOrder
    .filter(period => grouped[period])
    .map(period => grouped[period])
    .map(group => ({
      ...group,
      logs: group.logs.sort((a, b) => a.log_time.localeCompare(b.log_time)),
    }));
}
