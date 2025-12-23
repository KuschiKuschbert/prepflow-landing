#!/usr/bin/env node

/**
 * Analyze Error Handling Violations
 * Provides detailed breakdown of error handling violations
 */

const fs = require('fs');
const path = require('path');

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
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const isAPIRoute = filePath.includes('/api/') && filePath.includes('route.');
  const isComponent = /\.(tsx|jsx)$/.test(filePath);

  const violations = [];

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

    if (hasErrorResponse && !hasApiErrorHandlerImport && (hasErrorStatus || hasErrorField) && !isTestEndpoint) {
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
  const hasLoggerErrorUsage = /logger\.error\(/.test(content);
  const hasConsoleError = /console\.error\(/.test(content);

  // Check for try-catch blocks
  if (hasAsyncOperation && !hasTryCatch) {
    violations.push({
      type: 'missing-try-catch',
      line: findLineNumber(lines, /async|await/),
    });
  }

  // Check for error handling in catch blocks
  if (hasTryCatch) {
    const catchBlocks = extractCatchBlocks(content);
    for (const catchBlock of catchBlocks) {
      const hasLogging = /logger\.(error|warn|dev)\(/.test(catchBlock);
      const hasThrow = /throw/.test(catchBlock);
      const hasReturn = /return/.test(catchBlock);
      const hasConsoleErrorInCatch = /console\.error\(/.test(catchBlock);

      if (!hasLogging && !hasThrow && !hasReturn) {
        violations.push({
          type: 'silent-error-handling',
          line: findLineNumber(lines, /catch\s*\(/),
        });
      }

      if (hasConsoleErrorInCatch) {
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
    const isSharedComponent = filePath.includes('components/ui/') ||
                               filePath.includes('components/landing/') ||
                               filePath.startsWith('components/');

    // Skip admin and webapp pages - they're wrapped in ErrorBoundary via layout
    // Skip webapp/admin components - they're used within protected pages
    // Only flag shared components that might be used outside protected contexts
    if (hasCriticalOperation && !hasErrorBoundary && !isAdminPage && !isWebappPage &&
        !isWebappComponent && !isAdminComponent && isSharedComponent) {
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
    const hasCreateErrorCall = /ApiErrorHandler\.createError\(/s.test(content);
    const hasErrorCode = /ApiErrorHandler\.createError\([\s\S]*?,\s*['"][A-Z_]+['"]/s.test(content);
    const improperFormat = hasCreateErrorCall && !hasErrorCode;
    if (improperFormat) {
      violations.push({
        type: 'improper-error-format',
        line: findLineNumber(lines, /ApiErrorHandler\.createError/),
      });
    }
  }

  return violations.length > 0 ? { file: filePath, violations } : null;
}

function extractCatchBlocks(content) {
  const catchBlocks = [];
  const catchRegex = /catch\s*\([^)]*\)\s*\{([^}]*)\}/g;
  let match;
  while ((match = catchRegex.exec(content)) !== null) {
    catchBlocks.push(match[1]);
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

// Main analysis
const apiFiles = findAPIFiles();
const componentFiles = findComponentFiles();
const allFiles = [...apiFiles, ...componentFiles];

const results = [];
const violationCounts = {};

for (const file of allFiles) {
  const result = analyzeFile(file);
  if (result) {
    results.push(result);
    for (const violation of result.violations) {
      violationCounts[violation.type] = (violationCounts[violation.type] || 0) + 1;
    }
  }
}

console.log('\n📊 Error Handling Violations Summary:\n');
console.log('Violation Types:');
for (const [type, count] of Object.entries(violationCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${type}: ${count}`);
}

console.log(`\nTotal Files with Violations: ${results.length}`);
console.log(`Total Violations: ${Object.values(violationCounts).reduce((a, b) => a + b, 0)}\n`);

if (results.length > 0) {
  console.log('\nTop 20 Files with Violations:\n');
  results
    .sort((a, b) => b.violations.length - a.violations.length)
    .slice(0, 20)
    .forEach(result => {
      console.log(`${result.file}:`);
      const typeCounts = {};
      result.violations.forEach(v => {
        typeCounts[v.type] = (typeCounts[v.type] || 0) + 1;
      });
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
      console.log('');
    });

  // List files with specific critical violations
  const missingTryCatchFiles = results.filter(r => r.violations.some(v => v.type === 'missing-try-catch')).map(r => r.file);
  const silentErrorFiles = results.filter(r => r.violations.some(v => v.type === 'silent-error-handling')).map(r => r.file);

  if (missingTryCatchFiles.length > 0) {
    console.log('\n🔴 Files with missing-try-catch violations:');
    missingTryCatchFiles.forEach(f => console.log(`  ${f}`));
  }

  if (silentErrorFiles.length > 0) {
    console.log('\n🔴 Files with silent-error-handling violations:');
    silentErrorFiles.forEach(f => console.log(`  ${f}`));
  }

  const missingLoggerImportFiles = results.filter(r => r.violations.some(v => v.type === 'missing-logger-import')).map(r => r.file);
  if (missingLoggerImportFiles.length > 0) {
    console.log('\n🔴 Files with missing-logger-import violations:');
    missingLoggerImportFiles.forEach(f => console.log(`  ${f}`));
  }
}
