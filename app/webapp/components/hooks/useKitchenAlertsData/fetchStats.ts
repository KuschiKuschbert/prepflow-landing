/**
 * Fetch dashboard stats for kitchen alerts
 */

import { logger } from '@/lib/logger';

/**
 * Fetch dashboard stats for kitchen alerts
 *
 * @returns {Promise<any>} Stats data or null
 */
export async function fetchKitchenAlertsStats() {
  try {
    const statsResponse = await fetch('/api/dashboard/stats', { cache: 'no-store' });
    if (statsResponse.ok) {
      try {
        const statsJson = await statsResponse.json();
        if (statsJson.success) {
          return {
            ingredientsLowStock: statsJson.ingredientsLowStock,
            recipesWithoutCost: statsJson.recipesWithoutCost,
            temperatureChecksToday: statsJson.temperatureChecksToday,
            cleaningTasksPending: statsJson.cleaningTasksPending,
          };
        }
      } catch (parseError) {
        logger.error('Error parsing kitchen alerts stats:', parseError);
      }
    } else {
      logger.error('Error fetching kitchen alerts stats:', {
        status: statsResponse.status,
        statusText: statsResponse.statusText,
      });
    }
  } catch (fetchError) {
    logger.error('Network error fetching kitchen alerts:', fetchError);
  }
  return null;
}
