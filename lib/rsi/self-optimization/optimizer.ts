import path from 'path';

/**
 * Optimizer for RSI
 * Analyzes metrics and proposes parameter adjustments.
 */

export interface OptimizationSuggestion {
  parameter: string;
  currentValue: unknown;
  proposedValue: unknown;
  reason: string;
  confidence: number;
}

const METRICS_FILE_PATH = path.join(process.cwd(), 'docs/rsi/metrics.json');

export class Optimizer {
  static async analyze(): Promise<OptimizationSuggestion[]> {
    try {
      const metrics = this.loadMetrics();
      if (!metrics) return [];

      return this.generateSuggestions(metrics);
    } catch (error) {
      console.error('Optimizer analysis failed:', error);
      return [];
    }
  }

  private static loadMetrics(): any | null {
    const fs = require('fs');
    if (!fs.existsSync(METRICS_FILE_PATH)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(METRICS_FILE_PATH, 'utf-8'));
  }

  private static generateSuggestions(metrics: any): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    const successRates: number[] = metrics.fixSuccessRate || [];

    if (successRates.length === 0) {
      return suggestions;
    }

    const avgSuccess = successRates.reduce((a, b) => a + b, 0) / successRates.length;

    // If we are very successful, we can be more aggressive
    if (avgSuccess > 0.9) {
      suggestions.push({
        parameter: 'confidenceThreshold.medium',
        currentValue: 0.7, // In a real system, we'd read this from config
        proposedValue: 0.65,
        reason: `High fix success rate (${(avgSuccess * 100).toFixed(1)}%). We can significantly increase velocity by lowering the confidence threshold.`,
        confidence: 0.9,
      });
    }

    return suggestions;
  }
}
