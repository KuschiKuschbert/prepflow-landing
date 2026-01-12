import { ChangeTracker } from '../safety/change-tracker';

/**
 * Improvement Metrics for RSI
 * Calculates aggregate metrics for system performance.
 */

export interface RSIMetrics {
  totalChanges: number;
  successRate: number; // % of changes not rolled back and with positive feedback
  rollbackRate: number; // % of changes rolled back
  activePeriodDays: number;
}

export class ImprovementMetrics {
  static async calculateMetrics(): Promise<RSIMetrics> {
    try {
      const changes = await ChangeTracker.getHistory();
      const totalChanges = changes.length;

      if (totalChanges === 0) {
        return {
          totalChanges: 0,
          successRate: 0,
          rollbackRate: 0,
          activePeriodDays: 0
        };
      }

      const rolledBack = changes.filter(c => c.status === 'rolled_back' || c.status === 'failed').length;

      // Calculate success based on non-rolled back changes
      // In a real system, we'd cross-reference with negative feedback
      const successful = changes.length - rolledBack;

      const firstChange = new Date(changes[0].timestamp).getTime();
      const lastChange = new Date(changes[changes.length - 1].timestamp).getTime();
      const activePeriodDays = Math.max(1, Math.ceil((lastChange - firstChange) / (1000 * 60 * 60 * 24)));

      return {
        totalChanges,
        successRate: (successful / totalChanges) * 100,
        rollbackRate: (rolledBack / totalChanges) * 100,
        activePeriodDays
      };
    } catch (error) {
      console.error('Failed to calculate metrics:', error);
      return {
        totalChanges: 0,
        successRate: 0,
        rollbackRate: 0,
        activePeriodDays: 0
      };
    }
  }
}
