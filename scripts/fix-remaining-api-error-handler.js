#!/usr/bin/env node

/**
 * Fix Remaining Missing ApiErrorHandler
 */

const fs = require('fs');

const filesToFix = [
  'app/api/debug/user-data/route.ts',
  'app/api/dishes/bulk-delete/route.ts',
  'app/api/employees/populate/route.ts',
  'app/api/entitlements/route.ts',
  'app/api/ingredients/bulk-update/route.ts',
  'app/api/menus/[id]/statistics/route.ts',
  'app/api/populate-recipes/route.ts',
  'app/api/qr-codes/route.ts',
  'app/api/recipes/bulk-delete/route.ts',
  'app/api/webhook/square/route.ts',
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add ApiErrorHandler import if missing
  if (!content.includes('ApiErrorHandler')) {
    // Find first import line
    const lines = content.split('\n');
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i;
        break;
      }
    }

    // Find where to insert (after logger import if exists, otherwise after first import)
    let loggerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("from '@/lib/logger'")) {
        loggerIndex = i;
        break;
      }
    }

    const insertLine = loggerIndex >= 0 ? loggerIndex + 1 : insertIndex + 1;
    const newImport = "import { ApiErrorHandler } from '@/lib/api-error-handler';";

    if (!content.includes("@/lib/api-error-handler")) {
      lines.splice(insertLine, 0, newImport);
      content = lines.join('\n');
      changed = true;
    }
  }

  // Replace error responses
  const errorResponsePattern = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g;
  content = content.replace(errorResponsePattern, (match, errorMsg, status) => {
    changed = true;
    const errorCode = status === '401' ? 'UNAUTHORIZED' :
                     status === '403' ? 'FORBIDDEN' :
                     status === '404' ? 'NOT_FOUND' :
                     status === '503' ? 'DATABASE_ERROR' : 'SERVER_ERROR';
    return `NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Replace error with message
  const errorWithMessagePattern = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*,\s*message:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g;
  content = content.replace(errorWithMessagePattern, (match, errorMsg, message, status) => {
    changed = true;
    const errorCode = status === '401' ? 'UNAUTHORIZED' :
                     status === '403' ? 'FORBIDDEN' :
                     status === '404' ? 'NOT_FOUND' :
                     status === '503' ? 'DATABASE_ERROR' : 'SERVER_ERROR';
    return `NextResponse.json(ApiErrorHandler.createError('${message}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('Fixing remaining missing ApiErrorHandler...\n');

  let fixed = 0;
  filesToFix.forEach(filePath => {
    if (fixFile(filePath)) {
      console.log(`✓ Fixed: ${filePath}`);
      fixed++;
    } else {
      console.log(`- Skipped: ${filePath} (no changes needed or file not found)`);
    }
  });

  console.log(`\n✓ Fixed ${fixed} files`);
}

if (require.main === module) {
  main();
}

module.exports = { fixFile };


