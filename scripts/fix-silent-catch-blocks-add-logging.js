#!/usr/bin/env node

/**
 * Fix Silent Catch Blocks - Add Logging
 * Adds logger.error() to catch blocks that don't have any logging
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

  // Check if file has logger import
  const hasLoggerImport = /import.*logger.*from.*['"]@\/lib\/logger['"]/.test(content);

  // Find all catch blocks
  const catchRegex = /catch\s*\(([^)]*)\)\s*\{/g;
  const catchBlocks = [];
  let match;

  while ((match = catchRegex.exec(content)) !== null) {
    const catchStart = match.index;
    const errorParam = match[1].trim() || 'error';

    // Find the matching closing brace
    let braceCount = 1;
    let pos = match.index + match[0].length;
    let catchContentStart = pos;
    let catchContent = '';

    while (pos < content.length && braceCount > 0) {
      const char = content[pos];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount > 0) {
        catchContent += char;
      }
      pos++;
    }

    const catchContentEnd = pos - 1;

    // Check if catch block has logging
    const hasLogging = /logger\.(error|warn|dev)\(/.test(catchContent);
    const hasConsoleError = /console\.(error|warn|log)\(/.test(catchContent);
    const hasThrow = /throw/.test(catchContent);

    // Skip if it's a test file or has intentional silent handling
    const isTestFile = filePath.includes('.test.') || filePath.includes('.spec.');
    const hasComment = /\/\/.*(silent|ignore|intentional)/i.test(catchContent);

    if (!hasLogging && !hasConsoleError && !hasThrow && !isTestFile && !hasComment) {
      // Check if catch block is not empty
      const trimmedContent = catchContent.trim();
      if (trimmedContent.length > 0 && !/^\/\/.*$/.test(trimmedContent)) {
        catchBlocks.push({
          start: catchContentStart,
          end: catchContentEnd,
          errorParam,
          content: catchContent,
        });
      }
    }
  }

  // Process catch blocks in reverse order to maintain positions
  for (let i = catchBlocks.length - 1; i >= 0; i--) {
    const block = catchBlocks[i];

    // Add logger.error at the start of catch block
    const indentMatch = block.content.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1] : '      ';

    // Create error message
    const errorMessage = `logger.error('[${path.basename(filePath)}] Error in catch block:', {
      error: ${block.errorParam} instanceof Error ? ${block.errorParam}.message : String(${block.errorParam}),
      stack: ${block.errorParam} instanceof Error ? ${block.errorParam}.stack : undefined,
    });`;

    const loggerCall = indent + errorMessage + '\n';

    // Insert logger.error at the start of catch block
    content = content.slice(0, block.start) + loggerCall + content.slice(block.start);
    changed = true;
  }

  // Add logger import if needed
  if (changed && !hasLoggerImport) {
    // Find the last import statement
    const importRegex = /^import\s+.*from\s+['"].*['"];?$/gm;
    const imports = content.match(importRegex) || [];

    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const insertIndex = lastImportIndex + lastImport.length;

      const importStatement = "\nimport { logger } from '@/lib/logger';";
      content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
    } else {
      // No imports found, add at the top after any 'use' directives
      const useDirectiveMatch = content.match(/^['"]use\s+(client|server)['"];?\n/);
      if (useDirectiveMatch) {
        const insertIndex = useDirectiveMatch.index + useDirectiveMatch[0].length;
        const importStatement = "import { logger } from '@/lib/logger';\n";
        content = content.slice(0, insertIndex) + importStatement + content.slice(insertIndex);
      } else {
        // Add at the very beginning
        const importStatement = "import { logger } from '@/lib/logger';\n";
        content = importStatement + content;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath} (${catchBlocks.length} catch blocks)`);
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


