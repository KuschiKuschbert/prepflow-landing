#!/usr/bin/env node

/**
 * Fix Remaining Error Responses
 * Handles remaining patterns of hardcoded error responses
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/ingredients/migrate-units/route.ts',
  'app/api/kitchen-sections/route.ts',
  'app/api/menu-dishes/route.ts',
  'app/api/menus/[id]/items/[itemId]/route.ts',
  'app/api/menus/[id]/items/[itemId]/statistics/route.ts',
  'app/api/menus/[id]/items/bulk/route.ts',
  'app/api/menus/[id]/items/route.ts',
  'app/api/menus/[id]/reorder/route.ts',
  'app/api/populate-clean-test-data/route.ts',
  'app/api/prep-lists/analyze-prep-details/route.ts',
  'app/api/prep-lists/batch-create/route.ts',
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Skip if file doesn't have ApiErrorHandler import
  if (!content.includes('ApiErrorHandler')) {
    return false;
  }

  // Pattern: Database connection not available
  const pattern1 = /return NextResponse\.json\(\s*\{\s*error:\s*['"]Database connection not available['"]\s*(?:,\s*message:\s*['"]([^'"]+)['"])?\s*\}\s*,\s*\{\s*status:\s*500\s*\}\)/g;
  content = content.replace(pattern1, (match, message) => {
    changed = true;
    const errorMsg = message || 'Database connection not available';
    return `return NextResponse.json(ApiErrorHandler.createError('${errorMsg}', 'DATABASE_ERROR', 500), { status: 500 })`;
  });

  // Pattern: Simple error with message
  const pattern2 = /return NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*,\s*message:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern2, (match, error, message, status) => {
    changed = true;
    const errorCode = getErrorCode(message || error, status);
    return `return NextResponse.json(ApiErrorHandler.createError('${message || error}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern: Simple error object
  const pattern3 = /return NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern3, (match, errorMsg, status) => {
    // Skip if already contains ApiErrorHandler
    if (match.includes('ApiErrorHandler')) return match;
    changed = true;
    const errorCode = getErrorCode(errorMsg, status);
    return `return NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern: success: false with error
  const pattern4 = /return NextResponse\.json\(\s*\{\s*success:\s*false\s*,\s*error:\s*['"]([^'"]+)['"]\s*(?:,\s*message:\s*['"]([^'"]+)['"])?\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern4, (match, error, message, status) => {
    changed = true;
    const errorCode = getErrorCode(message || error, status);
    return `return NextResponse.json(ApiErrorHandler.createError('${message || error}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern: Catch block with error response
  const pattern5 = /catch\s*\([^)]*\)\s*\{[\s\S]*?return NextResponse\.json\(\s*\{\s*error:\s*([^}]+)\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\)/g;
  content = content.replace(pattern5, (match, errorContent, status) => {
    // Extract error message if it's a simple string
    const errorMatch = errorContent.match(/['"]([^'"]+)['"]/);
    if (errorMatch) {
      changed = true;
      const errorMsg = errorMatch[1];
      const errorCode = getErrorCode(errorMsg, status);
      return match.replace(
        /return NextResponse\.json\(\s*\{\s*error:\s*[^}]+\s*\}\s*,\s*\{\s*status:\s*\d+\s*\}\)/,
        `return NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`,
      );
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

  if (msg.includes('required') || msg.includes('missing')) return 'MISSING_REQUIRED_FIELD';
  if (msg.includes('invalid')) return 'INVALID_REQUEST';
  if (msg.includes('not found')) return 'NOT_FOUND';
  if (msg.includes('unauthorized')) return 'UNAUTHORIZED';
  if (msg.includes('forbidden')) return 'FORBIDDEN';
  if (msg.includes('database') || msg.includes('connection')) return 'DATABASE_ERROR';
  if (status === 400) return 'BAD_REQUEST';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status === 500) return 'SERVER_ERROR';

  return 'ERROR';
}

// Main execution
let fixedCount = 0;

for (const file of filesToFix) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} files.`);


