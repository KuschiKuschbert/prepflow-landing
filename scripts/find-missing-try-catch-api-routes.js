#!/usr/bin/env node

/**
 * Find Missing Try-Catch in API Routes
 * Finds API route handlers that have async operations but no try-catch blocks
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

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const violations = [];

  // Find exported async functions (GET, POST, PUT, DELETE, PATCH)
  const functionRegex = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\([^)]*\)\s*\{/g;
  let match;

  while ((match = functionRegex.exec(content)) !== null) {
    const funcStart = match.index;
    const funcName = match[1];
    const funcLine = content.substring(0, funcStart).split('\n').length;

    // Find the function body
    let braceCount = 1;
    let pos = match.index + match[0].length;
    let funcContent = '';

    while (pos < content.length && braceCount > 0) {
      const char = content[pos];
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount > 0) {
        funcContent += char;
      }
      pos++;
    }

    // Check if function has await but no try-catch
    const hasAwait = /await\s+/.test(funcContent);
    const hasTryCatch = /try\s*\{/.test(funcContent) && /catch\s*\(/.test(funcContent);

    if (hasAwait && !hasTryCatch) {
      violations.push({
        method: funcName,
        line: funcLine,
        content: funcContent.substring(0, 200), // First 200 chars
      });
    }
  }

  return violations.length > 0 ? { file: filePath, violations } : null;
}

// Main execution
const apiFiles = findAPIFiles();
const results = [];

for (const file of apiFiles) {
  const result = analyzeFile(file);
  if (result) {
    results.push(result);
  }
}

console.log(`\n📊 Found ${results.length} API route files with missing try-catch blocks:\n`);

results.forEach(result => {
  console.log(`${result.file}:`);
  result.violations.forEach(v => {
    console.log(`  ${v.method} at line ${v.line}: ${v.content.substring(0, 80)}...`);
  });
  console.log('');
});

console.log(`\nTotal: ${results.reduce((sum, r) => sum + r.violations.length, 0)} handlers missing try-catch`);


