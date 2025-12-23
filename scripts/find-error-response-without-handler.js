#!/usr/bin/env node

/**
 * Find Error Response Without Handler
 * Finds API routes that use NextResponse.json with errors but don't use ApiErrorHandler.createError
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

  // Check if file uses NextResponse.json with error but not ApiErrorHandler
  const hasApiErrorHandler = /ApiErrorHandler\.createError/.test(content);
  const hasErrorResponse = /NextResponse\.json\(/.test(content);
  const hasErrorInContent = /error|Error/.test(content);

  if (hasErrorResponse && hasErrorInContent && !hasApiErrorHandler) {
    // Find all NextResponse.json calls
    const responseRegex = /NextResponse\.json\(/g;
    let match;

    while ((match = responseRegex.exec(content)) !== null) {
      const responseStart = match.index;
      const responseLine = content.substring(0, responseStart).split('\n').length;

      // Find the matching closing parenthesis
      let parenCount = 1;
      let pos = match.index + match[0].length;
      let responseContent = '';

      while (pos < content.length && parenCount > 0) {
        const char = content[pos];
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (parenCount > 0) {
          responseContent += char;
        }
        pos++;
      }

      // Check if response contains error but not ApiErrorHandler
      const hasErrorInResponse = /error|Error/.test(responseContent);
      const hasApiErrorHandlerInResponse = /ApiErrorHandler\.createError/.test(responseContent);

      if (hasErrorInResponse && !hasApiErrorHandlerInResponse) {
        violations.push({
          line: responseLine,
          content: responseContent.substring(0, 150), // First 150 chars
        });
      }
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

console.log(`\n📊 Found ${results.length} API route files with error responses without ApiErrorHandler:\n`);

results.forEach(result => {
  console.log(`${result.file}:`);
  result.violations.forEach(v => {
    console.log(`  Line ${v.line}: ${v.content.substring(0, 100)}...`);
  });
  console.log('');
});

console.log(`\nTotal: ${results.reduce((sum, r) => sum + r.violations.length, 0)} error responses without ApiErrorHandler`);



