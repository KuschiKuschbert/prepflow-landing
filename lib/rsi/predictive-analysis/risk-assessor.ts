import { predictBugs } from './bug-predictor';
import type { BugPrediction, RiskAssessment } from './types';

function generateRecommendations(predictions: BugPrediction[]): string[] {
  const recommendations: string[] = [];
  const byType = predictions.reduce(
    (acc, p) => {
      const type = p.predictedError.split(':')[0];
      if (!acc[type]) acc[type] = [];
      acc[type].push(p);
      return acc;
    },
    {} as Record<string, BugPrediction[]>,
  );

  for (const [type, preds] of Object.entries(byType)) {
    if (preds.length > 0) {
      const topPrediction = preds.sort((a, b) => b.probability - a.probability)[0];
      recommendations.push(
        `${type}: ${topPrediction.suggestion} (${preds.length} potential issue${preds.length > 1 ? 's' : ''})`,
      );
    }
  }

  return recommendations;
}

/**
 * Assess overall risk for file
 */
export async function assessFileRisk(filePath: string, content: string): Promise<RiskAssessment> {
  const predictions = await predictBugs(filePath, content);

  if (predictions.length === 0) {
    return {
      file: filePath,
      overallRisk: 'low',
      riskScore: 0,
      predictions: [],
      recommendations: ['File has low risk - no high-risk patterns detected'],
    };
  }

  const riskScores = predictions.map(p => {
    const scores = { critical: 100, high: 70, medium: 40, low: 20 };
    return scores[p.risk] * p.probability;
  });

  const avgRiskScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
  const overallRisk: RiskAssessment['overallRisk'] =
    avgRiskScore > 80
      ? 'critical'
      : avgRiskScore > 60
        ? 'high'
        : avgRiskScore > 40
          ? 'medium'
          : 'low';

  const recommendations = generateRecommendations(predictions);

  return {
    file: filePath,
    overallRisk,
    riskScore: avgRiskScore,
    predictions,
    recommendations,
  };
}
