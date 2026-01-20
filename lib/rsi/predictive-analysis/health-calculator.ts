import { assessFileRisk } from './risk-assessor';
import type { CodeHealthMetrics } from './types';

function calculateComplexity(content: string): number {
  const decisionPoints = (content.match(/\b(if|else|for|while|switch|case|catch|&&|\|\|)\b/g) || [])
    .length;
  const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*(async\s+)?\(/g) || []).length;
  return decisionPoints / Math.max(functions, 1);
}

function calculateDocumentationScore(content: string): number {
  const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*(async\s+)?\(/g) || []).length;
  const jsdocComments = (content.match(/\/\*\*[\s\S]*?\*\//g) || []).length;
  if (functions === 0) return 1;
  return Math.min(jsdocComments / functions, 1);
}

/**
 * Calculate code health score
 */
export async function calculateCodeHealth(
  filePath: string,
  content: string,
): Promise<CodeHealthMetrics> {
  const riskAssessment = await assessFileRisk(filePath, content);
  const errorRisk = 100 - riskAssessment.riskScore;

  const complexity = calculateComplexity(content);
  const complexityScore = Math.max(0, 100 - complexity * 10);

  const testCoverage = 0; // Would be calculated from coverage reports
  const docScore = calculateDocumentationScore(content);
  const documentationScore = docScore * 100;
  const performanceScore = 80;
  const maintainabilityScore = (errorRisk + complexityScore + documentationScore) / 3;

  const overallScore =
    (errorRisk +
      complexityScore +
      testCoverage +
      documentationScore +
      performanceScore +
      maintainabilityScore) /
    6;

  return {
    overallScore,
    errorRisk,
    complexityScore,
    testCoverage,
    documentationScore,
    performanceScore,
    maintainabilityScore,
  };
}
