#!/usr/bin/env node

/**
 * Batch fix console.* calls to logger.*
 * More aggressive than codemod - handles all cases
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findFiles(dir) {
  const files = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== '.next'
        ) {
          walk(fullPath);
        }
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  walk(dir);
  return files;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let needsLoggerImport = false;

  // Check if file has console calls
  if (!/console\.(log|error|warn|info|debug)/.test(content)) {
    return false;
  }

  // Check if logger is already imported
  const hasLoggerImport =
    /import.*logger.*from.*['"]@\/lib\/logger['"]/.test(content) ||
    /import.*logger.*from.*['"]\.\.\/.*lib\/logger['"]/.test(content);

  // Replace console calls
  const replacements = [
    { from: /console\.log\(/g, to: 'logger.dev(' },
    { from: /console\.error\(/g, to: 'logger.error(' },
    { from: /console\.warn\(/g, to: 'logger.warn(' },
    { from: /console\.info\(/g, to: 'logger.info(' },
    { from: /console\.debug\(/g, to: 'logger.debug(' },
  ];

  for (const { from, to } of replacements) {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
      needsLoggerImport = true;
    }
  }

  // Add logger import if needed
  if (modified && !hasLoggerImport && needsLoggerImport) {
    // Find the last import statement
    const importMatch = content.match(/(import\s+.*?from\s+['"][^'"]+['"];?\s*\n)+/);
    if (importMatch) {
      const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
      const importPath = filePath.includes('/app/') ? '@/lib/logger' : '../../lib/logger';
      content =
        content.slice(0, lastImportIndex) +
        `import { logger } from '${importPath}';\n` +
        content.slice(lastImportIndex);
    } else {
      // No imports, add at top
      content = `import { logger } from '@/lib/logger';\n${content}`;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// Main
const dirs = ['app', 'hooks', 'lib'];
let totalFixed = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = findFiles(dir);
  console.log(`Processing ${files.length} files in ${dir}...`);

  for (const file of files) {
    if (fixFile(file)) {
      totalFixed++;
      console.log(`  Fixed: ${file}`);
    }
  }
}

console.log(`\n✅ Fixed ${totalFixed} files`);
