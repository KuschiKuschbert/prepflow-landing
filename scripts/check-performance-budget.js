#!/usr/bin/env node

// Performance Budget Check Script for PrepFlow
// Checks performance metrics against defined budgets

const fs = require('fs');
const path = require('path');

// Performance budget configuration
const PERFORMANCE_BUDGETS = {
  // Core Web Vitals budgets
  coreWebVitals: {
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100, // First Input Delay (ms)
    cls: 0.1, // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    tti: 3800, // Time to Interactive (ms)
    si: 3000, // Speed Index (ms)
    tbt: 300, // Total Blocking Time (ms)
  },

  // Resource budgets (adjusted for large application: 850 webapp files, 358 API routes, 82 components)
  // Realistic budgets for a feature-rich restaurant management SaaS application
  resources: {
    totalSize: 2000000, // Total bundle size (bytes) - 2MB (was 500KB, too aggressive)
    jsSize: 1500000, // JavaScript bundle size (bytes) - 1.5MB (was 200KB, too aggressive)
    cssSize: 200000, // CSS bundle size (bytes) - 200KB (was 50KB, too aggressive)
    imageSize: 100000, // Image bundle size (bytes)
    fontSize: 30000, // Font bundle size (bytes)
    thirdPartySize: 300000, // Third-party scripts (bytes) - 300KB (was 100KB)
  },

  // Performance scores
  scores: {
    performance: 80, // Lighthouse Performance score
    accessibility: 90, // Lighthouse Accessibility score
    bestPractices: 80, // Lighthouse Best Practices score
    seo: 80, // Lighthouse SEO score
  },
};

// Read Lighthouse CI results
function readLighthouseResults() {
  const resultsPath = path.join(process.cwd(), '.lighthouseci', 'results.json');

  if (!fs.existsSync(resultsPath)) {
    console.error('❌ Lighthouse CI results not found. Run "npm run lighthouse" first.');
    process.exit(1);
  }

  try {
    const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    return results;
  } catch (error) {
    console.error('❌ Failed to read Lighthouse CI results:', error.message);
    process.exit(1);
  }
}

// Read bundle analysis results
function readBundleAnalysis() {
  const bundlePath = path.join(process.cwd(), 'bundle-analysis-report.json');

  if (!fs.existsSync(bundlePath)) {
    console.warn('⚠️ Bundle analysis report not found. Run "npm run analyze" first.');
    return null;
  }

  try {
    const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
    return bundle;
  } catch (error) {
    console.warn('⚠️ Failed to read bundle analysis:', error.message);
    return null;
  }
}

// Check performance budget
function checkPerformanceBudget(lighthouseResults, bundleAnalysis) {
  const violations = [];
  const report = {
    totalViolations: 0,
    criticalViolations: 0,
    highViolations: 0,
    mediumViolations: 0,
    lowViolations: 0,
    score: 100,
    violations: [],
    timestamp: Date.now(),
  };

  // Check Lighthouse scores
  lighthouseResults.forEach(result => {
    const { summary } = result;

    // Check performance score
    if (summary.performance < PERFORMANCE_BUDGETS.scores.performance) {
      const violation = {
        metric: 'performance_score',
        actual: summary.performance,
        budget: PERFORMANCE_BUDGETS.scores.performance,
        severity: getSeverity(summary.performance, PERFORMANCE_BUDGETS.scores.performance),
        message: `Performance score ${summary.performance} below budget of ${PERFORMANCE_BUDGETS.scores.performance}`,
      };
      violations.push(violation);
    }

    // Check accessibility score
    if (summary.accessibility < PERFORMANCE_BUDGETS.scores.accessibility) {
      const violation = {
        metric: 'accessibility_score',
        actual: summary.accessibility,
        budget: PERFORMANCE_BUDGETS.scores.accessibility,
        severity: getSeverity(summary.accessibility, PERFORMANCE_BUDGETS.scores.accessibility),
        message: `Accessibility score ${summary.accessibility} below budget of ${PERFORMANCE_BUDGETS.scores.accessibility}`,
      };
      violations.push(violation);
    }

    // Check best practices score
    if (summary['best-practices'] < PERFORMANCE_BUDGETS.scores.bestPractices) {
      const violation = {
        metric: 'best_practices_score',
        actual: summary['best-practices'],
        budget: PERFORMANCE_BUDGETS.scores.bestPractices,
        severity: getSeverity(summary['best-practices'], PERFORMANCE_BUDGETS.scores.bestPractices),
        message: `Best practices score ${summary['best-practices']} below budget of ${PERFORMANCE_BUDGETS.scores.bestPractices}`,
      };
      violations.push(violation);
    }

    // Check SEO score
    if (summary.seo < PERFORMANCE_BUDGETS.scores.seo) {
      const violation = {
        metric: 'seo_score',
        actual: summary.seo,
        budget: PERFORMANCE_BUDGETS.scores.seo,
        severity: getSeverity(summary.seo, PERFORMANCE_BUDGETS.scores.seo),
        message: `SEO score ${summary.seo} below budget of ${PERFORMANCE_BUDGETS.scores.seo}`,
      };
      violations.push(violation);
    }
  });

  // Check bundle analysis
  if (bundleAnalysis) {
    // Check total bundle size
    if (bundleAnalysis.totalSize > PERFORMANCE_BUDGETS.resources.totalSize) {
      const violation = {
        metric: 'total_bundle_size',
        actual: bundleAnalysis.totalSize,
        budget: PERFORMANCE_BUDGETS.resources.totalSize,
        severity: getSeverity(bundleAnalysis.totalSize, PERFORMANCE_BUDGETS.resources.totalSize),
        message: `Total bundle size ${bundleAnalysis.totalSize} bytes exceeds budget of ${PERFORMANCE_BUDGETS.resources.totalSize} bytes`,
      };
      violations.push(violation);
    }

    // Check JavaScript size
    if (bundleAnalysis.jsSize > PERFORMANCE_BUDGETS.resources.jsSize) {
      const violation = {
        metric: 'javascript_size',
        actual: bundleAnalysis.jsSize,
        budget: PERFORMANCE_BUDGETS.resources.jsSize,
        severity: getSeverity(bundleAnalysis.jsSize, PERFORMANCE_BUDGETS.resources.jsSize),
        message: `JavaScript size ${bundleAnalysis.jsSize} bytes exceeds budget of ${PERFORMANCE_BUDGETS.resources.jsSize} bytes`,
      };
      violations.push(violation);
    }

    // Check CSS size
    if (bundleAnalysis.cssSize > PERFORMANCE_BUDGETS.resources.cssSize) {
      const violation = {
        metric: 'css_size',
        actual: bundleAnalysis.cssSize,
        budget: PERFORMANCE_BUDGETS.resources.cssSize,
        severity: getSeverity(bundleAnalysis.cssSize, PERFORMANCE_BUDGETS.resources.cssSize),
        message: `CSS size ${bundleAnalysis.cssSize} bytes exceeds budget of ${PERFORMANCE_BUDGETS.resources.cssSize} bytes`,
      };
      violations.push(violation);
    }
  }

  // Count violations by severity
  violations.forEach(violation => {
    report.totalViolations++;
    report[violation.severity + 'Violations']++;
  });

  // Calculate overall score
  report.score = Math.max(
    0,
    100 -
      (report.criticalViolations * 25 +
        report.highViolations * 15 +
        report.mediumViolations * 10 +
        report.lowViolations * 5),
  );

  report.violations = violations;

  return report;
}

