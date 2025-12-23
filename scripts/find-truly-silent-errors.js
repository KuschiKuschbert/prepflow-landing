#!/usr/bin/env node

/**
 * Find catch blocks that truly don't log anything (no logger.error, logger.warn, or console.error)
 */

const fs = require('fs');
const path = require('path');

function findFiles(dir, extensions = ['.ts', '.tsx']) {
  const files = [];

  function walkDir(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
          walkDir(fullPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
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

  // Skip if no catch blocks
  if (!/catch\s*\(/.test(content)) {
    return [];
  }

  const issues = [];

  // Find all catch blocks with their content
  const catchPattern = /catch\s*\([^)]*\)\s*\{([^}]*)\}/gs;
  let match;
  let catchIndex = 0;

  while ((match = catchPattern.exec(content)) !== null) {
    catchIndex++;
    const catchBlock = match[1];
    const catchStart = match.index;
    const catchLine = content.substring(0, catchStart).split('\n').length;

    // Skip empty catch blocks or ones with only comments
    const trimmedBlock = catchBlock.trim();
    if (!trimmedBlock || /^\/\/.*$/.test(trimmedBlock.replace(/\n/g, ''))) {
      continue;
    }

    // Check if catch block has ANY error logging
    const hasLoggerError = /logger\.error\(/.test(catchBlock);
    const hasLoggerWarn = /logger\.warn\(/.test(catchBlock);
    const hasLoggerDev = /logger\.dev\(/.test(catchBlock);
    const hasConsoleError = /console\.error\(/.test(catchBlock);
    const hasConsoleWarn = /console\.warn\(/.test(catchBlock);
    const hasAnyLogging = hasLoggerError || hasLoggerWarn || hasLoggerDev || hasConsoleError || hasConsoleWarn;

    // Check if catch block throws or returns error
    const hasThrow = /throw\s+/.test(catchBlock);
    const hasReturnError = /return.*error|return.*Error|return.*NextResponse\.json.*error/i.test(catchBlock);
    const hasErrorHandling = hasThrow || hasReturnError;

    // Check if it's intentionally silent (background operation comment)
    const hasSilentComment = /silently|background|non-blocking|don't break|don't reveal/i.test(catchBlock);

    // Violation: catch block doesn't log AND doesn't throw/return error, and no silent comment
    if (!hasAnyLogging && !hasErrorHandling && !hasSilentComment && trimmedBlock.length > 0) {
      issues.push({
        file: filePath,
        line: catchLine,
        catchBlock: trimmedBlock.substring(0, 150).replace(/\n/g, ' '),
        issue: 'truly-silent-error-handling',
      });
    }
  }

  return issues;
}

function main() {
  console.log('Finding truly silent error handling violations...\n');

  const apiFiles = findFiles('app/api', ['.ts']);
  const componentFiles = findFiles('app/webapp', ['.tsx']);
  const libFiles = findFiles('lib', ['.ts']);
  const allFiles = [...apiFiles, ...componentFiles, ...libFiles];

  const allIssues = [];

  for (const file of allFiles) {
    const issues = analyzeFile(file);
    if (issues.length > 0) {
      allIssues.push(...issues);
    }
  }

  if (allIssues.length === 0) {
    console.log('✓ No truly silent error handling violations found!');
    return;
  }

  console.log(`Found ${allIssues.length} violation(s):\n`);

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
      console.log(`  - Line ${issue.line}: ${issue.issue}`);
      console.log(`    Block: ${issue.catchBlock}...`);
    }
    console.log();
  }

  console.log(`\nTotal: ${allIssues.length} violation(s)`);
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, analyzeFile };



