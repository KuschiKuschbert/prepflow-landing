#!/usr/bin/env node

/**
 * Comprehensive Analysis Script
 * Runs all autonomous developer analyses on a file
 */

const fs = require('fs');
const path = require('path');
const {
  analyzeFileComprehensively,
  generateComprehensiveReport,
} = require('../../lib/autonomous-developer/orchestrator');

/**
 * Analyze file comprehensively
 */
async function analyze(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n🧠 Comprehensive Analysis: ${filePath}\n`);
  console.log('Running all analyses...\n');

  const analysis = await analyzeFileComprehensively(filePath, content);

  // Display summary
  console.log('📊 Analysis Summary:\n');
  console.log(`   Health Score: ${analysis.health.overallScore.toFixed(1)}/100`);
  console.log(`   Risk Level: ${analysis.predictions.riskLevel.toUpperCase()} (${analysis.predictions.riskScore.toFixed(1)}/100)`);
  console.log(`   Code Review Issues: ${analysis.codeReview.issues}`);
  console.log(`   Refactoring Opportunities: ${analysis.refactoring.opportunities}`);
  console.log(`   Predicted Bugs: ${analysis.predictions.predictedBugs}`);
  console.log(`   Performance Issues: ${analysis.performance.nPlusOneQueries + analysis.performance.memoryLeaks + analysis.performance.renderOptimizations}`);

  // Generate full report
  const report = generateComprehensiveReport(analysis);
  console.log('\n' + report);

  // Save report
  const reportDir = path.join(process.cwd(), 'docs/autonomous-developer/analyses');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const reportFile = path.join(reportDir, `${path.basename(filePath)}-analysis-${Date.now()}.md`);
  fs.writeFileSync(reportFile, report);
  console.log(`\n✅ Full report saved to: ${reportFile}`);

  // Show recommendations
  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Top Recommendations:');
    analysis.recommendations.slice(0, 5).forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];

  if (!filePath) {
    console.log(`
Comprehensive Analysis Script

Usage:
  analyze.js <file>

Runs all analyses:
  - Code Review
  - Refactoring Opportunities
  - Testing Gaps
  - Documentation Gaps
  - Performance Issues
  - Architecture Patterns
  - Bug Predictions
  - Code Health

Example:
  analyze.js app/api/route.ts
    `);
    process.exit(0);
  }

  await analyze(filePath);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { analyze };
