import type { TemperatureEquipment } from '../../../types';

// FormatDateFunction is from useCountryFormatting hook - it takes Date, not Date | string
type FormatDateFunction = (date: Date, options?: Intl.DateTimeFormatOptions) => string;
import {
  formatDateString as formatDateStringUtil,
  formatTime as formatTimeUtil,
  getFoodSafetyStatus as getFoodSafetyStatusUtil,
  getTemperatureStatus as getTemperatureStatusUtil,
} from '../../utils';
import { getTypeIconComponent } from '../../../utils/temperatureUtils';

/**
 * Create formatting helper functions
 */
export function createFormatHelpers(
  formatDate: FormatDateFunction,
  equipment: TemperatureEquipment[],
) {
  return {
    formatTime: (timeString: string) => formatTimeUtil(timeString),
    formatDateString: (dateString: string) => {
      // Convert string to Date for formatDate
      const _date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return formatDateStringUtil(dateString, (d: Date) => formatDate(d));
    },
    getTemperatureStatus: (temp: number, location: string) =>
      getTemperatureStatusUtil(temp, location, equipment),
    getFoodSafetyStatus: (temp: number, logTime: string, logDate: string, type: string) =>
      getFoodSafetyStatusUtil(temp, logTime, logDate, type),
    getTypeIcon: (type: string) => getTypeIconComponent(type),
  };
}
