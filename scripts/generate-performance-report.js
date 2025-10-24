#!/usr/bin/env node

// Performance Report Generator for PrepFlow
// Generates comprehensive performance monitoring reports

const fs = require('fs');
const path = require('path');

// Report configuration
const REPORT_CONFIG = {
  outputDir: 'performance-reports',
  formats: ['json', 'html', 'markdown'],
  includeCharts: true,
  includeRecommendations: true,
  includeTrends: true,
};

// Read performance data from various sources
function readPerformanceData() {
  const data = {
    lighthouse: null,
    bundle: null,
    budget: null,
    timestamp: new Date().toISOString(),
  };

  // Read Lighthouse CI results
  const lighthousePath = path.join(process.cwd(), '.lighthouseci', 'results.json');
  if (fs.existsSync(lighthousePath)) {
    try {
      data.lighthouse = JSON.parse(fs.readFileSync(lighthousePath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Failed to read Lighthouse results:', error.message);
    }
  }

  // Read bundle analysis
  const bundlePath = path.join(process.cwd(), 'bundle-analysis-report.json');
  if (fs.existsSync(bundlePath)) {
    try {
      data.bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Failed to read bundle analysis:', error.message);
    }
  }

  // Read performance budget report
  const budgetPath = path.join(process.cwd(), 'performance-budget-report.json');
  if (fs.existsSync(budgetPath)) {
    try {
      data.budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
    } catch (error) {
      console.warn('⚠️ Failed to read budget report:', error.message);
    }
  }

  return data;
}

// Generate performance summary
function generateSummary(data) {
  const summary = {
    timestamp: data.timestamp,
    overallScore: 0,
    metrics: {},
    recommendations: [],
    status: 'unknown',
  };

  // Calculate overall score
  if (data.budget) {
    summary.overallScore = data.budget.score;
    summary.status =
      data.budget.criticalViolations > 0
        ? 'critical'
        : data.budget.highViolations > 0
          ? 'warning'
          : 'good';
  }

  // Extract Lighthouse metrics
  if (data.lighthouse && data.lighthouse.length > 0) {
    const result = data.lighthouse[0];
    summary.metrics.lighthouse = {
      performance: result.summary?.performance || 0,
      accessibility: result.summary?.accessibility || 0,
      bestPractices: result.summary?.['best-practices'] || 0,
      seo: result.summary?.seo || 0,
    };
  }

  // Extract bundle metrics
  if (data.bundle) {
    summary.metrics.bundle = {
      totalSize: data.bundle.totalSize || 0,
      jsSize: data.bundle.jsSize || 0,
      cssSize: data.bundle.cssSize || 0,
      imageSize: data.bundle.imageSize || 0,
    };
  }

  // Extract budget metrics
  if (data.budget) {
    summary.metrics.budget = {
      totalViolations: data.budget.totalViolations || 0,
      criticalViolations: data.budget.criticalViolations || 0,
      highViolations: data.budget.highViolations || 0,
      score: data.budget.score || 0,
    };
  }

  return summary;
}

// Generate recommendations
function generateRecommendations(summary) {
  const recommendations = [];

  // Performance recommendations
  if (summary.metrics.lighthouse?.performance < 80) {
    recommendations.push({
      category: 'performance',
      priority: 'high',
      title: 'Improve Performance Score',
      description:
        'Performance score is below 80. Consider optimizing images, reducing server response time, and eliminating render-blocking resources.',
      actions: [
        'Enable image optimization',
        'Implement code splitting',
        'Optimize third-party scripts',
        'Use CDN for static assets',
      ],
    });
  }

  // Accessibility recommendations
  if (summary.metrics.lighthouse?.accessibility < 90) {
    recommendations.push({
      category: 'accessibility',
      priority: 'high',
      title: 'Improve Accessibility',
      description:
        'Accessibility score is below 90. Focus on ARIA labels, color contrast, and keyboard navigation.',
      actions: [
        'Add ARIA labels to interactive elements',
        'Improve color contrast ratios',
        'Ensure keyboard navigation works',
        'Add alt text to images',
      ],
    });
  }

  // Bundle size recommendations
  if (summary.metrics.bundle?.totalSize > 500000) {
    recommendations.push({
      category: 'bundle',
      priority: 'medium',
      title: 'Reduce Bundle Size',
      description:
        'Bundle size exceeds 500KB. Consider code splitting and removing unused dependencies.',
      actions: [
        'Implement dynamic imports',
        'Remove unused dependencies',
        'Enable tree shaking',
        'Optimize images',
      ],
    });
  }

  // Budget violations recommendations
  if (summary.metrics.budget?.criticalViolations > 0) {
    recommendations.push({
      category: 'budget',
      priority: 'critical',
      title: 'Address Critical Budget Violations',
      description: 'Critical performance budget violations detected. Immediate action required.',
      actions: [
        'Review recent changes',
        'Optimize critical code paths',
        'Consider reverting problematic changes',
        'Update performance budgets if needed',
      ],
    });
  }

  return recommendations;
}

// Generate HTML report
function generateHTMLReport(summary, recommendations) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrepFlow Performance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #29E7CD, #D925C7); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .metric { background: #f8f9fa; padding: 20px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #29E7CD; }
        .recommendation { background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #ffc107; }
        .critical { border-left-color: #dc3545; background: #f8d7da; }
        .high { border-left-color: #fd7e14; background: #ffeaa7; }
        .medium { border-left-color: #ffc107; background: #fff3cd; }
        .score { font-size: 2em; font-weight: bold; margin: 10px 0; }
        .good { color: #28a745; }
        .warning { color: #ffc107; }
        .critical { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 PrepFlow Performance Report</h1>
            <p>Generated: ${summary.timestamp}</p>
            <div class="score ${summary.status}">Overall Score: ${summary.overallScore}/100</div>
        </div>

        <div class="content">
            <h2>📊 Performance Metrics</h2>

            ${
              summary.metrics.lighthouse
                ? `
            <div class="metric">
                <h3>Lighthouse Scores</h3>
                <p><strong>Performance:</strong> ${summary.metrics.lighthouse.performance}</p>
                <p><strong>Accessibility:</strong> ${summary.metrics.lighthouse.accessibility}</p>
                <p><strong>Best Practices:</strong> ${summary.metrics.lighthouse.bestPractices}</p>
                <p><strong>SEO:</strong> ${summary.metrics.lighthouse.seo}</p>
            </div>
            `
                : ''
            }

            ${
              summary.metrics.bundle
                ? `
            <div class="metric">
                <h3>Bundle Analysis</h3>
                <p><strong>Total Size:</strong> ${(summary.metrics.bundle.totalSize / 1024).toFixed(1)} KB</p>
                <p><strong>JavaScript:</strong> ${(summary.metrics.bundle.jsSize / 1024).toFixed(1)} KB</p>
                <p><strong>CSS:</strong> ${(summary.metrics.bundle.cssSize / 1024).toFixed(1)} KB</p>
                <p><strong>Images:</strong> ${(summary.metrics.bundle.imageSize / 1024).toFixed(1)} KB</p>
            </div>
            `
                : ''
            }

            ${
              summary.metrics.budget
                ? `
            <div class="metric">
                <h3>Performance Budget</h3>
                <p><strong>Total Violations:</strong> ${summary.metrics.budget.totalViolations}</p>
                <p><strong>Critical:</strong> ${summary.metrics.budget.criticalViolations}</p>
                <p><strong>High:</strong> ${summary.metrics.budget.highViolations}</p>
                <p><strong>Score:</strong> ${summary.metrics.budget.score}/100</p>
            </div>
            `
                : ''
            }

            <h2>💡 Recommendations</h2>
            ${recommendations
              .map(
                rec => `
            <div class="recommendation ${rec.priority}">
                <h3>${rec.title}</h3>
                <p>${rec.description}</p>
                <ul>
                    ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                </ul>
            </div>
            `,
              )
              .join('')}
        </div>
    </div>
</body>
</html>
  `;

  return html;
}

// Generate markdown report
function generateMarkdownReport(summary, recommendations) {
  let markdown = `# 🚀 PrepFlow Performance Report\n\n`;
  markdown += `**Generated:** ${summary.timestamp}\n\n`;
  markdown += `## 📊 Overall Score: ${summary.overallScore}/100\n\n`;

  if (summary.metrics.lighthouse) {
    markdown += `## 🏆 Lighthouse Scores\n\n`;
    markdown += `- **Performance:** ${summary.metrics.lighthouse.performance}\n`;
    markdown += `- **Accessibility:** ${summary.metrics.lighthouse.accessibility}\n`;
    markdown += `- **Best Practices:** ${summary.metrics.lighthouse.bestPractices}\n`;
    markdown += `- **SEO:** ${summary.metrics.lighthouse.seo}\n\n`;
  }

  if (summary.metrics.bundle) {
    markdown += `## 📦 Bundle Analysis\n\n`;
    markdown += `- **Total Size:** ${(summary.metrics.bundle.totalSize / 1024).toFixed(1)} KB\n`;
    markdown += `- **JavaScript:** ${(summary.metrics.bundle.jsSize / 1024).toFixed(1)} KB\n`;
    markdown += `- **CSS:** ${(summary.metrics.bundle.cssSize / 1024).toFixed(1)} KB\n`;
    markdown += `- **Images:** ${(summary.metrics.bundle.imageSize / 1024).toFixed(1)} KB\n\n`;
  }

  if (summary.metrics.budget) {
    markdown += `## 🎯 Performance Budget\n\n`;
    markdown += `- **Total Violations:** ${summary.metrics.budget.totalViolations}\n`;
    markdown += `- **Critical:** ${summary.metrics.budget.criticalViolations}\n`;
    markdown += `- **High:** ${summary.metrics.budget.highViolations}\n`;
    markdown += `- **Score:** ${summary.metrics.budget.score}/100\n\n`;
  }

  markdown += `## 💡 Recommendations\n\n`;
  recommendations.forEach((rec, index) => {
    markdown += `### ${index + 1}. ${rec.title}\n\n`;
    markdown += `${rec.description}\n\n`;
    markdown += `**Actions:**\n`;
    rec.actions.forEach(action => {
      markdown += `- ${action}\n`;
    });
    markdown += `\n`;
  });

  return markdown;
}

// Save reports
function saveReports(summary, recommendations) {
  const outputDir = path.join(process.cwd(), REPORT_CONFIG.outputDir);

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];

  // Save JSON report
  const jsonReport = { summary, recommendations };
  fs.writeFileSync(
    path.join(outputDir, `performance-report-${timestamp}.json`),
    JSON.stringify(jsonReport, null, 2),
  );

  // Save HTML report
  const htmlReport = generateHTMLReport(summary, recommendations);
  fs.writeFileSync(path.join(outputDir, `performance-report-${timestamp}.html`), htmlReport);

  // Save Markdown report
  const markdownReport = generateMarkdownReport(summary, recommendations);
  fs.writeFileSync(path.join(outputDir, `performance-report-${timestamp}.md`), markdownReport);

  console.log(`📊 Reports saved to: ${outputDir}/`);
  console.log(`  - performance-report-${timestamp}.json`);
  console.log(`  - performance-report-${timestamp}.html`);
  console.log(`  - performance-report-${timestamp}.md`);
}

// Main function
function main() {
  console.log('📊 Generating Performance Report...');

  // Read performance data
  const data = readPerformanceData();

  // Generate summary
  const summary = generateSummary(data);

  // Generate recommendations
  const recommendations = generateRecommendations(summary);

  // Save reports
  saveReports(summary, recommendations);

  console.log('\n✅ Performance report generated successfully!');

  // Display summary
  console.log(`\n📈 Summary:`);
  console.log(`  Overall Score: ${summary.overallScore}/100`);
  console.log(`  Status: ${summary.status}`);
  console.log(`  Recommendations: ${recommendations.length}`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSummary,
  generateRecommendations,
  generateHTMLReport,
  generateMarkdownReport,
};
