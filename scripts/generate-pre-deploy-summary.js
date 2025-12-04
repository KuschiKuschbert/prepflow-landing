#!/usr/bin/env node

/**
 * Pre-Deployment Summary Report Generator
 * Combines pre-deploy check, dead code cleanup, and voice consistency results
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Get latest report file
 */
function getLatestReport(pattern) {
  const reportDir = path.join(process.cwd(), 'cleanup-reports');
  if (!fs.existsSync(reportDir)) {
    return null;
  }

  const files = fs
    .readdirSync(reportDir)
    .filter(f => f.match(pattern))
    .map(f => ({
      name: f,
      path: path.join(reportDir, f),
      time: fs.statSync(path.join(reportDir, f)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  return files.length > 0 ? files[0] : null;
}

/**
 * Read JSON report
 */
function readReport(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Generate summary report
 */
function generateSummary() {
  const summary = {
    timestamp: new Date().toISOString(),
    preDeploy: {
      status: 'unknown',
      details: {},
    },
    deadCode: {
      removed: 0,
      files: [],
    },
    voiceConsistency: {
      violations: 0,
      byType: {},
      bySeverity: {},
      files: [],
      autoFixed: 0,
    },
    manualReview: [],
  };

  // Get voice consistency report
  const voiceReport = getLatestReport(/^voice-consistency-.*\.json$/);
  if (voiceReport) {
    const report = readReport(voiceReport.path);
    if (report) {
      summary.voiceConsistency = {
        violations: report.total,
        byType: report.byType,
        bySeverity: report.bySeverity,
        files: Object.keys(report.files),
        autoFixed: 0, // Will be updated after fixes
      };
    }
  }

  // Try to get dead code info from cleanup check
  try {
    const cleanupOutput = execSync('npm run cleanup:check 2>&1', { encoding: 'utf8' });
    const deadCodeMatch = cleanupOutput.match(/dead-code:.*?(\d+).*?unused export/i);
    if (deadCodeMatch) {
      summary.deadCode.removed = parseInt(deadCodeMatch[1]) || 0;
    }
  } catch (error) {
    // Ignore errors
  }

  // Generate markdown report
  const markdown = `# Pre-Deployment Check Summary

Generated: ${new Date().toLocaleString()}

## Pre-Deployment Check

Status: ${summary.preDeploy.status}

## Dead Code Cleanup

- Unused exports removed: ${summary.deadCode.removed}
- Files affected: ${summary.deadCode.files.length}

## Voice Consistency Audit

### Summary
- Total violations found: ${summary.voiceConsistency.violations}
- Auto-fixed: ${summary.voiceConsistency.autoFixed}
- Manual review needed: ${summary.voiceConsistency.violations - summary.voiceConsistency.autoFixed}

### By Severity
${Object.entries(summary.voiceConsistency.bySeverity)
  .map(([severity, count]) => `- ${severity}: ${count}`)
  .join('\n')}

### By Type
${Object.entries(summary.voiceConsistency.byType)
  .map(([type, count]) => `- ${type}: ${count}`)
  .join('\n')}

### Files with Violations
${summary.voiceConsistency.files
  .slice(0, 20)
  .map(f => `- ${f}`)
  .join('\n')}
${summary.voiceConsistency.files.length > 20 ? `\n... and ${summary.voiceConsistency.files.length - 20} more files` : ''}

## Manual Review Needed

${summary.manualReview.length > 0 ? summary.manualReview.map(item => `- ${item}`).join('\n') : 'None'}

## Next Steps

1. Review voice consistency violations
2. Apply manual fixes for complex voice issues
3. Run \`npm run cleanup:fix\` to auto-fix simple cases
4. Run \`npm run check:voice\` to verify fixes
`;

  // Save report
  const reportDir = path.join(process.cwd(), 'cleanup-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `pre-deploy-summary-${timestamp}.md`);
  fs.writeFileSync(reportPath, markdown);

  // Also save JSON
  const jsonPath = path.join(reportDir, `pre-deploy-summary-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

  console.log(markdown);
  console.log(`\n📄 Reports saved:`);
  console.log(`   ${reportPath}`);
  console.log(`   ${jsonPath}`);

  return summary;
}

// Main execution
if (require.main === module) {
  generateSummary();
}

module.exports = { generateSummary };
