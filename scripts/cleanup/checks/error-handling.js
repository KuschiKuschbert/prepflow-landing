#!/usr/bin/env node

/**
 * Error Handling Check Module
 * Enforces ApiErrorHandler usage and error handling standards
 * Source: ERROR_HANDLING_STANDARDS.md, implementation.mdc (Error Handling Standards)
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

function findComponentFiles() {
  const files = [];
  const searchDirs = ['app', 'components'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== '.next'
        ) {
          walkDir(fullPath);
        }
      } else if (/\.(tsx|jsx)$/.test(entry.name)) {
        // Exclude cleanup scripts - they're utility scripts, not application code
        if (!fullPath.includes('scripts/cleanup/')) {
          files.push(fullPath);
        }
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeErrorHandling(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);
  const isAPIRoute = filePath.includes('/api/') && filePath.includes('route.');
  const isComponent = /\.(tsx|jsx)$/.test(filePath);

  // Check for async operations
  const hasAsync = /async\s+function|async\s+\(/.test(content);
  const hasAwait = /await\s+/.test(content);
  const hasTryCatch = /try\s*\{/.test(content) && /catch\s*\(/.test(content);
  const hasAsyncOperation = hasAsync && hasAwait;

  // Check for ApiErrorHandler usage (API routes)
  const hasApiErrorHandlerImport = /import.*ApiErrorHandler.*from/.test(content);
  // Recognize all valid ApiErrorHandler methods
  const hasApiErrorHandlerUsage =
    /ApiErrorHandler\.(createError|fromException|fromSupabaseError)/.test(content);
  const hasErrorResponse = /NextResponse\.json\(/.test(content);

  if (isAPIRoute) {
    // Exclude test/debug endpoints - they intentionally return test results, not error responses
    const isTestEndpoint = /\/test\/|\/debug\//.test(filePath);

    // Check for error responses: status codes >= 400 or responses with error fields
    const hasErrorStatus = /status:\s*(4\d{2}|5\d{2})/.test(content);
    // Match error fields in JSON objects (error: or "error":), not variable names
    const hasErrorField = /NextResponse\.json\([^)]*\{[^}]*['"]?error['"]?\s*:/.test(content);
    const hasErrorWithoutHandler =
      (hasErrorStatus || hasErrorField) && !hasApiErrorHandlerUsage && !isTestEndpoint;

    if (
      hasErrorResponse &&
      !hasApiErrorHandlerImport &&
      (hasErrorStatus || hasErrorField) &&
      !isTestEndpoint
    ) {
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
  }

  // Check for logger usage
  const hasLoggerImport = /import.*logger.*from.*['"]@\/lib\/logger['"]/.test(content);

  // Check for try-catch blocks
  if (hasAsyncOperation && !hasTryCatch) {
    violations.push({
      type: 'missing-try-catch',
      line: findLineNumber(lines, /async|await/),
    });
  }

  // Check for error handling in catch blocks
  if (hasTryCatch) {
    // Extract all catch blocks (handle multiple catch blocks in a file)
    const catchBlocks = extractAllCatchBlocks(content);

    for (const catchBlock of catchBlocks) {
      if (!catchBlock) continue;

      // Check if THIS catch block has logging, throw, or return
      const hasLoggingInCatch = /logger\.(error|warn|dev)\(/.test(catchBlock);
      const hasConsoleErrorInCatch = /console\.(error|warn|log)\(/.test(catchBlock);
      const hasThrowInCatch = /throw/.test(catchBlock);
      const hasReturnInCatch = /return/.test(catchBlock);
      const hasErrorHandling =
        hasLoggingInCatch || hasConsoleErrorInCatch || hasThrowInCatch || hasReturnInCatch;

      // Skip empty catch blocks or those with only comments
      const trimmedCatch = catchBlock.trim();
      const isEmpty = trimmedCatch.length === 0 || /^\/\/.*$/.test(trimmedCatch);

      if (!hasErrorHandling && !isEmpty) {
        violations.push({
          type: 'silent-error-handling',
          line: findLineNumber(lines, /catch\s*\(/),
        });
      }

      // Skip console.error/console.warn in script tags with documented exception (see ERROR_HANDLING_STANDARDS.md)
      // Check if this catch block is in a script tag with the exception comment
      const isInScriptTag = /dangerouslySetInnerHTML/.test(content);
      const hasExceptionComment =
        /logger is not available in script tag/.test(content) || /before React loads/.test(content);

      if (hasConsoleErrorInCatch && !(isInScriptTag && hasExceptionComment)) {
        violations.push({
          type: 'console-error-in-catch',
          line: findLineNumber(lines, /console\.error/),
        });
      }
    }

    if (hasAsyncOperation && !hasLoggerImport) {
      violations.push({
        type: 'missing-logger-import',
        line: findLineNumber(lines, /import/),
      });
    }
  }

  // Check for ErrorBoundary usage in components
  if (isComponent && hasAsyncOperation) {
    const hasErrorBoundary = /ErrorBoundary/.test(content) || /<ErrorBoundary/.test(content);
    const hasCriticalOperation = /fetch\(|supabase/.test(content);
    // Admin pages are wrapped in ErrorBoundary via app/admin/layout.tsx
    // Webapp pages are wrapped in ErrorBoundary via app/webapp/layout.tsx
    const isAdminPage = filePath.includes('app/admin/') && filePath.endsWith('page.tsx');
    const isWebappPage = filePath.includes('app/webapp/') && filePath.endsWith('page.tsx');

    // Components used within webapp/admin pages are already protected by layout ErrorBoundary
    // Only flag components in shared locations that might be used elsewhere
    const isWebappComponent = filePath.includes('app/webapp/components/');
    const isAdminComponent = filePath.includes('app/admin/components/');
    const isSharedComponent =
      filePath.includes('components/ui/') ||
      filePath.includes('components/landing/') ||
      filePath.startsWith('components/');

    // This is a warning, not critical
    // Skip admin and webapp pages - they're wrapped in ErrorBoundary via layout
    // Skip webapp/admin components - they're used within protected pages
    // Only flag shared components that might be used outside protected contexts
    if (
      hasCriticalOperation &&
      !hasErrorBoundary &&
      !isAdminPage &&
      !isWebappPage &&
      !isWebappComponent &&
      !isAdminComponent &&
      isSharedComponent
    ) {
      violations.push({
        type: 'missing-error-boundary',
        line: findLineNumber(lines, /export|function|const/),
        severity: 'warning',
      });
    }
  }

  // Check for proper error response format
  // Only check createError calls (fromException and fromSupabaseError handle codes automatically)
  if (isAPIRoute && /ApiErrorHandler\.createError/.test(content)) {
    // Use multiline flag to match across lines, and check for error code pattern
    const hasProperFormat = /ApiErrorHandler\.createError\([\s\S]*?,\s*['"][A-Z_]+['"]/s.test(
      content,
    );
    if (!hasProperFormat) {
      violations.push({
        type: 'improper-error-format',
        line: findLineNumber(lines, /ApiErrorHandler\.createError/),
      });
    }
  }

  return violations;
}

function extractAllCatchBlocks(content) {
  const catchBlocks = [];
  const catchRegex = /catch\s*\([^)]*\)\s*\{/g;
  let match;

  while ((match = catchRegex.exec(content)) !== null) {
    const catchStart = match.index + match[0].length;
    let braceCount = 1;
    let pos = catchStart;
    let catchContent = '';

    while (pos < content.length && braceCount > 0) {
      const char = content[pos];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount > 0) {
        catchContent += char;
      }
      pos++;
    }

    catchBlocks.push(catchContent);
  }

  return catchBlocks;
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
 * Check error handling patterns
 */
