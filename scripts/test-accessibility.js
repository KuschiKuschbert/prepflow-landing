#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Tests WCAG 2.1 AA compliance using axe-core and Lighthouse
 *
 * Usage:
 *   npm run test:accessibility
 *   node scripts/test-accessibility.js [--url=http://localhost:3000] [--format=json|html]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEFAULT_URL = process.env.URL || 'http://localhost:3000';
const OUTPUT_FORMAT = process.env.FORMAT || 'json';
const OUTPUT_DIR = path.join(process.cwd(), 'accessibility-reports');

// Pages to test
const PAGES_TO_TEST = [
  '/',
  '/webapp',
  '/webapp/ingredients',
  '/webapp/recipes',
  '/webapp/cogs',
  '/webapp/performance',
  '/webapp/temperature',
  '/webapp/settings',
  '/terms-of-service',
  '/privacy-policy',
];

/**
 * Run Lighthouse accessibility audit
 */
function runLighthouseAudit(url) {
  try {
    console.log(`\n🔍 Running Lighthouse accessibility audit for ${url}...`);

    const outputPath = path.join(OUTPUT_DIR, `lighthouse-${url.replace(/[^a-z0-9]/gi, '_')}.json`);

    execSync(
      `npx lighthouse ${url} --only-categories=accessibility --output=json --output-path=${outputPath} --chrome-flags="--headless" --quiet`,
      { stdio: 'inherit' },
    );

    const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const accessibilityScore = report.categories.accessibility.score * 100;

    console.log(`✅ Lighthouse accessibility score: ${accessibilityScore.toFixed(0)}/100`);

    // Extract violations
    const violations = report.audits || {};
    const criticalIssues = Object.entries(violations)
      .filter(([_, audit]) => audit.score !== null && audit.score < 1)
      .map(([id, audit]) => ({
        id,
        title: audit.title,
        description: audit.description,
        score: audit.score,
        impact: audit.details?.items || [],
      }));

    return {
      score: accessibilityScore,
      violations: criticalIssues,
      url,
    };
  } catch (error) {
    console.error(`❌ Lighthouse audit failed for ${url}:`, error.message);
    return {
      score: 0,
      violations: [],
      url,
      error: error.message,
    };
  }
}

/**
 * Check for common accessibility issues in codebase
 */
function checkCodebaseAccessibility() {
  console.log('\n🔍 Checking codebase for accessibility issues...');

  const issues = {
    missingAltText: [],
    missingAriaLabels: [],
    missingFormLabels: [],
    missingFocusIndicators: [],
    colorContrastIssues: [],
  };

  // Check for images without alt text
  try {
    const imageFiles = execSync('find app components -name "*.tsx" -o -name "*.ts" | head -20', {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    imageFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        // Check for <img> tags without alt
        const imgMatches = content.matchAll(/<img[^>]*>/gi);
        for (const match of imgMatches) {
          if (
            !match[0].includes('alt=') &&
            !match[0].includes('alt="') &&
            !match[0].includes("alt='")
          ) {
            issues.missingAltText.push({
              file,
              line: content.substring(0, match.index).split('\n').length,
            });
          }
        }

        // Check for Image components without alt
        const imageComponentMatches = content.matchAll(/<Image[^>]*>/gi);
        for (const match of imageComponentMatches) {
          if (
            !match[0].includes('alt=') &&
            !match[0].includes('alt="') &&
            !match[0].includes("alt='")
          ) {
            issues.missingAltText.push({
              file,
              line: content.substring(0, match.index).split('\n').length,
            });
          }
        }

        // Check for buttons without aria-label
        const buttonMatches = content.matchAll(/<button[^>]*>/gi);
        for (const match of buttonMatches) {
          if (
            !match[0].includes('aria-label') &&
            !match[0].includes('aria-labelledby') &&
            !content.substring(match.index, match.index + 200).includes('>')
          ) {
            // Check if button has visible text content
            const afterButton = content.substring(match.index + match[0].length, match.index + 500);
            if (!afterButton.match(/>[^<]+</)) {
              // No visible text content
              issues.missingAriaLabels.push({
                file,
                line: content.substring(0, match.index).split('\n').length,
              });
            }
          }
        }

        // Check for inputs without labels
        const inputMatches = content.matchAll(/<input[^>]*>/gi);
        for (const match of inputMatches) {
          const inputType = match[0].match(/type=["']([^"']+)["']/)?.[1];
          if (inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button') {
            // Check if input has associated label or aria-label
            const beforeInput = content.substring(Math.max(0, match.index - 500), match.index);
            const hasLabel =
              beforeInput.includes('<label') ||
              match[0].includes('aria-label') ||
              match[0].includes('aria-labelledby');
            if (!hasLabel) {
              issues.missingFormLabels.push({
                file,
                line: content.substring(0, match.index).split('\n').length,
              });
            }
          }
        }
      } catch (err) {
        // Skip files that can't be read
      }
    });
  } catch (error) {
    console.warn('⚠️  Could not scan codebase:', error.message);
  }

  return issues;
}

