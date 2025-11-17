#!/usr/bin/env node

/**
 * Report Generation Utilities
 * Generates JSON, HTML, and CLI reports from violations
 */

const fs = require('fs');
const path = require('path');
const {
  groupViolationsByFile,
  groupViolationsByStandard,
  countViolationsBySeverity,
} = require('./violations');

/**
 * Generate JSON report
 */
function generateJSONReport(violations, outputPath) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: violations.length,
      bySeverity: countViolationsBySeverity(violations),
      byStandard: Object.keys(groupViolationsByStandard(violations)).length,
      byFile: Object.keys(groupViolationsByFile(violations)).length,
    },
    violations: violations,
    groupedByFile: groupViolationsByFile(violations),
    groupedByStandard: groupViolationsByStandard(violations),
  };

  if (outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  }

  return report;
}

/**
 * Generate CLI report
 */
function generateCLIReport(violations) {
  const counts = countViolationsBySeverity(violations);
  const groupedByFile = groupViolationsByFile(violations);
  const groupedByStandard = groupViolationsByStandard(violations);

  let output = '\n📊 Cleanup Report\n';
  output += '='.repeat(50) + '\n\n';

  // Summary
  output += 'Summary:\n';
  output += `  Total violations: ${violations.length}\n`;
  output += `  Critical: ${counts.critical}\n`;
  output += `  Warning: ${counts.warning}\n`;
  output += `  Info: ${counts.info}\n`;
  output += `  Files affected: ${Object.keys(groupedByFile).length}\n`;
  output += `  Standards violated: ${Object.keys(groupedByStandard).length}\n\n`;

  // Grouped by file
  output += 'Violations by File:\n';
  output += '-'.repeat(50) + '\n';
  for (const [file, fileViolations] of Object.entries(groupedByFile)) {
    output += `\n${file} (${fileViolations.length} violations):\n`;
    for (const violation of fileViolations) {
      const location = violation.line
        ? `:${violation.line}${violation.column ? `:${violation.column}` : ''}`
        : '';
      output += `  [${violation.severity.toUpperCase()}] ${violation.message}${location}\n`;
      output += `    Standard: ${violation.standard}\n`;
      if (violation.fixable) {
        output += `    Fixable: Yes (run --fix)\n`;
      }
    }
  }

  // Grouped by standard
  output += '\n\nViolations by Standard:\n';
  output += '-'.repeat(50) + '\n';
  for (const [standard, standardViolations] of Object.entries(groupedByStandard)) {
    output += `\n${standard} (${standardViolations.length} violations):\n`;
    for (const violation of standardViolations.slice(0, 5)) {
      output += `  ${violation.file}${violation.line ? `:${violation.line}` : ''} - ${violation.message}\n`;
    }
    if (standardViolations.length > 5) {
      output += `  ... and ${standardViolations.length - 5} more\n`;
    }
  }

  return output;
}

/**
 * Generate HTML report
 */
function generateHTMLReport(violations, outputPath) {
  const counts = countViolationsBySeverity(violations);
  const groupedByFile = groupViolationsByFile(violations);
  const groupedByStandard = groupViolationsByStandard(violations);

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Cleanup Report</title><style>body{font-family:system-ui,sans-serif;margin:20px;background:#0a0a0a;color:#fff}.summary{background:#1f1f1f;padding:20px;border-radius:8px;margin-bottom:20px}.summary h2{margin-top:0}.summary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:15px}.summary-item{background:#2a2a2a;padding:15px;border-radius:8px}.summary-item .value{font-size:2em;font-weight:bold;color:#29e7cd}.violations{margin-top:20px}.file-group{background:#1f1f1f;padding:15px;margin-bottom:15px;border-radius:8px}.file-group h3{margin-top:0;color:#29e7cd}.violation{background:#2a2a2a;padding:10px;margin:5px 0;border-radius:4px;border-left:4px solid}.violation.critical{border-color:#ef4444}.violation.warning{border-color:#f59e0b}.violation.info{border-color:#3b82f6}.violation-meta{font-size:0.9em;color:#9ca3af;margin-top:5px}a{color:#29e7cd}</style></head><body><h1>🧹 Cleanup Report</h1><div class="summary"><h2>Summary</h2><div class="summary-grid"><div class="summary-item"><div class="value">${violations.length}</div><div>Total Violations</div></div><div class="summary-item"><div class="value">${counts.critical}</div><div>Critical</div></div><div class="summary-item"><div class="value">${counts.warning}</div><div>Warning</div></div><div class="summary-item"><div class="value">${counts.info}</div><div>Info</div></div><div class="summary-item"><div class="value">${Object.keys(groupedByFile).length}</div><div>Files Affected</div></div><div class="summary-item"><div class="value">${Object.keys(groupedByStandard).length}</div><div>Standards Violated</div></div></div></div><div class="violations"><h2>Violations by File</h2>${Object.entries(
    groupedByFile,
  )
    .map(
      ([file, fileViolations]) =>
        `<div class="file-group"><h3>${file} (${fileViolations.length} violations)</h3>${fileViolations.map(v => `<div class="violation ${v.severity}"><strong>${v.message}</strong>${v.line ? `<span style="color:#9ca3af;"> (line ${v.line})</span>` : ''}<div class="violation-meta">Standard: <a href="#${v.standard}">${v.standard}</a>${v.fixable ? ' | <span style="color:#29e7cd;">Fixable</span>' : ''}</div></div>`).join('')}</div>`,
    )
    .join('')}</div><div class="violations"><h2>Violations by Standard</h2>${Object.entries(
    groupedByStandard,
  )
    .map(
      ([standard, standardViolations]) =>
        `<div class="file-group" id="${standard}"><h3>${standard} (${standardViolations.length} violations)</h3><ul>${standardViolations
          .slice(0, 10)
          .map(v => `<li>${v.file}${v.line ? `:${v.line}` : ''} - ${v.message}</li>`)
          .join(
            '',
          )}${standardViolations.length > 10 ? `<li>... and ${standardViolations.length - 10} more</li>` : ''}</ul></div>`,
    )
    .join(
      '',
    )}</div><div style="margin-top:40px;padding-top:20px;border-top:1px solid #2a2a2a;color:#9ca3af;font-size:0.9em;">Generated at ${new Date().toISOString()}</div></body></html>`;

  if (outputPath) {
    fs.writeFileSync(outputPath, html);
  }

  return html;
}

module.exports = {
  generateJSONReport,
  generateCLIReport,
  generateHTMLReport,
};
