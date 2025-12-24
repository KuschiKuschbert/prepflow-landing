#!/usr/bin/env node

/**
 * Find API routes missing try-catch blocks
 */

const fs = require('fs');
const path = require('path');

function findAPIRoutes(dir = 'app/api') {
  const files = [];

  function walkDir(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name === 'route.ts' || entry.name === 'route.js') {
        files.push(fullPath);
      }
    }
  }

  walkDir(dir);
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  const issues = [];

  // Find all exported async functions (GET, POST, PUT, PATCH, DELETE)
  const asyncFunctionPattern = /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE)/g;
  let match;
  let functionCount = 0;

  while ((match = asyncFunctionPattern.exec(content)) !== null) {
    functionCount++;
    const functionStart = match.index;
    const functionLine = content.substring(0, functionStart).split('\n').length;

    // Extract function body
    let braceCount = 0;
    let inFunction = false;
    let functionBody = '';
    let functionEnd = functionStart;

    for (let i = functionStart; i < content.length; i++) {
      const char = content[i];
      if (char === '{') {
        braceCount++;
        inFunction = true;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0 && inFunction) {
          functionEnd = i;
          functionBody = content.substring(functionStart, functionEnd + 1);
          break;
        }
      }
    }

    // Check if function has try-catch
    const hasTryCatch = /try\s*\{/.test(functionBody) && /catch\s*\(/.test(functionBody);
    const hasAwait = /await\s+/.test(functionBody);

    if (hasAwait && !hasTryCatch) {
      issues.push({
        file: filePath,
        line: functionLine,
        function: match[1],
        issue: 'missing-try-catch',
      });
    }
  }

  return issues;
}

function main() {
  console.log('Finding API routes missing try-catch blocks...\n');

  const apiFiles = findAPIRoutes();
  const allIssues = [];

  for (const file of apiFiles) {
    const issues = analyzeFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues);
    }
  }

  if (allIssues.length === 0) {
    console.log('✓ All API routes have try-catch blocks!');
    return;
  }

  console.log(`Found ${allIssues.length} API route(s) missing try-catch blocks:\n`);

  // Group by file
  const byFile = {};
  for (const issue of allIssues) {
    if (!byFile[issue.file]) {
      byFile[issue.file] = [];
    }
    byFile[issue.file].push(issue);
  }

  for (const [file, issues] of Object.entries(byFile)) {
    console.log(`${file}:`);
    for (const issue of issues) {
      console.log(`  - Line ${issue.line}: ${issue.function}() missing try-catch`);
    }
    console.log();
  }

  console.log(`\nTotal: ${allIssues.length} violation(s)`);
}

if (require.main === module) {
  main();
}

module.exports = { findAPIRoutes, analyzeFile };
