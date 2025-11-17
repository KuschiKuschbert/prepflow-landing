import { TemperatureLog, TemperatureEquipment } from '../../types/temperature';

interface WarningCheckResult {
  shouldShow: boolean;
  warningKey: string;
  warning?: {
    type: 'warning' | 'error';
    title: string;
    message: string;
    action: { label: string; onClick: () => void };
    dismissible: boolean;
    autoHide: boolean;
  };
}

export function checkEquipmentOutOfRangeWarning(
  allLogs: TemperatureLog[],
  equipment: TemperatureEquipment[],
  warningsShown: Set<string>,
): WarningCheckResult[] {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const todayLogs = allLogs.filter(log => log.log_date === todayString);
  const warnings: WarningCheckResult[] = [];
  equipment.forEach(eq => {
    if (!eq.location || !eq.min_temp_celsius || !eq.max_temp_celsius) return;
    const equipmentLogs = todayLogs.filter(log => log.location === eq.location);
    if (equipmentLogs.length > 0) {
      const outOfRangeLogs = equipmentLogs.filter(
        log =>
          log.temperature_celsius < eq.min_temp_celsius! ||
          log.temperature_celsius > eq.max_temp_celsius!,
      );
      if (outOfRangeLogs.length > 0) {
        const warningKey = `out-of-range-${eq.id}`;
        if (!warningsShown.has(warningKey)) {
          warnings.push({
            shouldShow: true,
            warningKey,
            warning: {
              type: 'error',
              title: 'Temperature Out of Range',
              message: `${eq.name} has recorded ${outOfRangeLogs.length} temperature reading(s) outside the safe range (${eq.min_temp_celsius}°C - ${eq.max_temp_celsius}°C).`,
              action: {
                label: 'View Details',
                onClick: () => {
                  window.location.href = '/webapp/temperature';
                },
              },
              dismissible: true,
              autoHide: false,
            },
          });
        }
      }
    }
  });
  return warnings;
}
