#!/usr/bin/env node

// Performance Regression Check Script for PrepFlow
// Compares current performance metrics with baseline to detect regressions

const fs = require('fs');
const path = require('path');

// Regression thresholds
const REGRESSION_THRESHOLDS = {
  // Performance score regression (percentage)
  performanceScore: 5, // 5% decrease is considered regression

  // Core Web Vitals regression (percentage)
  lcp: 10, // 10% increase in LCP is regression
  fid: 20, // 20% increase in FID is regression
  cls: 50, // 50% increase in CLS is regression

  // Bundle size regression (percentage)
  bundleSize: 10, // 10% increase in bundle size is regression

  // Accessibility score regression (percentage)
  accessibilityScore: 5, // 5% decrease is regression
};

// Read baseline performance data
function readBaselineData() {
  const baselinePath = path.join(process.cwd(), 'performance-baseline.json');

  if (!fs.existsSync(baselinePath)) {
    console.log('📊 No baseline data found. Creating baseline from current results...');
    return null;
  }

  try {
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    console.log(`📊 Baseline data loaded from: ${baselinePath}`);
    return baseline;
  } catch (error) {
    console.error('❌ Failed to read baseline data:', error.message);
    return null;
  }
}

// Read current performance data
function readCurrentData() {
  const currentPath = path.join(process.cwd(), 'performance-budget-report.json');

  if (!fs.existsSync(currentPath)) {
    console.error('❌ Current performance data not found. Run performance tests first.');
    process.exit(1);
  }

  try {
    const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
    return current;
  } catch (error) {
    console.error('❌ Failed to read current performance data:', error.message);
    process.exit(1);
  }
}

// Check for performance regressions
function checkRegressions(baseline, current) {
  const regressions = [];

  if (!baseline) {
    console.log('📊 No baseline available. Current results will become the new baseline.');
    return { regressions: [], hasRegressions: false };
  }

  // Check performance score regression
  if (current.score < baseline.score) {
    const regression = ((baseline.score - current.score) / baseline.score) * 100;
    if (regression >= REGRESSION_THRESHOLDS.performanceScore) {
      regressions.push({
        metric: 'overall_score',
        baseline: baseline.score,
        current: current.score,
        regression: regression,
        threshold: REGRESSION_THRESHOLDS.performanceScore,
        severity: regression >= 15 ? 'critical' : regression >= 10 ? 'high' : 'medium',
        message: `Overall performance score regressed by ${regression.toFixed(1)}% (${baseline.score} → ${current.score})`,
      });
    }
  }

  // Check violation count regression
  if (current.totalViolations > baseline.totalViolations) {
    const regression =
      ((current.totalViolations - baseline.totalViolations) / baseline.totalViolations) * 100;
    regressions.push({
      metric: 'total_violations',
      baseline: baseline.totalViolations,
      current: current.totalViolations,
      regression: regression,
      severity: regression >= 50 ? 'critical' : regression >= 25 ? 'high' : 'medium',
      message: `Total violations increased by ${regression.toFixed(1)}% (${baseline.totalViolations} → ${current.totalViolations})`,
    });
  }

  // Check critical violations regression
  if (current.criticalViolations > baseline.criticalViolations) {
    regressions.push({
      metric: 'critical_violations',
      baseline: baseline.criticalViolations,
      current: current.criticalViolations,
      regression: current.criticalViolations - baseline.criticalViolations,
      severity: 'critical',
      message: `Critical violations increased (${baseline.criticalViolations} → ${current.criticalViolations})`,
    });
  }

  // Check high violations regression
  if (current.highViolations > baseline.highViolations) {
    regressions.push({
      metric: 'high_violations',
      baseline: baseline.highViolations,
      current: current.highViolations,
      regression: current.highViolations - baseline.highViolations,
      severity: 'high',
      message: `High violations increased (${baseline.highViolations} → ${current.highViolations})`,
    });
  }

  return {
    regressions: regressions,
    hasRegressions: regressions.length > 0,
    criticalRegressions: regressions.filter(r => r.severity === 'critical').length,
    highRegressions: regressions.filter(r => r.severity === 'high').length,
    mediumRegressions: regressions.filter(r => r.severity === 'medium').length,
  };
}

// Generate regression report
function generateRegressionReport(regressionData) {
  console.log('\n📊 Performance Regression Report');
  console.log('=================================');

  if (!regressionData.hasRegressions) {
    console.log('\n✅ No performance regressions detected!');
    console.log('🎉 Performance is stable or improved.');
    return;
  }

  console.log(`\n🚨 Regressions Detected: ${regressionData.regressions.length}`);
  console.log(`  Critical: ${regressionData.criticalRegressions}`);
  console.log(`  High: ${regressionData.highRegressions}`);
  console.log(`  Medium: ${regressionData.mediumRegressions}`);

  console.log('\n📋 Detailed Regressions:');
  regressionData.regressions.forEach((regression, index) => {
    const emoji =
      regression.severity === 'critical' ? '🚨' : regression.severity === 'high' ? '⚠️' : '🔶';
    console.log(`  ${index + 1}. ${emoji} ${regression.message}`);
  });

  console.log('\n💡 Recommendations:');
  console.log('  1. Review recent changes that might have caused regressions');
  console.log('  2. Optimize performance-critical code paths');
  console.log('  3. Consider reverting changes if regressions are critical');
  console.log('  4. Update performance budgets if regressions are acceptable');
}

// Save baseline data
function saveBaseline(currentData) {
  const baselinePath = path.join(process.cwd(), 'performance-baseline.json');

  try {
    fs.writeFileSync(baselinePath, JSON.stringify(currentData, null, 2));
    console.log(`\n💾 Baseline data saved to: ${baselinePath}`);
  } catch (error) {
    console.error('❌ Failed to save baseline data:', error.message);
  }
}

// Main function
function main() {
  console.log('🔍 Checking Performance Regressions...');

  // Read data
  const baseline = readBaselineData();
  const current = readCurrentData();

  // Check regressions
  const regressionData = checkRegressions(baseline, current);

  // Generate report
  generateRegressionReport(regressionData);

  // Save baseline if none exists
  if (!baseline) {
    saveBaseline(current);
  }

  // Exit with error code if there are critical or high regressions
  if (regressionData.criticalRegressions > 0) {
    console.log('\n❌ Critical performance regressions detected!');
    process.exit(1);
  } else if (regressionData.highRegressions > 0) {
    console.log('\n⚠️ High priority performance regressions detected!');
    process.exit(1);
  } else {
    console.log('\n✅ Performance regression check passed!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  checkRegressions,
  generateRegressionReport,
  REGRESSION_THRESHOLDS,
};