async function checkErrorHandling(files = null) {
  const apiFiles = findAPIFiles();
  const componentFiles = findComponentFiles();
  const filesToCheck = files || [...apiFiles, ...componentFiles];
  const violations = [];
  const standardConfig = getStandardConfig('error-handling');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    // Exclude script files (utility scripts, not application code)
    const normalizedPath = file.replace(/\\/g, '/');
    if (
      normalizedPath.includes('scripts/recipe-scraper/') ||
      normalizedPath.includes('scripts/cleanup/')
    ) {
      continue;
    }
    const content = fs.readFileSync(file, 'utf8');
    const found = analyzeErrorHandling(content, file);

    for (const violation of found) {
      let message;
      let reference = 'See cleanup.mdc (Error Handling Standards) and ERROR_HANDLING_STANDARDS.md';

      switch (violation.type) {
        case 'missing-api-error-handler-import':
          message = 'API route should import ApiErrorHandler for error responses';
          break;
        case 'error-response-without-handler':
          message = 'Error responses should use ApiErrorHandler.createError()';
          break;
        case 'missing-logger-import':
          message = 'File with async operations should import logger for error logging';
          break;
        case 'console-error-in-catch':
          message = 'Use logger.error() instead of console.error() in catch blocks';
          break;
        case 'missing-try-catch':
          message = 'Async operations should have try-catch blocks';
          break;
        case 'silent-error-handling':
          message = 'Errors in catch blocks should be logged or re-thrown, not silently ignored';
          break;
        case 'missing-error-boundary':
          message = 'Components with critical async operations should be wrapped in ErrorBoundary';
          break;
        case 'improper-error-format':
          message = 'ApiErrorHandler.createError() should include error code as second parameter';
          break;
        default:
          message = 'Error handling pattern violation detected';
      }

      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message,
          severity: violation.severity || standardConfig.severity,
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
        ? '✅ All error handling patterns check passed'
        : `❌ ${violations.length} error handling pattern violation(s) found`,
  };
}

module.exports = {
  name: 'error-handling',
  check: checkErrorHandling,
};
