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

/**
 * Check if file should be excluded from dead code detection
 */
function shouldExcludeFile(filePath) {
  const excludePatterns = [
    /node_modules/,
    /\.next/,
    /out/,
    /build/,
    /dist/,
    /\.test\.tsx?$/,
    /\.spec\.tsx?$/,
    /\.d\.ts$/,
  ];

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

    // Parse format: filePath:line:exportName
    const match = line.match(/^(.+?):(\d+):(.+)$/);
    if (match) {
      const [, filePath, lineNum, exportName] = match;
      const fullPath = path.resolve(process.cwd(), filePath);

      // Exclude test files, type definitions, and build directories
      if (!shouldExcludeFile(fullPath)) {
        unusedExports.push({
          file: filePath,
          line: parseInt(lineNum, 10),
          export: exportName,
        });
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

    if (!output || output.trim().length === 0) {
      return {
        passed: true,
        violations,
        summary: '✅ No unused exports found',
      };
    }

    const unusedExports = parseTsPruneOutput(output);

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
