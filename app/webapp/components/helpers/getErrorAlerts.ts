interface ErrorAlertConfig {
  key: string;
  error: string | null;
  title: string;
  variant: 'critical' | 'warning';
  retryLabel: string;
  className?: string;
}

export function getErrorAlerts(
  statsError: string | null,
  temperatureLogsError: string | null,
  temperatureEquipmentError: string | null,
): Array<ErrorAlertConfig & { error: string }> {
  const alertConfigs: ErrorAlertConfig[] = [
    {
      key: 'stats',
      error: statsError,
      title: 'Dashboard Stats Error',
      variant: 'critical',
      className: 'mb-6',
      retryLabel: 'Retry loading dashboard stats',
    },
    {
      key: 'logs',
      error: temperatureLogsError,
      title: 'Temperature Logs Warning',
      variant: 'warning',
      retryLabel: 'Retry loading temperature logs',
    },
    {
      key: 'equipment',
      error: temperatureEquipmentError,
      title: 'Temperature Equipment Warning',
      variant: 'warning',
      retryLabel: 'Retry loading temperature equipment',
    },
  ];

  return alertConfigs.filter((alert): alert is ErrorAlertConfig & { error: string } =>
    Boolean(alert.error),
  );
}
