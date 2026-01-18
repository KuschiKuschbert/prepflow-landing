/**
 * RSI Predictive Analysis Module
 * Merged from autonomous-developer/predictive/bug-predictor.ts
 *
 * Predicts likely bugs before they happen based on learned patterns.
 */

import { loadKnowledgeBase } from '../../error-learning/knowledge-base';
import { findSimilarErrors } from '../../error-learning/pattern-matcher';

import { logger } from '@/lib/logger';

export interface BugPrediction {
  file: string;
  line: number;
  risk: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  predictedError: string;
  similarErrors: string[];
  suggestion: string;
  confidence: number;
}

export interface RiskAssessment {
  file: string;
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  riskScore: number;
  predictions: BugPrediction[];
  recommendations: string[];
}

export interface CodeHealthMetrics {
  overallScore: number;
  errorRisk: number;
  complexityScore: number;
  testCoverage: number;
  documentationScore: number;
  performanceScore: number;
  maintainabilityScore: number;
}

/**
 * Predict bugs in code based on learned patterns
 */
export async function predictBugs(filePath: string, content: string): Promise<BugPrediction[]> {
  const predictions: BugPrediction[] = [];
  const lines = content.split('\n');

  const kb = await loadKnowledgeBase();
  const highRiskPatterns = kb.patterns.filter(p => {
    const errorCount = kb.errors.filter(e => e.preventionRules.includes(p.id)).length;
    return errorCount >= 3;
  });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    for (const pattern of highRiskPatterns) {
      const detectionKeywords = pattern.detection.toLowerCase().split(/\s+/);
      const hasPattern = detectionKeywords.some(keyword => {
        if (keyword.length < 3) return false;
        return line.toLowerCase().includes(keyword);
      });

      if (hasPattern) {
        const fixKeywords = pattern.fix.toLowerCase().split(/\s+/);
        const hasFix = fixKeywords.some(keyword => {
          if (keyword.length < 3) return false;
          return content.toLowerCase().includes(keyword);
        });

        if (!hasFix) {
          const similarErrors = await findSimilarErrors(
            pattern.detection,
            {
              file: filePath,
              line: lineNum,
              errorType: 'Predicted',
            },
            3,
          );

          const probability = calculateBugProbability(pattern, similarErrors.length);
          const risk =
            probability > 0.7
              ? 'critical'
              : probability > 0.5
                ? 'high'
                : probability > 0.3
                  ? 'medium'
                  : 'low';

          predictions.push({
            file: filePath,
            line: lineNum,
            risk,
            probability,
            predictedError: pattern.description,
            similarErrors: similarErrors.map(e => e.error.id),
            suggestion: pattern.fix,
            confidence: Math.min(similarErrors.length / 5, 1),
          });
        }
      }
    }
  }

  return predictions;
}

function calculateBugProbability(
  pattern: { name: string; detection: string },
  similarErrorCount: number,
): number {
  let probability = 0.3;
  probability += Math.min(similarErrorCount * 0.15, 0.5);

  if (pattern.detection.toLowerCase().includes('missing try-catch')) {
    probability += 0.2;
  }

  if (pattern.detection.toLowerCase().includes('missing error handler')) {
    probability += 0.15;
  }

  return Math.min(probability, 0.95);
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
 * Main entry point for RSI orchestrator
 */
export async function runPredictiveAnalysis(dryRun = false): Promise<void> {
  const fs = require('fs/promises');
  const path = require('path');
  const { APP_ROOT } = require('../../constants'); // Assuming this exists, or we use process.cwd()

  const rootDir = process.cwd();
  const reportsDir = path.join(rootDir, 'reports');
  await fs.mkdir(reportsDir, { recursive: true });

  const dirsToScan = ['app', 'lib', 'components'];
  const results: RiskAssessment[] = [];

  // Helper to recursively scan directories
  async function scanDir(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          await scanDir(fullPath);
        }
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        const content = await fs.readFile(fullPath, 'utf8');
        const assessment = await assessFileRisk(fullPath, content);
        if (assessment.overallRisk !== 'low' || assessment.predictions.length > 0) {
          results.push(assessment);
        }
      }
    }
  }

  if (dryRun) {
    logger.dev('  [DRY RUN] Would scan directories:', dirsToScan.join(', '));
    return;
  }
  for (const dir of dirsToScan) {
    const fullDir = path.join(rootDir, dir);
    try {
      await scanDir(fullDir);
    } catch (e) {
      logger.warn(`  Could not scan ${dir}, skipping...`);
    }
  }

  // Generate Report
  const reportPath = path.join(reportsDir, 'rsi-predictive-analysis.md');
  let markdown = '# 🔮 RSI Predictive Analysis Report\n\n';
  markdown += `**Date:** ${new Date().toLocaleString()}\n\n`;
  markdown += `**High Risk Files:** ${results.filter(r => r.overallRisk === 'critical' || r.overallRisk === 'high').length}\n`;
  markdown += `**Total Issues Predicted:** ${results.reduce((acc, r) => acc + r.predictions.length, 0)}\n\n`;

  if (results.length === 0) {
    markdown += '✅ No significant risks detected.\n';
  } else {
    // Sort by risk score descending
    results.sort((a, b) => b.riskScore - a.riskScore);

    for (const result of results) {
      markdown += `## ${path.relative(rootDir, result.file)} (Risk: ${result.overallRisk.toUpperCase()})\n`;
      markdown += `**Score:** ${result.riskScore.toFixed(0)}\n\n`;

      if (result.recommendations.length > 0) {
        markdown += `### Recommendations\n`;
        for (const rec of result.recommendations) {
          markdown += `- ${rec}\n`;
        }
        markdown += '\n';
      }

      markdown += `### Details\n`;
      markdown += `| Line | Risk | Probability | Predicted Error |\n`;
      markdown += `|------|------|-------------|-----------------|\n`;
      for (const p of result.predictions) {
        markdown += `| ${p.line} | ${p.risk} | ${(p.probability * 100).toFixed(0)}% | ${p.predictedError} |\n`;
      }
      markdown += '\n---\n\n';
    }
  }

  await fs.writeFile(reportPath, markdown, 'utf8');
}
