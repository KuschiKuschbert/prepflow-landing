#!/usr/bin/env node

/**
 * Bug Prediction Script
 * Predicts likely bugs before they happen
 */

const fs = require('fs');
const path = require('path');
const {
  predictBugs,
  assessFileRisk,
  calculateCodeHealth,
  suggestPreventiveRefactoring,
} = require('../../lib/autonomous-developer/predictive/bug-predictor');

/**
 * Predict bugs for file
 */
async function predictForFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n🔮 Bug Prediction: ${filePath}\n`);

  // Predict bugs
  const predictions = await predictBugs(filePath, content);

  if (predictions.length === 0) {
    console.log('✅ No bugs predicted - file looks safe!');
    return;
  }

  console.log(`⚠️ Predicted ${predictions.length} potential bug(s):\n`);

  const byRisk = predictions.reduce((acc, p) => {
    if (!acc[p.risk]) acc[p.risk] = [];
    acc[p.risk].push(p);
    return acc;
  }, {} as Record<string, typeof predictions>);

  for (const [risk, riskPredictions] of Object.entries(byRisk)) {
    console.log(`${risk.toUpperCase()} RISK (${riskPredictions.length}):`);
    riskPredictions.forEach(p => {
      console.log(`  - Line ${p.line}: ${p.predictedError}`);
      console.log(`    Probability: ${(p.probability * 100).toFixed(0)}%`);
      console.log(`    Confidence: ${(p.confidence * 100).toFixed(0)}%`);
      console.log(`    Suggestion: ${p.suggestion}`);
      if (p.similarErrors.length > 0) {
        console.log(`    Similar errors: ${p.similarErrors.length}`);
      }
      console.log('');
    });
  }

  // Assess overall risk
  const riskAssessment = await assessFileRisk(filePath, content);
  console.log(`\n📊 Overall Risk Assessment:`);
  console.log(`   Risk Level: ${riskAssessment.overallRisk.toUpperCase()}`);
  console.log(`   Risk Score: ${riskAssessment.riskScore.toFixed(1)}/100`);
  console.log(`   Recommendations:`);
  riskAssessment.recommendations.forEach(rec => {
    console.log(`     - ${rec}`);
  });

  // Calculate code health
  const health = await calculateCodeHealth(filePath, content);
  console.log(`\n💚 Code Health Score: ${health.overallScore.toFixed(1)}/100`);
  console.log(`   Error Risk: ${health.errorRisk.toFixed(1)}`);
  console.log(`   Complexity: ${health.complexityScore.toFixed(1)}`);
  console.log(`   Documentation: ${health.documentationScore.toFixed(1)}`);
  console.log(`   Performance: ${health.performanceScore.toFixed(1)}`);
  console.log(`   Maintainability: ${health.maintainabilityScore.toFixed(1)}`);

  // Suggest preventive refactoring
  const refactorings = await suggestPreventiveRefactoring(filePath, content);
  if (refactorings.length > 0) {
    console.log(`\n🔧 Preventive Refactoring Suggestions:`);
    refactorings.forEach(ref => {
      console.log(`  - ${ref.type} (${ref.priority}): ${ref.description}`);
      console.log(`    Predicted bugs prevented: ${ref.predictedBugs}`);
      console.log(`    Suggestion: ${ref.suggestion}\n`);
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
Bug Prediction Script

Usage:
  predict-bugs.js <file>

Examples:
  predict-bugs.js app/api/route.ts
  predict-bugs.js app/components/MyComponent.tsx
    `);
    process.exit(0);
  }

  await predictForFile(filePath);
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { predictForFile };
