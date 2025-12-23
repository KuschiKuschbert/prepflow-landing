#!/usr/bin/env node

/**
 * Fix Missing ApiErrorHandler
 * Adds ApiErrorHandler import and replaces error responses
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/admin/tiers/helpers/createTier.ts',
  'app/api/admin/tiers/helpers/deleteTier.ts',
  'app/api/admin/tiers/helpers/fetchTiers.ts',
  'app/api/admin/tiers/helpers/updateTier.ts',
  'app/api/backup/list/route.ts',
  'app/api/db/diagnose-dishes/route.ts',
  'app/api/db/populate-empty-dishes/route.ts',
  'app/api/db/reset/route.ts',
  'app/api/db/reset-self/route.ts',
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
    // Find import section
    const importMatch = content.match(/(import\s+.*from\s+['"][^'"]+['"];?\s*\n)+/);
    if (importMatch) {
      const lastImport = importMatch[0].trim().split('\n').pop();
      const newImport = "import { ApiErrorHandler } from '@/lib/api-error-handler';\n";

      // Check if already imported via other imports
      if (!content.includes("@/lib/api-error-handler")) {
        content = content.replace(importMatch[0], importMatch[0] + newImport);
        changed = true;
      }
    } else {
      // No imports found, add at top
      const firstLine = content.split('\n')[0];
      if (firstLine.includes('import')) {
        content = content.replace(firstLine, firstLine + "\nimport { ApiErrorHandler } from '@/lib/api-error-handler';");
      } else {
        content = "import { ApiErrorHandler } from '@/lib/api-error-handler';\n" + content;
      }
      changed = true;
    }
  }

  // Replace error responses
  // Pattern 1: NextResponse.json({ error: '...' }, { status: XXX })
  const errorResponsePattern = /NextResponse\.json\(\s*\{\s*error:\s*['"]([^'"]+)['"]\s*\}\s*,\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g;
  content = content.replace(errorResponsePattern, (match, errorMsg, status) => {
    changed = true;
    const errorCode = status === '401' ? 'UNAUTHORIZED' :
                     status === '403' ? 'FORBIDDEN' :
                     status === '404' ? 'NOT_FOUND' :
                     status === '503' ? 'DATABASE_ERROR' : 'SERVER_ERROR';
    return `NextResponse.json(ApiErrorHandler.createError('${errorMsg}', '${errorCode}', ${status}), { status: ${status} })`;
  });

  // Pattern 2: NextResponse.json({ error: '...', message: '...' }, { status: XXX })
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
  console.log('Fixing missing ApiErrorHandler in files...\n');

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


