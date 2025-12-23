#!/usr/bin/env node

/**
 * Fix Hardcoded Error Responses
 * Replaces hardcoded error responses with ApiErrorHandler.createError
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
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Skip if file doesn't have ApiErrorHandler import (should have been added earlier)
  if (!content.includes('ApiErrorHandler')) {
    return false;
  }

  // Pattern 1: NextResponse.json({ error: '...' }, { status: XXX })
  const pattern1 = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern1, (match, errorMsg, status) => {
    changed = true;
    const errorCode = getErrorCode(errorMsg, status);
    return `NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern 2: NextResponse.json({ error: '...', message: '...' }, { status: XXX })
  const pattern2 = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*,\s*message:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern2, (match, error, message, status) => {
    changed = true;
    const errorCode = getErrorCode(error, status);
    return `NextResponse.json(ApiErrorHandler.createError('${message}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern 3: NextResponse.json({ success: false, error: '...' }, { status: XXX })
  const pattern3 = /NextResponse\.json\(\s*\{\s*success:\s*false\s*,\s*error:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern3, (match, errorMsg, status) => {
    changed = true;
    const errorCode = getErrorCode(errorMsg, status);
    return `NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern 4: Multi-line error responses (more complex, handle common cases)
  // This is a simplified version - may need manual review for complex cases
  const pattern4 = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*,\s*details:\s*([^}]+)\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern4, (match, errorMsg, details, status) => {
    changed = true;
    const errorCode = getErrorCode(errorMsg, status);
    // For details, we'll include them as the 4th parameter
    return `NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}, ${details}), { status: ${status} })`;
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

  // Map common error messages to error codes
  const errorCodeMap = {
    'User email not found': 'MISSING_EMAIL',
    'Invalid request data': 'INVALID_REQUEST',
    'Invalid request body': 'INVALID_REQUEST',
    'Internal server error': 'SERVER_ERROR',
    'Failed to': 'OPERATION_FAILED',
    'Not found': 'NOT_FOUND',
    'Unauthorized': 'UNAUTHORIZED',
    'Forbidden': 'FORBIDDEN',
  };

  for (const [key, code] of Object.entries(errorCodeMap)) {
    if (errorMessage.includes(key)) {
      return code;
    }
  }

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


