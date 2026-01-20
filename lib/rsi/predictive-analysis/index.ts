/**
 * RSI Predictive Analysis Module
 * Merged from autonomous-developer/predictive/bug-predictor.ts
 *
 * Predicts likely bugs before they happen based on learned patterns.
 */

import { logger } from '@/lib/logger';
import { assessFileRisk } from './risk-assessor';
import { RiskAssessment } from './types';

export * from './bug-predictor';
export * from './health-calculator';
export * from './risk-assessor';
export * from './types';

/**
 * Main entry point for RSI orchestrator
 */
export async function runPredictiveAnalysis(dryRun = false): Promise<void> {
  const fs = require('fs/promises');
  const path = require('path');
  const { APP_ROOT: _APP_ROOT } = require('../../constants'); // Assuming this exists, or we use process.cwd()

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
    } catch (_e) {
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
