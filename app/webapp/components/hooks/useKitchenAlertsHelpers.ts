import { TemperatureEquipment, TemperatureLog } from '../../temperature/types';

function calculateTemperatureAlerts(
  logs: Pick<TemperatureLog, 'id' | 'location' | 'temperature_celsius'>[],
  equipment: Pick<
    TemperatureEquipment,
    'id' | 'location' | 'min_temp_celsius' | 'max_temp_celsius' | 'name'
  >[],
): Array<{ id: string; message: string; severity: 'critical' | 'warning' }> {
  const alerts: Array<{ id: string; message: string; severity: 'critical' | 'warning' }> = [];
  logs.forEach(log => {
    const eq = equipment.find(e => e.location === log.location);
    if (eq && eq.min_temp_celsius !== null && eq.max_temp_celsius !== null) {
      if (
        log.temperature_celsius < eq.min_temp_celsius ||
        log.temperature_celsius > eq.max_temp_celsius
      ) {
        alerts.push({
          id: `temp-${log.id}`,
          message: `${eq.name || eq.location} has temperature ${log.temperature_celsius}°C outside safe range (${eq.min_temp_celsius}°C - ${eq.max_temp_celsius}°C)`,
          severity: 'critical',
        });
      }
    }
  });
  return alerts;
}

export { calculateTemperatureAlerts };
