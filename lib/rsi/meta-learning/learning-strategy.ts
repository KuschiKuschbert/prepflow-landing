/**
 * Learning Strategy Interface
 * Defines how RSI analyzes success patterns.
 */

export interface LearningInsight {
  patternId: string;
  type: string;
  confidence: number;
  insight: string;
  sourceFiles: string[];
}

export interface LearningStrategy {
  name: string;
  analyze(history: any[]): Promise<LearningInsight[]>;
}

export class FrequencyAnalysisStrategy implements LearningStrategy {
  name = 'Frequency Analysis';

  async analyze(history: any[]): Promise<LearningInsight[]> {
    const insights: LearningInsight[] = [];

    // Group by type
    const stats: Record<string, { total: number; successful: number; files: string[] }> = {};

    for (const record of history) {
      const type = record.type;
      if (!stats[type]) {
        stats[type] = { total: 0, successful: 0, files: [] };
      }

      stats[type].total++;
      if (record.status === 'applied') {
        stats[type].successful++;
        if (record.files && record.files.length > 0) {
          stats[type].files.push(...record.files);
        }
      }
    }

    // Generate insights
    for (const [type, data] of Object.entries(stats)) {
      if (data.total === 0) continue;

      const successRate = data.successful / data.total;

      // Only generate insight if we have enough data points and high success rate
      // Lowering threshold slightly for demo purposes, but realistically should be higher
        if (data.total >= 1 && successRate >= 0.8) {
        insights.push({
          patternId: type,
          type: 'frequency',
          confidence: successRate,
          insight: `Fixes of type '${type}' have a ${(successRate * 100).toFixed(1)}% success rate across ${data.total} attempts.`,
          sourceFiles: [...new Set(data.files)].slice(0, 5), // Limit file list
        });
      }
    }

    return insights;
  }
}
