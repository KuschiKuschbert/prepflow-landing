#!/usr/bin/env node

/**
 * Security Check Module
 * Validates security patterns (input validation, rate limiting)
 * Source: security.mdc (Security Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findAPIFiles() {
  const files = [];
  const apiDir = 'app/api';

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (/route\.(ts|js)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  if (fs.existsSync(apiDir)) {
    walkDir(apiDir);
  }
  return files;
}

function checkSecurityPatterns(content, filePath) {
  const violations = [];

  // Check for API routes without input validation (simplified check)
  if (filePath.includes('/api/') && filePath.includes('route.')) {
    // Check if file uses Zod for validation
    const hasZod = content.includes('z.object') || content.includes('z.string');
    const hasRequestParsing = content.includes('req.json') || content.includes('req.body');

    if (hasRequestParsing && !hasZod) {
      violations.push({
        type: 'missing-validation',
      });
    }
  }

  return violations;
}

/**
 * Check security patterns
 */
async function checkSecurity(files = null) {
  const filesToCheck = files || findAPIFiles();
  const violations = [];
  const standardConfig = getStandardConfig('security');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = checkSecurityPatterns(content, file);

    for (const violation of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          message: 'API route may be missing input validation (Zod schema)',
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (Security Standards) and security.mdc (Input Validation)',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ Security patterns check passed'
        : `⚠️ ${violations.length} potential security issue(s) found`,
  };
}

module.exports = {
  name: 'security',
  check: checkSecurity,
};

