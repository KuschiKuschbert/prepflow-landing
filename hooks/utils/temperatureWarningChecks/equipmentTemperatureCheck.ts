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

export function checkEquipmentTemperatureWarning(
  allLogs: TemperatureLog[],
  equipment: TemperatureEquipment[],
  warningsShown: Set<string>,
): WarningCheckResult {
  const now = new Date();
  const eightHoursAgo = new Date(now.getTime() - 8 * 60 * 60 * 1000);
  const recentLogs = allLogs.filter(log => {
    const logDateTime = new Date(`${log.log_date}T${log.log_time}`);
    return logDateTime >= eightHoursAgo && logDateTime <= now;
  });
  const activeEquipment = equipment.filter(eq => eq.is_active && eq.location);
  if (activeEquipment.length === 0) return { shouldShow: false, warningKey: '' };
  const checkedEquipment = new Set();
  recentLogs.forEach(log => {
    if (log.location) checkedEquipment.add(log.location);
  });
  const uncheckedEquipment = activeEquipment.filter(
    eq => eq.location && !checkedEquipment.has(eq.location),
  );
  if (uncheckedEquipment.length > 0) {
    const equipmentNames = uncheckedEquipment.map(eq => eq.name).join(', ');
    const isMultiple = uncheckedEquipment.length > 1;
    const warningKey = `equipment-check-${equipmentNames}`;
    if (!warningsShown.has(warningKey)) {
      return {
        shouldShow: true,
        warningKey,
        warning: {
          type: 'warning',
          title: 'Equipment Temperature Check Required',
          message: `${isMultiple ? 'Equipment' : 'Equipment'} ${equipmentNames} ${isMultiple ? 'have' : 'has'} not been temperature checked in the last 8 hours. Ensure all active equipment is monitored for safety compliance.`,
          action: {
            label: 'Go to Temperature Logs',
            onClick: () => {
              window.location.href = '/webapp/temperature';
            },
          },
          dismissible: true,
          autoHide: false,
        },
      };
    }
  }
  return { shouldShow: false, warningKey: '' };
}
