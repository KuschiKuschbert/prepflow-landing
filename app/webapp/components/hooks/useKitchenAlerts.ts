import { useKitchenAlertsData } from './useKitchenAlertsData';

interface Alert {
  id: string;
  type: 'temperature' | 'stock' | 'recipe' | 'compliance' | 'equipment';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel: string;
  actionHref: string;
}

export function useKitchenAlerts() {
  const { stats, temperatureAlerts, loading } = useKitchenAlertsData();
  const alerts: Alert[] = [];

  temperatureAlerts.forEach((alert, index) => {
    alerts.push({
      id: `temp-${index}`,
      type: 'temperature',
      severity: alert.severity,
      title: 'Temperature Warning',
      message: alert.message,
      actionLabel: 'View Temperature Logs',
      actionHref: '/webapp/temperature',
    });
  });

  if (stats?.ingredientsLowStock && stats.ingredientsLowStock > 0) {
    alerts.push({
      id: 'low-stock',
      type: 'stock',
      severity: stats.ingredientsLowStock > 5 ? 'critical' : 'warning',
      title: 'Low Stock Alert',
      message: `${stats.ingredientsLowStock} ingredient(s) need restocking`,
      actionLabel: 'View Ingredients',
      actionHref: '/webapp/recipes#ingredients',
    });
  }

  if (stats?.recipesWithoutCost && stats.recipesWithoutCost > 0) {
    alerts.push({
      id: 'missing-costs',
      type: 'recipe',
      severity: 'warning',
      title: 'Missing Recipe Costs',
      message: `${stats.recipesWithoutCost} recipe(s) need pricing data`,
      actionLabel: 'Fix Recipes',
      actionHref: '/webapp/recipes',
    });
  }

  if (stats?.temperatureChecksToday !== undefined && stats.temperatureChecksToday === 0) {
    alerts.push({
      id: 'no-temp-checks',
      type: 'compliance',
      severity: 'warning',
      title: 'No Temperature Checks Today',
      message:
        'No temperature logs recorded today. Food safety compliance requires regular checks.',
      actionLabel: 'Log Temperature',
      actionHref: '/webapp/temperature',
    });
  }

  if (stats?.cleaningTasksPending && stats.cleaningTasksPending > 0) {
    alerts.push({
      id: 'pending-cleaning',
      type: 'compliance',
      severity: stats.cleaningTasksPending > 10 ? 'critical' : 'warning',
      title: 'Pending Cleaning Tasks',
      message: `${stats.cleaningTasksPending} cleaning task(s) pending`,
      actionLabel: 'View Cleaning Tasks',
      actionHref: '/webapp/cleaning',
    });
  }

  return { alerts, loading };
}
