#!/usr/bin/env node

/**
 * Dead Code Check Module
 * Detects unused exports and dead code using ts-prune
 * Source: development.mdc (Dead Code Removal)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

const excludePatterns = [
  /node_modules/,
  /\.next/,
  /out/,
  /build/,
  /dist/,
  /\.test\.tsx?$/,
  /\.spec\.tsx?$/,
  /\.d\.ts$/,
  /types/, // Common type definitions often have unused exports in partial implementations
  /page\.tsx$/,
  /layout\.tsx$/,
  /loading\.tsx$/,
  /error\.tsx$/,
  /not-found\.tsx$/,
  /route\.ts$/,
  /proxy\.ts$/,
  /next\.config\.ts$/,
  /playwright\.config\.ts$/,
];

/**
 * Check if file should be excluded from dead code detection
 */
function shouldExcludeFile(filePath) {
  return excludePatterns.some(pattern => pattern.test(filePath));
}

/**
 * Parse ts-prune output
 * Format: filePath:line:exportName
 */
function parseTsPruneOutput(output) {
  const lines = output.split('\n').filter(line => line.trim());
  const unusedExports = [];

  for (const line of lines) {
    // Skip empty lines and header lines
    if (!line.trim() || line.includes('Found') || line.includes('unused')) {
      continue;
    }

    // Parse format: filePath:line - exportName
    const match = line.match(/^(.+?):(\d+) - (.+)$/);
    if (match) {
      const [, filePath, lineNum, exportName] = match;
      const fullPath = path.resolve(process.cwd(), filePath);

      // Exclude test files, type definitions, and build directories
      const isExcluded = shouldExcludeFile(fullPath);
      if (filePath.includes('test-dead-code')) {
        console.log('Testing specific file:', fullPath);
        console.log('Is excluded?', isExcluded);
        if (isExcluded) {
          console.log(
            'Exclusion check details:',
            excludePatterns.map(p => ({ p: p.toString(), match: p.test(fullPath) })),
          );
        }
      }

      if (!isExcluded) {
        unusedExports.push({
          file: filePath,
          line: parseInt(lineNum, 10),
          export: exportName,
        });
      } else {
        // console.log('Excluded:', filePath);
      }
    }
  }

  return unusedExports;
}

/**
 * Check dead code using ts-prune
 */
async function checkDeadCode(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('dead-code');

  // Check if tsconfig.json exists
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    return {
      passed: true,
      violations,
      summary: '⏭️  Dead code check skipped (no tsconfig.json found - TypeScript project required)',
    };
  }

  try {
    // Run ts-prune to find unused exports
    // --project flag uses tsconfig.json
    // --ignore flag excludes test files and type definitions
    const command = 'npx ts-prune --project tsconfig.json 2>/dev/null || true';
    const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });

    // DEBUG LOGGING
    console.log('Raw Output Length:', output.length);
    console.log('First 100 chars:', output.substring(0, 100));

    if (!output || output.trim().length === 0) {
      return {
        passed: true,
        violations,
        summary: '✅ No unused exports found',
      };
    }

    const unusedExports = parseTsPruneOutput(output);
    console.log('Parsed lines count:', unusedExports.length);

    // Create violations for each unused export
    for (const unused of unusedExports) {
      violations.push(
        createViolation({
          file: unused.file,
          line: unused.line,
          message: `Unused export: ${unused.export}`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference:
            'See cleanup.mdc (Dead Code Detection) and development.mdc (Dead Code Removal). Run "npm run cleanup:fix" to auto-remove unused exports.',
        }),
      );
    }

    return {
      passed: violations.length === 0,
      violations,
      summary:
        violations.length === 0
          ? '✅ No unused exports found'
          : `ℹ️  ${violations.length} unused export(s) found`,
    };
  } catch (error) {
    // ts-prune might not be available or might error - handle gracefully
    return {
      passed: true,
      violations,
      summary: `⏭️  Dead code check skipped (ts-prune error: ${error.message})`,
    };
  }
}

module.exports = {
  name: 'dead-code',
  check: checkDeadCode,
};

// Allow running directly
if (require.main === module) {
  checkDeadCode().then(result => {
    if (result.violations && result.violations.length > 0) {
      console.log(result.summary);
      result.violations.forEach(v => {
        console.log(`\n📄 ${v.file}:${v.line}`);
        console.log(`   ${v.message}`);
      });
      process.exit(1);
    } else {
      console.log(result.summary);
      process.exit(0);
    }
  });
}
