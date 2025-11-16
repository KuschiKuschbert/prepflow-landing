function calculateTemperatureAlerts(
  logs: any[],
  equipment: any[],
): Array<{ id: string; message: string; severity: 'critical' | 'warning' }> {
  const alerts: Array<{ id: string; message: string; severity: 'critical' | 'warning' }> = [];
  logs.forEach((log: any) => {
    const eq = equipment.find((e: any) => e.location === log.location);
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
