#!/usr/bin/env node

/**
 * Fix Missing ApiErrorHandler Imports
 * Adds ApiErrorHandler import to API routes that use NextResponse.json but don't import ApiErrorHandler
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

  // Check if file uses NextResponse.json with errors but doesn't import ApiErrorHandler
  const hasErrorResponse = /NextResponse\.json\(/.test(content);
  const hasApiErrorHandlerImport = /import.*ApiErrorHandler.*from/.test(content);
  const hasErrorInContent = /error|Error/.test(content);

  if (hasErrorResponse && !hasApiErrorHandlerImport && hasErrorInContent) {
    // Find the last import statement
    const importRegex = /^import\s+.*from\s+['"].*['"];?$/gm;
    const imports = content.match(importRegex) || [];

    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;

      // Add ApiErrorHandler import after the last import
      const importStatement = "\nimport { ApiErrorHandler } from '@/lib/api-error-handler';";
      content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
      changed = true;
    } else {
      // No imports found, add at the top after any 'use' directives
      const useDirectiveMatch = content.match(/^['"]use\s+(client|server)['"];?\n/);
      if (useDirectiveMatch) {
        const insertIndex = useDirectiveMatch.index + useDirectiveMatch[0].length;
        const importStatement = "import { ApiErrorHandler } from '@/lib/api-error-handler';\n";
        content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
        changed = true;
      } else {
        // Add at the very beginning
        const importStatement = "import { ApiErrorHandler } from '@/lib/api-error-handler';\n";
        content = importStatement + content;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
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



