#!/usr/bin/env node

/**
 * API Patterns Check Module
 * Validates API response formats, error handling, status codes, and input validation
 * Source: implementation.mdc (API Response Standards)
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

function analyzeAPIPatterns(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);
  const isAPIRoute = filePath.includes('/api/') && filePath.includes('route.');

  if (!isAPIRoute) return violations;

  // Skip test/debug endpoints - they return test results, not error responses
  const isTestEndpoint = /\/test\/|\/debug\//.test(filePath);
  if (isTestEndpoint) return violations; // Test endpoints have different response patterns

  // Skip health endpoint - uses custom { status, timestamp, checks } format for LB compatibility
  const isHealthEndpoint = /\/api\/health\/route\.(ts|js)$/.test(filePath);
  if (isHealthEndpoint) return violations;

  // Check for exported HTTP method handlers
  const hasGET = /export\s+(async\s+)?function\s+GET/.test(content);
  const hasPOST = /export\s+(async\s+)?function\s+POST/.test(content);
  const hasPUT = /export\s+(async\s+)?function\s+PUT/.test(content);
  const hasPATCH = /export\s+(async\s+)?function\s+PATCH/.test(content);
  const hasDELETE = /export\s+(async\s+)?function\s+DELETE/.test(content);

  const hasMutationMethod = hasPOST || hasPUT || hasPATCH || hasDELETE;
  const hasAnyMethod = hasGET || hasMutationMethod;

  if (!hasAnyMethod) return violations; // Skip if no HTTP handlers

  // 1. Check for ApiErrorHandler import
  const hasApiErrorHandlerImport = /import.*ApiErrorHandler.*from/.test(content);
  const hasApiErrorHandlerUsage = /ApiErrorHandler\.createError/.test(content);

  // 2. Check for logger import and usage
  const hasLoggerImport = /import.*logger.*from.*['"]@\/lib\/logger['"]/.test(content);
  const hasLoggerErrorUsage = /logger\.error\(/.test(content);
  const hasConsoleError = /console\.error\(/.test(content);

  // 3. Check for try-catch blocks in async handlers
  const hasTryCatch = /try\s*\{/.test(content) && /catch\s*\(/.test(content);

  // 4. Check for proper success response format
  const hasSuccessFormat = /success:\s*true/.test(content) || /success:\s*true,/.test(content);

  // 5. Check for input validation (Zod) for mutation methods
  // Accept any import from zod (z, ZodSchema, etc.) or z.object/z.string in file
  const hasZodImport = /import\s+.*from\s+['"]zod['"]/.test(content);
  const hasZodSchema = /z\.object\(/.test(content) || /z\.string\(/.test(content);
  const hasRequestParsing =
    /req\.json\(\)/.test(content) ||
    /request\.json\(\)/.test(content) ||
    /await.*json\(\)/.test(content);

  // 6. Check for proper status codes in error responses
  const hasStatus400 = /status:\s*400/.test(content);
  const hasStatus401 = /status:\s*401/.test(content);
  const hasStatus403 = /status:\s*403/.test(content);
  const hasStatus404 = /status:\s*404/.test(content);
  const hasStatus500 = /status:\s*500/.test(content);

  // Check for error responses without ApiErrorHandler
  const hasErrorResponse = /NextResponse\.json\(/.test(content);

  // Check if response in catch block is a success response (graceful degradation)
  // Success responses have: success: true, isAdmin: false, or status: 200
  // Check for success patterns in catch blocks (multiline)
  const hasSuccessInCatch =
    /catch\s*\([^)]*\)\s*\{[\s\S]*?NextResponse\.json\([\s\S]*?success:\s*true/.test(content) ||
    /catch\s*\([^)]*\)\s*\{[\s\S]*?NextResponse\.json\([\s\S]*?isAdmin:\s*false/.test(content) ||
    /catch\s*\([^)]*\)\s*\{[\s\S]*?status:\s*200/.test(content) ||
    /catch\s*\([^)]*\)\s*\{[\s\S]*?NextResponse\.json\([^,}]*\{[^}]*isAdmin:\s*false/.test(content);

  const hasErrorWithoutHandler =
    hasErrorResponse &&
    !hasApiErrorHandlerUsage &&
    /error|Error/.test(content) &&
    !hasSuccessInCatch; // Exclude success responses in catch blocks

  // Violation checks
  if (hasAnyMethod) {
    // Check for ApiErrorHandler usage for errors
    if (hasErrorResponse && !hasApiErrorHandlerImport && !hasSuccessInCatch) {
      violations.push({
        type: 'missing-api-error-handler-import',
        line: findLineNumber(lines, /import/),
      });
    }

    if (hasErrorWithoutHandler) {
      violations.push({
        type: 'error-response-without-handler',
        line: findLineNumber(lines, /NextResponse\.json\(/),
      });
    }

    // Check for logger usage
    if (!hasLoggerImport && (hasErrorResponse || hasTryCatch)) {
      violations.push({
        type: 'missing-logger-import',
        line: findLineNumber(lines, /import/),
      });
    }

    if (hasConsoleError) {
      violations.push({
        type: 'console-error-usage',
        line: findLineNumber(lines, /console\.error/),
      });
    }

    if ((hasErrorResponse || hasTryCatch) && !hasLoggerErrorUsage && !hasConsoleError) {
      // Only warn if there are error responses but no logging at all
      if (hasErrorResponse && !hasLoggerErrorUsage) {
        violations.push({
          type: 'missing-error-logging',
          line: findLineNumber(lines, /catch/),
        });
      }
    }

    // Check for try-catch blocks
    if (!hasTryCatch && (hasGET || hasMutationMethod)) {
      violations.push({
        type: 'missing-try-catch',
        line: findLineNumber(lines, /export.*function.*(GET|POST|PUT|PATCH|DELETE)/),
      });
    }

    // Check for proper success response format (should have success: true)
    if (hasGET && hasSuccessFormat === false && hasErrorResponse === false) {
      // GET routes should return success format or at least have proper structure
      // This is a warning, not critical
    }

    // Check for input validation on mutation methods
    if (hasMutationMethod && hasRequestParsing) {
      if (!hasZodImport && !hasZodSchema) {
        violations.push({
          type: 'missing-input-validation',
          line: findLineNumber(lines, /export.*function.*(POST|PUT|PATCH)/),
        });
      }
    }
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
 * Check API patterns
 */
