/**
 * Fetch dashboard stats from API
 */

import { logger } from '@/lib/logger';

/**
 * Fetch dashboard stats from API
 *
 * @returns {Promise<any>} Stats data or null
 */
export async function fetchDashboardStats() {
  try {
    const statsResponse = await fetch('/api/dashboard/stats', { cache: 'no-store' });
    if (statsResponse.ok) {
      try {
        const statsJson = await statsResponse.json();
        return statsJson?.success ? statsJson : null;
      } catch (parseError) {
        logger.error('Error parsing temperature stats response:', parseError);
        return null;
      }
    } else {
      logger.error('Error fetching temperature stats:', {
        status: statsResponse.status,
        statusText: statsResponse.statusText,
      });
      return null;
    }
  } catch (fetchError) {
    logger.error('Network error fetching temperature status:', fetchError);
    return null;
  }
}
