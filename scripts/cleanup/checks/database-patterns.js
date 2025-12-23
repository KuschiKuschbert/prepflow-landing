#!/usr/bin/env node

/**
 * Database Patterns Check Module
 * Validates Supabase query patterns and error handling
 * Source: core.mdc (Supabase TypeScript Gotcha), implementation.mdc (Database Schema Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findDatabaseFiles() {
  const files = [];
  const searchDirs = ['app/api', 'lib'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeDatabasePatterns(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  // Check for Supabase usage
  const hasSupabase = /supabase/.test(content) || /from\(['"]/.test(content);
  if (!hasSupabase) return violations;

  // Check for .catch() chaining on Supabase queries (MANDATORY - should not use)
  const hasCatchChaining = /\.from\([^)]*\)[^}]*\.catch\(/.test(content) ||
    /supabase[^}]*\.catch\(/.test(content) ||
    /\.select\([^)]*\)[^}]*\.catch\(/.test(content) ||
    /\.insert\([^)]*\)[^}]*\.catch\(/.test(content) ||
    /\.update\([^)]*\)[^}]*\.catch\(/.test(content) ||
    /\.delete\([^)]*\)[^}]*\.catch\(/.test(content);

  // Check for proper error handling pattern
  const hasProperErrorHandling = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await/.test(content);

  // Check for ignored errors
  const hasIgnoredError = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await/.test(content) &&
    !/if\s*\(error\)/.test(content) &&
    !/error\s*&&/.test(content);

  // Check for string concatenation in queries (SQL injection risk)
  const hasStringConcat = /\+.*['"]/.test(content) && /\.from\(|\.select\(|\.insert\(|\.update\(|\.delete\(/.test(content);
  const hasTemplateLiteralInQuery = /`[^`]*\$\{[^}]+\}[^`]*`/.test(content) && /\.from\(|\.select\(|\.insert\(|\.update\(|\.delete\(/.test(content);

  // Check for proper use of Supabase methods
  const hasSelect = /\.select\(/.test(content);
  const hasInsert = /\.insert\(/.test(content);
  const hasUpdate = /\.update\(/.test(content);
  const hasDelete = /\.delete\(/.test(content);
  const hasProperMethods = hasSelect || hasInsert || hasUpdate || hasDelete;

  // Check for ApiErrorHandler usage for database errors
  const hasApiErrorHandler = /ApiErrorHandler/.test(content);
  const hasDatabaseError = /error/.test(content) && hasSupabase;

  // Check for logger usage
  const hasLogger = /logger\.error\(/.test(content);
  const hasConsoleError = /console\.error\(/.test(content);

  // Check for proper error handling with ApiErrorHandler
  const hasErrorHandling = /if\s*\(error\)/.test(content) || /error\s*&&/.test(content);
  const hasErrorHandlerUsage = hasErrorHandling && hasApiErrorHandler;

  // Violation checks
  if (hasCatchChaining) {
    violations.push({
      type: 'catch-chaining',
      line: findLineNumber(lines, /\.catch\(/),
    });
  }

  if (hasSupabase && !hasProperErrorHandling && hasProperMethods) {
    violations.push({
      type: 'missing-error-handling',
      line: findLineNumber(lines, /\.from\(|\.select\(|\.insert\(|\.update\(|\.delete\(/),
    });
  }

  if (hasIgnoredError) {
    violations.push({
      type: 'ignored-error',
      line: findLineNumber(lines, /const.*error.*await/),
    });
  }

  if (hasStringConcat && !hasTemplateLiteralInQuery) {
    violations.push({
      type: 'string-concatenation',
      line: findLineNumber(lines, /\+.*['"]/),
    });
  }

  if (hasDatabaseError && !hasErrorHandlerUsage && hasErrorHandling) {
    violations.push({
      type: 'missing-api-error-handler',
      line: findLineNumber(lines, /if.*error/),
    });
  }

  if (hasDatabaseError && !hasLogger && !hasConsoleError) {
    violations.push({
      type: 'missing-error-logging',
      line: findLineNumber(lines, /if.*error/),
    });
  }

  if (hasConsoleError) {
    violations.push({
      type: 'console-error-usage',
      line: findLineNumber(lines, /console\.error/),
    });
  }

  return violations;
}

function findLineNumber(lines, pattern) {
  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      return i + 1;
    }
  }
  return undefined;
}

/**
 * Check database patterns
 */
async function checkDatabasePatterns(files = null) {
  const filesToCheck = files || findDatabaseFiles();
  const violations = [];
  const standardConfig = getStandardConfig('database-patterns');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = analyzeDatabasePatterns(content, file);

    for (const violation of found) {
      let message;
      let reference = 'See cleanup.mdc (Database Standards) and core.mdc (Supabase TypeScript Gotcha)';

      switch (violation.type) {
        case 'catch-chaining':
          message = 'Supabase query builders should not use .catch() - use const { data, error } = await pattern instead';
          break;
        case 'missing-error-handling':
          message = 'Supabase queries should use const { data, error } = await pattern with explicit error handling';
          break;
        case 'ignored-error':
          message = 'Supabase query errors should be checked and handled explicitly';
          break;
        case 'string-concatenation':
          message = 'Database queries should use parameterized queries, not string concatenation (SQL injection risk)';
          reference = 'See security.mdc (SQL Injection Prevention)';
          break;
        case 'missing-api-error-handler':
          message = 'Database errors should be handled with ApiErrorHandler';
          break;
        case 'missing-error-logging':
          message = 'Database errors should be logged with logger.error()';
          break;
        case 'console-error-usage':
          message = 'Use logger.error() instead of console.error() for database errors';
          break;
        default:
          message = 'Database pattern violation detected';
      }

      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference,
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All database patterns check passed'
        : `❌ ${violations.length} database pattern violation(s) found`,
  };
}

module.exports = {
  name: 'database-patterns',
  check: checkDatabasePatterns,
};
