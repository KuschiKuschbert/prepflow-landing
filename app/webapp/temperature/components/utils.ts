import { TemperatureEquipment, TemperatureLog } from '../types';

export function formatTime(timeString: string): string {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
}

export function formatDateString(dateString: string, formatDate: (d: Date) => string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return formatDate(date);
}

export function getTemperatureStatus(
  temp: number,
  location: string,
  equipment: TemperatureEquipment[],
): 'low' | 'high' | 'normal' {
  // Match equipment by name OR location field
  const equipmentItem = equipment.find(e => e.name === location || e.location === location);
  if (!equipmentItem || !equipmentItem.is_active) return 'normal';
  // Check for null/undefined explicitly (0 is a valid temperature)
  if (
    equipmentItem.min_temp_celsius !== null &&
    equipmentItem.min_temp_celsius !== undefined &&
    temp < equipmentItem.min_temp_celsius
  )
    return 'low';
  if (
    equipmentItem.max_temp_celsius !== null &&
    equipmentItem.max_temp_celsius !== undefined &&
    temp > equipmentItem.max_temp_celsius
  )
    return 'high';
  return 'normal';
}

export function getFoodSafetyStatus(
  temp: number,
  logTime: string,
  logDate: string,
  type: string,
): null | { status: 'safe' | 'warning' | 'danger'; message: string; color: string; icon: string } {
  if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding')
    return null;
  if (temp < 5 || temp > 60)
    return { status: 'safe', message: 'Outside danger zone', color: 'text-green-400', icon: '✅' };
  const logDateTime = new Date(`${logDate}T${logTime}`);
  const now = new Date();
  const hoursInDangerZone = (now.getTime() - logDateTime.getTime()) / (1000 * 60 * 60);
  if (hoursInDangerZone < 2) {
    return {
      status: 'safe',
      message: `${(2 - hoursInDangerZone).toFixed(1)}h remaining - can refrigerate`,
      color: 'text-green-400',
      icon: '✅',
    };
  } else if (hoursInDangerZone < 4) {
    return {
      status: 'warning',
      message: `${(4 - hoursInDangerZone).toFixed(1)}h remaining - use immediately`,
      color: 'text-yellow-400',
      icon: '⚠️',
    };
  } else {
    return {
      status: 'danger',
      message: `${hoursInDangerZone.toFixed(1)}h in danger zone - DISCARD`,
      color: 'text-red-400',
      icon: '🚨',
    };
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'high':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    case 'low':
      return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    default:
      return 'text-green-400 bg-green-400/10 border-green-400/20';
  }
}

export function getTimePeriod(time: string) {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 5 && hour < 9)
    return { period: 'morning', label: '🌅 Morning (5:00-8:59)', icon: '🌅' };
  if (hour >= 9 && hour < 12)
    return { period: 'late-morning', label: '☀️ Late Morning (9:00-11:59)', icon: '☀️' };
  if (hour >= 12 && hour < 14)
    return { period: 'midday', label: '🌞 Midday (12:00-13:59)', icon: '🌞' };
  if (hour >= 14 && hour < 17)
    return { period: 'afternoon', label: '🌤️ Afternoon (14:00-16:59)', icon: '🌤️' };
  if (hour >= 17 && hour < 20)
    return { period: 'dinner', label: '🌆 Dinner Prep (17:00-19:59)', icon: '🌆' };
  if (hour >= 20 && hour < 22)
    return { period: 'evening', label: '🌙 Evening (20:00-21:59)', icon: '🌙' };
  return { period: 'night', label: '🌚 Night (22:00-4:59)', icon: '🌚' };
}

export function groupLogsByTimePeriod(logs: TemperatureLog[]) {
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
    {} as Record<string, { period: string; label: string; icon: string; logs: TemperatureLog[] }>,
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

// Statistics calculation functions
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
