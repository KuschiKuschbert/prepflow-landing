#!/usr/bin/env node

/**
 * Fix Error Responses Comprehensive
 * Handles various patterns of hardcoded error responses
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

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Skip if file doesn't have ApiErrorHandler import
  if (!content.includes('ApiErrorHandler')) {
    return false;
  }

  // Skip if file already uses ApiErrorHandler.createError everywhere
  if (!content.includes('NextResponse.json') || content.match(/NextResponse\.json\([^)]*error[^)]*\)/g)?.every(m => m.includes('ApiErrorHandler'))) {
    return false;
  }

  // Pattern: Multi-line error with message field
  const pattern1 = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*,\s*message:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/gs;
  content = content.replace(pattern1, (match, error, message, status) => {
    changed = true;
    const errorCode = getErrorCode(message || error, status);
    return `NextResponse.json(ApiErrorHandler.createError('${message || error}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern: Simple error object
  const pattern2 = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/gs;
  content = content.replace(pattern2, (match, errorMsg, status) => {
    // Skip if already replaced by pattern1
    if (match.includes('ApiErrorHandler')) return match;
    changed = true;
    const errorCode = getErrorCode(errorMsg, status);
    return `NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern: success: false with error
  const pattern3 = /NextResponse\.json\(\s*\{\s*success:\s*false\s*,\s*error:\s*['"]([^'"]+)['"]\s*(?:,\s*message:\s*['"]([^'"]+)['"])?\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/gs;
  content = content.replace(pattern3, (match, error, message, status) => {
    changed = true;
    const errorCode = getErrorCode(message || error, status);
    return `NextResponse.json(ApiErrorHandler.createError('${message || error}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern: Dynamic error messages (handle common cases)
  // { error: 'Failed to...', message: error.message }
  const pattern4 = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*,\s*message:\s*([^}]+)\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/gs;
  content = content.replace(pattern4, (match, errorPrefix, messageExpr, status) => {
    // Only replace if messageExpr is a simple variable reference
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*\.message$/.test(messageExpr.trim())) {
      changed = true;
      const errorCode = getErrorCode(errorPrefix, status);
      return `NextResponse.json(ApiErrorHandler.createError('${errorPrefix}', '${errorCode}', ${status}, { details: ${messageExpr.trim()} }), { status: ${status} })`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function getErrorCode(errorMessage, statusCode) {
  const status = parseInt(statusCode, 10);
  const msg = errorMessage.toLowerCase();

  // Map common patterns to error codes
  if (msg.includes('required') || msg.includes('missing')) return 'MISSING_REQUIRED_FIELD';
  if (msg.includes('invalid')) return 'INVALID_REQUEST';
  if (msg.includes('not found')) return 'NOT_FOUND';
  if (msg.includes('unauthorized') || msg.includes('not authenticated')) return 'UNAUTHORIZED';
  if (msg.includes('forbidden') || msg.includes('not allowed')) return 'FORBIDDEN';
  if (msg.includes('restricted')) return 'RESTRICTED';
  if (msg.includes('failed to') || msg.includes('could not')) return 'OPERATION_FAILED';
  if (msg.includes('database') || msg.includes('connection')) return 'DATABASE_ERROR';
  if (msg.includes('internal server')) return 'SERVER_ERROR';

  // Default based on status code
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 500) return 'SERVER_ERROR';

  return 'ERROR';
}

// Main execution
const apiFiles = findAPIFiles();
let fixedCount = 0;

for (const file of apiFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} files.`);



