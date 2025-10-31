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
  const equipmentItem = equipment.find(e => e.name === location);
  if (!equipmentItem || !equipmentItem.is_active) return 'normal';
  // Check for null/undefined explicitly (0 is a valid temperature)
  if (equipmentItem.min_temp_celsius !== null && equipmentItem.min_temp_celsius !== undefined && temp < equipmentItem.min_temp_celsius) return 'low';
  if (equipmentItem.max_temp_celsius !== null && equipmentItem.max_temp_celsius !== undefined && temp > equipmentItem.max_temp_celsius) return 'high';
  return 'normal';
}

export function getFoodSafetyStatus(
  temp: number,
  logTime: string,
  logDate: string,
  type: string,
): null | { status: 'safe' | 'warning' | 'danger'; message: string; color: string; icon: string } {
  if (type !== 'food_cooking' && type !== 'food_hot_holding' && type !== 'food_cold_holding') {
    return null;
  }
  if (temp < 5 || temp > 60) {
    return { status: 'safe', message: 'Outside danger zone', color: 'text-green-400', icon: '✅' };
  }
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
