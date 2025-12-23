#!/usr/bin/env node

/**
 * Fix Missing Logger Imports
 * Adds logger import to files with async operations and catch blocks but no logger import
 */

const fs = require('fs');
const path = require('path');

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components', 'lib'];

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
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        // Skip logger.ts itself
        if (!fullPath.includes('logger.ts')) {
          files.push(fullPath);
        }
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Check if file has async operations and catch blocks but no logger import
  const hasAsync = /async\s+function|async\s+\(/.test(content);
  const hasAwait = /await\s+/.test(content);
  const hasTryCatch = /try\s*\{/.test(content) && /catch\s*\(/.test(content);
  const hasAsyncOperation = hasAsync && hasAwait;
  const hasLoggerImport = /import.*logger.*from.*['"]@\/lib\/logger['"]/.test(content);
  const hasCatchBlock = /catch\s*\(/.test(content);

  if (hasAsyncOperation && hasCatchBlock && !hasLoggerImport) {
    // Find the last import statement
    const importRegex = /^import\s+.*from\s+['"].*['"];?$/gm;
    const imports = content.match(importRegex) || [];

    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;

      // Add logger import after the last import
      const importStatement = "\nimport { logger } from '@/lib/logger';";
      content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
      changed = true;
    } else {
      // No imports found, add at the top after any 'use' directives
      const useDirectiveMatch = content.match(/^['"]use\s+(client|server)['"];?\n/);
      if (useDirectiveMatch) {
        const insertIndex = useDirectiveMatch.index + useDirectiveMatch[0].length;
        const importStatement = "import { logger } from '@/lib/logger';\n";
        content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
        changed = true;
      } else {
        // Add at the very beginning
        const importStatement = "import { logger } from '@/lib/logger';\n";
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
const files = findFiles();
let fixedCount = 0;

for (const file of files) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n✅ Fixed ${fixedCount} files.`);