async function checkAPIPatterns(files = null) {
  const filesToCheck = files || findAPIFiles();
  const violations = [];
  const standardConfig = getStandardConfig('api-patterns');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = analyzeAPIPatterns(content, file);

    for (const violation of found) {
      let message;
      let reference =
        'See cleanup.mdc (API Standards) and implementation.mdc (API Response Standards)';

      switch (violation.type) {
        case 'missing-api-error-handler-import':
          message = 'API route should import ApiErrorHandler for error responses';
          break;
        case 'error-response-without-handler':
          message = 'Error responses should use ApiErrorHandler.createError()';
          break;
        case 'missing-logger-import':
          message = 'API route should import logger for error logging';
          break;
        case 'console-error-usage':
          message = 'Use logger.error() instead of console.error()';
          reference = 'See cleanup.mdc (Console.log Migration)';
          break;
        case 'missing-error-logging':
          message = 'Error responses should log errors with logger.error()';
          break;
        case 'missing-try-catch':
          message = 'Async API handlers should have try-catch blocks';
          break;
        case 'missing-input-validation':
          message = 'POST/PUT/PATCH routes should use Zod schemas for input validation';
          reference = 'See security.mdc (Input Validation)';
          break;
        default:
          message = 'API pattern violation detected';
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
        ? '✅ All API patterns check passed'
        : `❌ ${violations.length} API pattern violation(s) found`,
  };
}

module.exports = {
  name: 'api-patterns',
  check: checkAPIPatterns,
};