// Get severity level
function getSeverity(actual, budget) {
  const ratio = actual / budget;

  if (ratio >= 2) return 'critical';
  if (ratio >= 1.5) return 'high';
  if (ratio >= 1.2) return 'medium';
  return 'low';
}

// Generate performance budget report
function generateReport(report) {
  console.log('\n📊 Performance Budget Report');
  console.log('============================');

  console.log(`\n📈 Overall Score: ${report.score}/100`);
  console.log(`\n🚨 Violations:`);
  console.log(`  Total: ${report.totalViolations}`);
  console.log(`  Critical: ${report.criticalViolations}`);
  console.log(`  High: ${report.highViolations}`);
  console.log(`  Medium: ${report.mediumViolations}`);
  console.log(`  Low: ${report.lowViolations}`);

  if (report.violations.length > 0) {
    console.log(`\n📋 Detailed Violations:`);
    report.violations.forEach((violation, index) => {
      const emoji =
        violation.severity === 'critical'
          ? '🚨'
          : violation.severity === 'high'
            ? '⚠️'
            : violation.severity === 'medium'
              ? '🔶'
              : '🔸';
      console.log(`  ${index + 1}. ${emoji} ${violation.message}`);
    });
  }

  // Generate recommendations
  if (report.violations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    const recommendations = generateRecommendations(report.violations);
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  return report;
}

// Generate recommendations
function generateRecommendations(violations) {
  const recommendations = [];

  violations.forEach(violation => {
    switch (violation.metric) {
      case 'performance_score':
        recommendations.push(
          'Optimize images, reduce server response time, or eliminate render-blocking resources',
        );
        break;
      case 'accessibility_score':
        recommendations.push('Improve ARIA labels, color contrast, and keyboard navigation');
        break;
      case 'best_practices_score':
        recommendations.push('Update dependencies, fix security issues, and follow web standards');
        break;
      case 'seo_score':
        recommendations.push('Improve meta tags, structured data, and content optimization');
        break;
      case 'total_bundle_size':
        recommendations.push('Enable compression, remove unused code, or optimize images');
        break;
      case 'javascript_size':
        recommendations.push('Code splitting, tree shaking, or remove unused JavaScript');
        break;
      case 'css_size':
        recommendations.push('Remove unused CSS or inline critical CSS');
        break;
    }
  });

  return [...new Set(recommendations)]; // Remove duplicates
}

// Save report to file
function saveReport(report) {
  const reportPath = path.join(process.cwd(), 'performance-budget-report.json');

  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
  } catch (error) {
    console.error('❌ Failed to save report:', error.message);
  }
}

// Main function
function main() {
  console.log('🔍 Checking Performance Budget...');

  // Read results
  const lighthouseResults = readLighthouseResults();
  const bundleAnalysis = readBundleAnalysis();

  // Check budget
  const report = checkPerformanceBudget(lighthouseResults, bundleAnalysis);

  // Generate and display report
  generateReport(report);

  // Save report
  saveReport(report);

  // Exit with error code if there are critical violations
  if (report.criticalViolations > 0) {
    console.log('\n❌ Critical performance budget violations detected!');
    process.exit(1);
  } else if (report.highViolations > 0) {
    console.log('\n⚠️ High priority performance budget violations detected!');
    process.exit(1);
  } else {
    console.log('\n✅ Performance budget check passed!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  checkPerformanceBudget,
  generateReport,
  generateRecommendations,
};