/**
 * Generate accessibility report
 */
function generateReport(results, codebaseIssues) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
      pagesWithIssues: results.filter(r => r.violations.length > 0).length,
      totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
    },
    pageResults: results,
    codebaseIssues,
    recommendations: [
      'Add alt text to all images',
      'Add aria-label to all icon-only buttons',
      'Ensure all form inputs have associated labels',
      'Add visible focus indicators to all interactive elements',
      'Test color contrast ratios (minimum 4.5:1 for normal text)',
      'Ensure keyboard navigation works for all interactive elements',
      'Test with screen readers (NVDA, JAWS, VoiceOver)',
    ],
  };

  return report;
}

/**
 * Main function
 */
async function main() {
  console.log('🧪 PrepFlow Accessibility Testing');
  console.log('================================\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  // Test each page
  for (const page of PAGES_TO_TEST) {
    const url = `${DEFAULT_URL}${page}`;
    console.log(`\n📄 Testing: ${url}`);
    const result = runLighthouseAudit(url);
    results.push(result);
  }

  // Check codebase
  const codebaseIssues = checkCodebaseAccessibility();

  // Generate report
  const report = generateReport(results, codebaseIssues);

  // Save report
  const reportPath = path.join(OUTPUT_DIR, `accessibility-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n📊 Accessibility Test Summary');
  console.log('============================');
  console.log(`Total Pages Tested: ${report.summary.totalPages}`);
  console.log(`Average Score: ${report.summary.averageScore.toFixed(0)}/100`);
  console.log(`Pages with Issues: ${report.summary.pagesWithIssues}`);
  console.log(`Total Violations: ${report.summary.totalViolations}`);

  if (codebaseIssues.missingAltText.length > 0) {
    console.log(`\n⚠️  Missing Alt Text: ${codebaseIssues.missingAltText.length} instances`);
  }
  if (codebaseIssues.missingAriaLabels.length > 0) {
    console.log(`⚠️  Missing ARIA Labels: ${codebaseIssues.missingAriaLabels.length} instances`);
  }
  if (codebaseIssues.missingFormLabels.length > 0) {
    console.log(`⚠️  Missing Form Labels: ${codebaseIssues.missingFormLabels.length} instances`);
  }

  console.log(`\n📄 Full report saved to: ${reportPath}`);

  // Exit with error code if there are critical issues
  if (report.summary.averageScore < 90 || report.summary.totalViolations > 0) {
    console.log('\n❌ Accessibility issues found. Please review the report.');
    process.exit(1);
  } else {
    console.log('\n✅ Accessibility tests passed!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Accessibility test failed:', error);
    process.exit(1);
  });
}

module.exports = { main, runLighthouseAudit, checkCodebaseAccessibility };



