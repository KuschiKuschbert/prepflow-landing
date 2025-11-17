import { TemperatureLog } from '../../types/temperature';

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

export function checkFoodTemperatureWarning(
  allLogs: TemperatureLog[],
  warningsShown: Set<string>,
): WarningCheckResult {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const todayLogs = allLogs.filter(log => log.log_date === todayString);
  const foodLogsToday = todayLogs.filter(
    log => log.temperature_type === 'food' || log.temperature_type === 'Food',
  );
  const warningKey = 'food-temp-today';
  if (foodLogsToday.length === 0 && allLogs.length > 0 && !warningsShown.has(warningKey)) {
    return {
      shouldShow: true,
      warningKey,
      warning: {
        type: 'warning',
        title: 'Temperature Monitoring Alert',
        message:
          'No food items have been temperature checked today. Ensure all food items are properly monitored for safety compliance.',
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
  return { shouldShow: false, warningKey };
}
