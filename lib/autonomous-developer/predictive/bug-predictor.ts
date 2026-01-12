/**
 * Bug Predictor
 * Predicts likely bugs before they happen
 */

import { loadKnowledgeBase } from '../../error-learning/knowledge-base';
import { findSimilarErrors } from '../../error-learning/pattern-matcher';
import type { KnowledgeBaseError } from '../../error-learning/knowledge-base';

export interface BugPrediction {
  file: string;
  line: number;
  risk: 'critical' | 'high' | 'medium' | 'low';
  probability: number; // 0-1
  predictedError: string;
  similarErrors: string[];
  suggestion: string;
  confidence: number; // 0-1
}

export interface RiskAssessment {
  file: string;
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number; // 0-100
  predictions: BugPrediction[];
  recommendations: string[];
}

/**
 * Predict bugs in code
 */
export async function predictBugs(
  filePath: string,
  content: string,
): Promise<BugPrediction[]> {
  const predictions: BugPrediction[] = [];
  const lines = content.split('\n');

  // Check for high-risk patterns from knowledge base
  const kb = await loadKnowledgeBase();
  const highRiskPatterns = kb.patterns.filter(p => {
    // Patterns that caused 3+ errors are high risk
    const errorCount = kb.errors.filter(e => e.preventionRules.includes(p.id)).length;
    return errorCount >= 3;
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check each high-risk pattern
    for (const pattern of highRiskPatterns) {
      const detectionKeywords = pattern.detection.toLowerCase().split(/\s+/);
      const hasPattern = detectionKeywords.some(keyword => {
        if (keyword.length < 3) return false;
        return line.toLowerCase().includes(keyword);
      });

      if (hasPattern) {
        // Check if fix is already applied
        const fixKeywords = pattern.fix.toLowerCase().split(/\s+/);
        const hasFix = fixKeywords.some(keyword => {
          if (keyword.length < 3) return false;
          return content.toLowerCase().includes(keyword);
        });

        if (!hasFix) {
          // Find similar errors to calculate probability
          const similarErrors = await findSimilarErrors(pattern.detection, {
            file: filePath,
            line: lineNum,
            errorType: 'Predicted',
          }, 3);

          const probability = calculateBugProbability(pattern, similarErrors.length);
          const risk = probability > 0.7 ? 'critical' : probability > 0.5 ? 'high' : probability > 0.3 ? 'medium' : 'low';

          predictions.push({
            file: filePath,
            line: lineNum,
            risk,
            probability,
            predictedError: pattern.description,
            similarErrors: similarErrors.map(e => e.error.id),
            suggestion: pattern.fix,
            confidence: Math.min(similarErrors.length / 5, 1), // More similar errors = higher confidence
          });
        }
      }
    }
  }

  return predictions;
}

/**
 * Calculate bug probability
 */
function calculateBugProbability(
  pattern: { name: string; detection: string },
  similarErrorCount: number,
): number {
  // Base probability from pattern frequency
  let probability = 0.3; // Base 30%

  // Increase based on similar error count
  probability += Math.min(similarErrorCount * 0.15, 0.5); // Max 50% increase

  // Increase for specific high-risk patterns
  if (pattern.detection.toLowerCase().includes('missing try-catch')) {
    probability += 0.2;
  }

  if (pattern.detection.toLowerCase().includes('missing error handler')) {
    probability += 0.15;
  }

  return Math.min(probability, 0.95); // Cap at 95%
}

/**
 * Assess overall risk for file
 */
export async function assessFileRisk(
  filePath: string,
  content: string,
): Promise<RiskAssessment> {
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

  // Calculate overall risk score
  const riskScores = predictions.map(p => {
    const scores = { critical: 100, high: 70, medium: 40, low: 20 };
    return scores[p.risk] * p.probability;
  });

  const avgRiskScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
  const overallRisk: RiskAssessment['overallRisk'] =
    avgRiskScore > 80 ? 'critical' : avgRiskScore > 60 ? 'high' : avgRiskScore > 40 ? 'medium' : 'low';

  // Generate recommendations
  const recommendations = generateRecommendations(predictions);

  return {
    file: filePath,
    overallRisk,
    riskScore: avgRiskScore,
    predictions,
    recommendations,
  };
}

/**
 * Generate recommendations from predictions
 */
function generateRecommendations(predictions: BugPrediction[]): string[] {
  const recommendations: string[] = [];

  // Group by type
  const byType = predictions.reduce((acc, p) => {
    const type = p.predictedError.split(':')[0];
    if (!acc[type]) acc[type] = [];
    acc[type].push(p);
    return acc;
  }, {} as Record<string, BugPrediction[]>);

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
 * Calculate code health score
 */
export interface CodeHealthMetrics {
  overallScore: number; // 0-100
  errorRisk: number;
  complexityScore: number;
  testCoverage: number;
  documentationScore: number;
  performanceScore: number;
  maintainabilityScore: number;
}

export async function calculateCodeHealth(
  filePath: string,
  content: string,
): Promise<CodeHealthMetrics> {
  // Assess risk
  const riskAssessment = await assessFileRisk(filePath, content);
  const errorRisk = 100 - riskAssessment.riskScore;

  // Calculate complexity (simplified)
  const complexity = calculateComplexity(content);
  const complexityScore = Math.max(0, 100 - complexity * 10);

  // Test coverage (placeholder - would need actual coverage data)
  const testCoverage = 0; // Would be calculated from coverage reports

  // Documentation score
  const docScore = calculateDocumentationScore(content);
  const documentationScore = docScore * 100;

  // Performance score (placeholder)
  const performanceScore = 80; // Would be calculated from performance metrics

  // Maintainability score (combination of factors)
  const maintainabilityScore = (errorRisk + complexityScore + documentationScore) / 3;

  // Overall score
  const overallScore = (errorRisk + complexityScore + testCoverage + documentationScore + performanceScore + maintainabilityScore) / 6;

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

/**
 * Calculate complexity score
 */
function calculateComplexity(content: string): number {
  // Simplified cyclomatic complexity
  const decisionPoints = (content.match(/\b(if|else|for|while|switch|case|catch|&&|\|\|)\b/g) || []).length;
  const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*(async\s+)?\(/g) || []).length;
  
  return decisionPoints / Math.max(functions, 1);
}

/**
 * Calculate documentation score
 */
function calculateDocumentationScore(content: string): number {
  const functions = (content.match(/function\s+\w+|const\s+\w+\s*=\s*(async\s+)?\(/g) || []).length;
  const jsdocComments = (content.match(/\/\*\*[\s\S]*?\*\//g) || []).length;

  if (functions === 0) return 1;
  return Math.min(jsdocComments / functions, 1);
}

/**
 * Suggest preventive refactoring
 */
export interface PreventiveRefactoring {
  file: string;
  type: 'extract-function' | 'add-error-handling' | 'add-validation' | 'reduce-complexity';
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  predictedBugs: number;
  suggestion: string;
}

export async function suggestPreventiveRefactoring(
  filePath: string,
  content: string,
): Promise<PreventiveRefactoring[]> {
  const suggestions: PreventiveRefactoring[] = [];
  const predictions = await predictBugs(filePath, content);

  // Group predictions by type
  const byType = predictions.reduce((acc, p) => {
    const type = p.predictedError.includes('try-catch') ? 'add-error-handling' :
                 p.predictedError.includes('validation') ? 'add-validation' :
                 p.predictedError.includes('complex') ? 'reduce-complexity' : 'extract-function';
    if (!acc[type]) acc[type] = [];
    acc[type].push(p);
    return acc;
  }, {} as Record<string, BugPrediction[]>);

  for (const [type, preds] of Object.entries(byType)) {
    if (preds.length > 0) {
      const priority = preds.some(p => p.risk === 'critical') ? 'critical' :
                      preds.some(p => p.risk === 'high') ? 'high' :
                      preds.some(p => p.risk === 'medium') ? 'medium' : 'low';

      suggestions.push({
        file: filePath,
        type: type as PreventiveRefactoring['type'],
        description: `${preds.length} predicted bug(s) of type: ${type}`,
        priority,
        predictedBugs: preds.length,
        suggestion: preds[0].suggestion, // Use top suggestion
      });
    }
  }

  return suggestions;
}
