#!/usr/bin/env node

/**
 * Fix throw new Error patterns
 * Replaces throw new Error with ApiErrorHandler.createError
 */

const fs = require('fs');

const filesToFix = [
  'app/api/cleaning-areas/helpers/createCleaningArea.ts',
  'app/api/cleaning-areas/helpers/updateCleaningArea.ts',
  'app/api/compliance-records/helpers/updateComplianceRecord.ts',
  'app/api/cleaning-tasks/helpers/createCleaningTask.ts',
  'app/api/cleaning-tasks/helpers/updateCleaningTask.ts',
  'app/api/menus/[id]/lock/helpers/generateRecipeCards/handleErrors.ts',
  'app/api/menus/[id]/helpers/fetchMenuItemsWithFallback/helpers/handlePricingFallback.ts',
];

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Add ApiErrorHandler import if missing and file has throw new Error
  if (content.includes('throw new Error') && !content.includes('ApiErrorHandler')) {
    const lines = content.split('\n');
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i;
        break;
      }
    }

    // Find logger import if exists
    let loggerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("from '@/lib/logger'")) {
        loggerIndex = i;
        break;
      }
    }

    const insertLine = loggerIndex >= 0 ? loggerIndex + 1 : insertIndex + 1;
    const newImport = "import { ApiErrorHandler } from '@/lib/api-error-handler';";

    if (!content.includes('@/lib/api-error-handler')) {
      lines.splice(insertLine, 0, newImport);
      content = lines.join('\n');
      changed = true;
    }
  }

  // Replace throw new Error('Database connection not available')
  content = content.replace(/throw new Error\(['"]Database connection not available['"]\)/g, () => {
    changed = true;
    return "throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 503)";
  });

  // Replace other throw new Error patterns
  // Pattern: throw new Error('message')
  content = content.replace(/throw new Error\(['"]([^'"]+)['"]\)/g, (match, errorMsg) => {
    changed = true;
    // Determine error code based on message
    let errorCode = 'SERVER_ERROR';
    if (
      errorMsg.toLowerCase().includes('database') ||
      errorMsg.toLowerCase().includes('connection')
    ) {
      errorCode = 'DATABASE_ERROR';
    } else if (
      errorMsg.toLowerCase().includes('unauthorized') ||
      errorMsg.toLowerCase().includes('auth')
    ) {
      errorCode = 'UNAUTHORIZED';
    } else if (errorMsg.toLowerCase().includes('not found')) {
      errorCode = 'NOT_FOUND';
    } else if (
      errorMsg.toLowerCase().includes('validation') ||
      errorMsg.toLowerCase().includes('invalid')
    ) {
      errorCode = 'VALIDATION_ERROR';
    }
    return `throw ApiErrorHandler.createError('${errorMsg}', '${errorCode}', 500)`;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  console.log('Fixing throw new Error patterns...\n');

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
