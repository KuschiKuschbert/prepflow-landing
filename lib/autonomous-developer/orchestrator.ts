/**
 * Autonomous Developer Orchestrator
 * Main entry point that coordinates all intelligence systems
 */

import { reviewCodeFile } from './code-review/pattern-detector';
import { detectRefactoringOpportunities, analyzeComplexity } from './refactoring/technical-debt-tracker';
import { generateTestsFromErrors, detectCoverageGaps } from './testing/test-generator';
import { detectMissingJSDoc } from './documentation/doc-generator';
import { detectNPlusOneQueries, detectMemoryLeaks, detectRenderOptimizations } from './performance/performance-analyzer';
import { detectDesignPatterns, detectAntiPatterns } from './architecture/adr-generator';
import { predictBugs, assessFileRisk, calculateCodeHealth } from './predictive/bug-predictor';
import { analyzeDependencyHealth } from './dependencies/dependency-analyzer';
import { generatePRDescription } from './communication/pr-generator';
import { adaptSuggestion, getContextualSuggestions } from './contextual/behavior-learner';

export interface ComprehensiveAnalysis {
  file: string;
  codeReview: {
    issues: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  refactoring: {
    opportunities: number;
    technicalDebt: number;
    complexity: {
      cyclomatic: number;
      maxNesting: number;
      duplicateBlocks: number;
    };
  };
  testing: {
    coverageGaps: number;
    missingTests: number;
  };
  documentation: {
    missingJSDoc: number;
    outdated: number;
  };
  performance: {
    nPlusOneQueries: number;
    memoryLeaks: number;
    renderOptimizations: number;
  };
  architecture: {
    patterns: number;
    antiPatterns: number;
  };
  predictions: {
    predictedBugs: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskScore: number;
  };
  health: {
    overallScore: number;
    errorRisk: number;
    complexityScore: number;
    documentationScore: number;
  };
  recommendations: string[];
}

/**
 * Comprehensive file analysis
 */
export async function analyzeFileComprehensively(
  filePath: string,
  content: string,
): Promise<ComprehensiveAnalysis> {
  // Run all analyses in parallel
  const [
    codeReviewIssues,
    refactoringOpps,
    complexity,
    coverageGaps,
    docGaps,
    nPlusOne,
    memoryLeaks,
    renderOpts,
    patterns,
    antiPatterns,
    predictions,
    riskAssessment,
    health,
  ] = await Promise.all([
    reviewCodeFile(filePath, content),
    detectRefactoringOpportunities(filePath, content),
    analyzeComplexity(content),
    detectCoverageGaps([filePath], []), // Would need actual test files
    detectMissingJSDoc(filePath, content),
    detectNPlusOneQueries(content, filePath),
    detectMemoryLeaks(content, filePath),
    detectRenderOptimizations(content, filePath),
    detectDesignPatterns(content, filePath),
    detectAntiPatterns(content, filePath),
    predictBugs(filePath, content),
    assessFileRisk(filePath, content),
    calculateCodeHealth(filePath, content),
  ]);

  // Generate recommendations
  const recommendations: string[] = [];

  if (codeReviewIssues.length > 0) {
    const critical = codeReviewIssues.filter(i => i.pattern.severity === 'critical').length;
    if (critical > 0) {
      recommendations.push(`Fix ${critical} critical code review issue(s)`);
    }
  }

  if (refactoringOpps.length > 0) {
    recommendations.push(`Consider ${refactoringOpps.length} refactoring opportunity(ies)`);
  }

  if (predictions.length > 0) {
    recommendations.push(`Address ${predictions.length} predicted bug(s) before they occur`);
  }

  if (nPlusOne.length > 0) {
    recommendations.push(`Fix ${nPlusOne.length} N+1 query issue(s) for better performance`);
  }

  if (memoryLeaks.length > 0) {
    recommendations.push(`Fix ${memoryLeaks.length} memory leak(s)`);
  }

  if (antiPatterns.length > 0) {
    recommendations.push(`Refactor ${antiPatterns.length} anti-pattern(s)`);
  }

  return {
    file: filePath,
    codeReview: {
      issues: codeReviewIssues.length,
      critical: codeReviewIssues.filter(i => i.pattern.severity === 'critical').length,
      high: codeReviewIssues.filter(i => i.pattern.severity === 'high').length,
      medium: codeReviewIssues.filter(i => i.pattern.severity === 'medium').length,
      low: codeReviewIssues.filter(i => i.pattern.severity === 'low').length,
    },
    refactoring: {
      opportunities: refactoringOpps.length,
      technicalDebt: 0, // Would load from tracker
      complexity: {
        cyclomatic: complexity.cyclomaticComplexity,
        maxNesting: complexity.maxNesting,
        duplicateBlocks: complexity.duplicateBlocks,
      },
    },
    testing: {
      coverageGaps: coverageGaps.length,
      missingTests: coverageGaps.reduce((sum, gap) => sum + gap.missingTests.length, 0),
    },
    documentation: {
      missingJSDoc: docGaps.filter(g => g.type === 'missing-jsdoc').length,
      outdated: docGaps.filter(g => g.type === 'outdated-doc').length,
    },
    performance: {
      nPlusOneQueries: nPlusOne.length,
      memoryLeaks: memoryLeaks.length,
      renderOptimizations: renderOpts.length,
    },
    architecture: {
      patterns: patterns.length,
      antiPatterns: antiPatterns.length,
    },
    predictions: {
      predictedBugs: predictions.length,
      riskLevel: riskAssessment.overallRisk,
      riskScore: riskAssessment.riskScore,
    },
    health: {
      overallScore: health.overallScore,
      errorRisk: health.errorRisk,
      complexityScore: health.complexityScore,
      documentationScore: health.documentationScore,
    },
    recommendations,
  };
}

/**
 * Generate comprehensive report
 */
export function generateComprehensiveReport(analysis: ComprehensiveAnalysis): string {
  return `
# Comprehensive Code Analysis: ${analysis.file}

## Summary

- **Overall Health Score:** ${analysis.health.overallScore.toFixed(1)}/100
- **Risk Level:** ${analysis.predictions.riskLevel.toUpperCase()}
- **Risk Score:** ${analysis.predictions.riskScore.toFixed(1)}/100

## Code Review

- **Total Issues:** ${analysis.codeReview.issues}
- **Critical:** ${analysis.codeReview.critical}
- **High:** ${analysis.codeReview.high}
- **Medium:** ${analysis.codeReview.medium}
- **Low:** ${analysis.codeReview.low}

## Refactoring

- **Opportunities:** ${analysis.refactoring.opportunities}
- **Technical Debt Items:** ${analysis.refactoring.technicalDebt}
- **Cyclomatic Complexity:** ${analysis.refactoring.complexity.cyclomatic.toFixed(1)}
- **Max Nesting:** ${analysis.refactoring.complexity.maxNesting}
- **Duplicate Blocks:** ${analysis.refactoring.complexity.duplicateBlocks}

## Testing

- **Coverage Gaps:** ${analysis.testing.coverageGaps}
- **Missing Tests:** ${analysis.testing.missingTests}

## Documentation

- **Missing JSDoc:** ${analysis.documentation.missingJSDoc}
- **Outdated Docs:** ${analysis.documentation.outdated}

## Performance

- **N+1 Queries:** ${analysis.performance.nPlusOneQueries}
- **Memory Leaks:** ${analysis.performance.memoryLeaks}
- **Render Optimizations:** ${analysis.performance.renderOptimizations}

## Architecture

- **Design Patterns:** ${analysis.architecture.patterns}
- **Anti-Patterns:** ${analysis.architecture.antiPatterns}

## Predictions

- **Predicted Bugs:** ${analysis.predictions.predictedBugs}
- **Risk Level:** ${analysis.predictions.riskLevel}

## Recommendations

${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}
`;
}

/**
 * Get contextual suggestions
 */
export async function getContextualRecommendations(
  baseSuggestion: string,
  context: Record<string, string>,
): Promise<string> {
  const suggestions = await getContextualSuggestions(baseSuggestion, context);
  return suggestions[0]?.suggestion || baseSuggestion;
}
