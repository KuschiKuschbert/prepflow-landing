import { TemperatureEquipment, TemperatureLog } from '../../types';

/**
 * Temperature statistics calculation utilities.
 */

/**
 * Temperature statistics interface.
 */
export interface TemperatureStatistics {
  currentStatus: {
    latestTemp: number;
    status: 'in-range' | 'out-of-range';
    lastReadingTime: string;
    lastReadingDate: string;
  };
  temperatureRange: {
    min: number;
    max: number;
    average: number;
  };
  compliance: {
    rate: number;
    compliantCount: number;
    totalCount: number;
  };
  trend: {
    direction: 'improving' | 'declining' | 'stable';
    percentageChange: number;
  };
  dangerZone: {
    totalHours: number;
    violationCount: number;
    status: 'safe' | 'warning' | 'danger';
  };
}

/**
 * Calculate comprehensive temperature statistics from logs.
 *
 * @param {TemperatureLog[]} logs - Array of temperature logs
 * @param {TemperatureEquipment} equipment - Temperature equipment configuration
 * @returns {TemperatureStatistics} Calculated statistics
 */
export function calculateTemperatureStatistics(
  logs: TemperatureLog[],
  equipment: TemperatureEquipment,
): TemperatureStatistics {
  if (logs.length === 0) {
    return {
      currentStatus: {
        latestTemp: 0,
        status: 'out-of-range',
        lastReadingTime: '',
        lastReadingDate: '',
      },
      temperatureRange: {
        min: 0,
        max: 0,
        average: 0,
      },
      compliance: {
        rate: 0,
        compliantCount: 0,
        totalCount: 0,
      },
      trend: {
        direction: 'stable',
        percentageChange: 0,
      },
      dangerZone: {
        totalHours: 0,
        violationCount: 0,
        status: 'safe',
      },
    };
  }

  const sortedLogs = [...logs].sort((a, b) => {
    const dateA = new Date(`${a.log_date}T${a.log_time}`);
    const dateB = new Date(`${b.log_date}T${b.log_time}`);
    return dateB.getTime() - dateA.getTime();
  });
  const latestLog = sortedLogs[0];
  const latestTemp = latestLog.temperature_celsius;
  const isInRange =
    (equipment.min_temp_celsius === null || latestTemp >= equipment.min_temp_celsius) &&
    (equipment.max_temp_celsius === null || latestTemp <= equipment.max_temp_celsius);
  const temperatures = logs.map(log => log.temperature_celsius);
  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);
  const average = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  const compliantCount = logs.filter(log => {
    const temp = log.temperature_celsius;
    return (
      (equipment.min_temp_celsius === null || temp >= equipment.min_temp_celsius) &&
      (equipment.max_temp_celsius === null || temp <= equipment.max_temp_celsius)
    );
  }).length;
  const complianceRate = logs.length > 0 ? (compliantCount / logs.length) * 100 : 0;
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const recentLogs = logs.filter(log => {
    const logDate = new Date(`${log.log_date}T${log.log_time}`);
    return logDate >= sevenDaysAgo;
  });

  const previousLogs = logs.filter(log => {
    const logDate = new Date(`${log.log_date}T${log.log_time}`);
    return logDate >= fourteenDaysAgo && logDate < sevenDaysAgo;
  });

  const recentAverage =
    recentLogs.length > 0
      ? recentLogs.reduce((sum, log) => sum + log.temperature_celsius, 0) / recentLogs.length
      : average;
  const previousAverage =
    previousLogs.length > 0
      ? previousLogs.reduce((sum, log) => sum + log.temperature_celsius, 0) / previousLogs.length
      : average;

  const percentageChange =
    previousAverage !== 0
      ? ((recentAverage - previousAverage) / Math.abs(previousAverage)) * 100
      : 0;
  const trendDirection =
    Math.abs(percentageChange) < 1 ? 'stable' : percentageChange > 0 ? 'declining' : 'improving';
  const isFoodEquipment =
    equipment.equipment_type === 'food_cooking' ||
    equipment.equipment_type === 'food_hot_holding' ||
    equipment.equipment_type === 'food_cold_holding';

  let dangerZoneHours = 0;
  let violationCount = 0;
  let dangerZoneStatus: 'safe' | 'warning' | 'danger' = 'safe';
  if (isFoodEquipment) {
    logs.forEach(log => {
      const temp = log.temperature_celsius;
      if (temp >= 5 && temp <= 60) {
        violationCount++;
        dangerZoneHours += 1;
      }
    });
    if (dangerZoneHours >= 4) {
      dangerZoneStatus = 'danger';
    } else if (dangerZoneHours >= 2) {
      dangerZoneStatus = 'warning';
    } else {
      dangerZoneStatus = 'safe';
    }
  }

  return {
    currentStatus: {
      latestTemp,
      status: isInRange ? 'in-range' : 'out-of-range',
      lastReadingTime: latestLog.log_time,
      lastReadingDate: latestLog.log_date,
    },
    temperatureRange: {
      min,
      max,
      average: Math.round(average * 10) / 10,
    },
    compliance: {
      rate: Math.round(complianceRate * 10) / 10,
      compliantCount,
      totalCount: logs.length,
    },
    trend: {
      direction: trendDirection,
      percentageChange: Math.round(percentageChange * 10) / 10,
    },
    dangerZone: {
      totalHours: Math.round(dangerZoneHours * 10) / 10,
      violationCount,
      status: dangerZoneStatus,
    },
  };
}
