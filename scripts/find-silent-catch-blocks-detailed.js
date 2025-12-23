#!/usr/bin/env node

/**
 * Find Silent Catch Blocks (Detailed)
 * Finds catch blocks that don't log errors or return/throw
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

function findSilentCatchBlocks(filePath) {
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const violations = [];

  // Find all catch blocks
  const catchRegex = /catch\s*\([^)]*\)\s*\{/g;
  let match;

  while ((match = catchRegex.exec(content)) !== null) {
    const catchStart = match.index;
    const catchLine = content.substring(0, catchStart).split('\n').length;

    // Find the matching closing brace
    let braceCount = 1;
    let pos = match.index + match[0].length;
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

    // Check if catch block has logging, throw, or return
    const hasLogging = /logger\.(error|warn|dev)\(/.test(catchContent);
    const hasThrow = /throw/.test(catchContent);
    const hasReturn = /return/.test(catchContent);
    const hasConsoleError = /console\.(error|warn|log)\(/.test(catchContent);

    // Skip if it's a test file or has intentional silent handling
    const isTestFile = filePath.includes('.test.') || filePath.includes('.spec.');
    const hasComment = /\/\/.*(silent|ignore|intentional)/i.test(catchContent);

    if (!hasLogging && !hasThrow && !hasReturn && !hasConsoleError && !isTestFile && !hasComment) {
      // Check if catch block is empty or only has whitespace/comments
      const trimmedContent = catchContent.trim();
      if (trimmedContent.length > 0 && !/^\/\/.*$/.test(trimmedContent)) {
        violations.push({
          line: catchLine,
          content: catchContent.substring(0, 100), // First 100 chars
        });
      }
    }
  }

  return violations;
}

// Main execution
const files = findFiles();
const results = [];

for (const file of files) {
  const violations = findSilentCatchBlocks(file);
  if (violations.length > 0) {
    results.push({ file, violations });
  }
}

console.log(`\n📊 Found ${results.length} files with silent catch blocks:\n`);

results.forEach(result => {
  console.log(`${result.file}:`);
  result.violations.forEach(v => {
    console.log(`  Line ${v.line}: ${v.content.substring(0, 80)}...`);
  });
  console.log('');
});

console.log(`\nTotal: ${results.reduce((sum, r) => sum + r.violations.length, 0)} silent catch blocks`);


