#!/usr/bin/env node

/**
 * Generate Learning Report
 * Generates weekly report of errors encountered, fixes documented, patterns identified
 */

const fs = require('fs');
const path = require('path');

const CAPTURED_ERRORS_FILE = path.join(__dirname, '../../.error-capture/captured-errors.json');
const FIXES_FILE = path.join(__dirname, '../../docs/errors/fixes.json');
const KNOWLEDGE_BASE_FILE = path.join(__dirname, '../../docs/errors/knowledge-base.json');

/**
 * Load captured errors
 */
function loadCapturedErrors() {
  if (!fs.existsSync(CAPTURED_ERRORS_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(CAPTURED_ERRORS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Load fixes
 */
function loadFixes() {
  if (!fs.existsSync(FIXES_FILE)) {
    return [];
  }
  
  try {
    const content = fs.readFileSync(FIXES_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Load knowledge base
 */
function loadKnowledgeBase() {
  if (!fs.existsSync(KNOWLEDGE_BASE_FILE)) {
    return { errors: [], patterns: [], rules: [] };
  }
  
  try {
    const content = fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return { errors: [], patterns: [], rules: [] };
  }
}

/**
 * Generate learning report
 */
function generateLearningReport(days = 7) {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  const errors = loadCapturedErrors();
  const fixes = loadFixes();
  const kb = loadKnowledgeBase();
  
  // Filter by date
  const recentErrors = errors.filter(err => new Date(err.capturedAt) >= cutoffDate);
  const recentFixes = fixes.filter(fix => new Date(fix.documentedAt) >= cutoffDate);
  
  // Group errors by source
  const errorsBySource = {};
  for (const error of recentErrors) {
    errorsBySource[error.source] = (errorsBySource[error.source] || 0) + 1;
  }
  
  // Group errors by type
  const errorsByType = {};
  for (const error of recentErrors) {
    errorsByType[error.errorType] = (errorsByType[error.errorType] || 0) + 1;
  }
  
  // Group errors by category
  const errorsByCategory = {};
  for (const error of recentErrors) {
    errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
  }
  
  // Group fixes by documentedBy
  const fixesBySource = {};
  for (const fix of recentFixes) {
    fixesBySource[fix.documentedBy] = (fixesBySource[fix.documentedBy] || 0) + 1;
  }
  
  // Generate report
  const report = {
    period: {
      start: cutoffDate.toISOString(),
      end: new Date().toISOString(),
      days,
    },
    summary: {
      totalErrors: recentErrors.length,
      totalFixes: recentFixes.length,
      totalPatterns: kb.patterns.length,
      totalRules: kb.rules.length,
      fixRate: recentErrors.length > 0 ? (recentFixes.length / recentErrors.length * 100).toFixed(1) + '%' : '0%',
    },
    errors: {
      bySource: errorsBySource,
      byType: errorsByType,
      byCategory: errorsByCategory,
      recent: recentErrors.slice(-10).map(err => ({
        id: err.id,
        source: err.source,
        type: err.errorType,
        category: err.category,
        message: err.message.substring(0, 100),
        capturedAt: err.capturedAt,
        status: err.status,
      })),
    },
    fixes: {
      bySource: fixesBySource,
      recent: recentFixes.slice(-10).map(fix => ({
        id: fix.fixId,
        errorId: fix.errorId,
        solution: fix.solution.substring(0, 100),
        documentedAt: fix.documentedAt,
        documentedBy: fix.documentedBy,
      })),
    },
    patterns: {
      total: kb.patterns.length,
      recent: kb.patterns.slice(-5).map(pattern => ({
        id: pattern.id,
        name: pattern.name,
        description: pattern.description.substring(0, 100),
      })),
    },
    rules: {
      total: kb.rules.length,
      automated: kb.rules.filter(r => r.enforcement === 'automated').length,
      manual: kb.rules.filter(r => r.enforcement === 'manual').length,
      recent: kb.rules.slice(-5).map(rule => ({
        id: rule.id,
        name: rule.name,
        source: rule.source,
        enforcement: rule.enforcement,
      })),
    },
  };
  
  return report;
}

/**
 * Format report as markdown
 */
function formatReportAsMarkdown(report) {
  return `# Error Learning Report

**Period:** ${new Date(report.period.start).toLocaleDateString()} - ${new Date(report.period.end).toLocaleDateString()} (${report.period.days} days)

## Summary

- **Total Errors:** ${report.summary.totalErrors}
- **Total Fixes:** ${report.summary.totalFixes}
- **Total Patterns:** ${report.summary.totalPatterns}
- **Total Rules:** ${report.summary.totalRules}
- **Fix Rate:** ${report.summary.fixRate}

## Errors

### By Source

${Object.entries(report.errors.bySource).map(([source, count]) => `- **${source}**: ${count}`).join('\n')}

### By Type

${Object.entries(report.errors.byType).map(([type, count]) => `- **${type}**: ${count}`).join('\n')}

### By Category

${Object.entries(report.errors.byCategory).map(([category, count]) => `- **${category}**: ${count}`).join('\n')}

### Recent Errors

${report.errors.recent.map(err => `- **${err.id}**: ${err.message} (${err.source}/${err.type}) - ${err.status}`).join('\n')}

## Fixes

### By Source

${Object.entries(report.fixes.bySource).map(([source, count]) => `- **${source}**: ${count}`).join('\n')}

### Recent Fixes

${report.fixes.recent.map(fix => `- **${fix.id}**: ${fix.solution} (${fix.documentedBy})`).join('\n')}

## Patterns

- **Total Patterns:** ${report.patterns.total}
${report.patterns.recent.length > 0 ? `\n### Recent Patterns\n\n${report.patterns.recent.map(pattern => `- **${pattern.name}**: ${pattern.description}`).join('\n')}` : ''}

## Rules

- **Total Rules:** ${report.rules.total}
- **Automated:** ${report.rules.automated}
- **Manual:** ${report.rules.manual}
${report.rules.recent.length > 0 ? `\n### Recent Rules\n\n${report.rules.recent.map(rule => `- **${rule.name}**: ${rule.source} (${rule.enforcement})`).join('\n')}` : ''}
`;
}

/**
 * Save report to file
 */
function saveReport(report, format = 'markdown') {
  const reportsDir = path.join(__dirname, '../../docs/errors/reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = `learning-report-${timestamp}.${format === 'json' ? 'json' : 'md'}`;
  const filePath = path.join(reportsDir, fileName);
  
  if (format === 'json') {
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  } else {
    const markdown = formatReportAsMarkdown(report);
    fs.writeFileSync(filePath, markdown);
  }
  
  return filePath;
}

/**
 * Main CLI interface
 */
function main() {
  const args = process.argv.slice(2);
  const days = parseInt(args[0]) || 7;
  const format = args[1] || 'markdown';
  
  console.log(`Generating learning report for last ${days} days...`);
  
  const report = generateLearningReport(days);
  
  // Print summary to console
  console.log('\n' + formatReportAsMarkdown(report));
  
  // Save report to file
  const filePath = saveReport(report, format);
  console.log(`\n✅ Report saved to: ${filePath}`);
}

if (require.main === module) {
  main();
}

module.exports = {
  generateLearningReport,
  formatReportAsMarkdown,
  saveReport,
};
