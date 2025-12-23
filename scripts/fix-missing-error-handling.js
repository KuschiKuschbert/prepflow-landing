#!/usr/bin/env node

/**
 * Fix Missing Error Handling for Supabase Queries
 * Automatically adds error handling to Supabase queries that don't have it
 *
 * Usage:
 *   node scripts/fix-missing-error-handling.js [--write] [--limit=N]
 */

const fs = require('fs');
const path = require('path');

// Pattern to find Supabase queries without error handling
const SUPABASE_QUERY_PATTERN = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabase[^}]*\.(from|select|insert|update|delete|upsert)\([^}]*\)[^}]*;/g;
const MISSING_ERROR_CHECK = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await[^}]*if\s*\(!error\)/;

function findFiles() {
  const files = [];
  const searchDirs = ['app/api', 'lib'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (/supabase/.test(content) || /from\(['"]/.test(content)) {
          files.push(fullPath);
        }
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  // Find Supabase queries
  const queryMatches = [];
  let match;
  const queryRegex = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabase[^}]*\.(from|select|insert|update|delete|upsert)\([^}]*\)[^}]*;/g;

  while ((match = queryRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    const queryLine = match[0];

    // Check if error is handled in next few lines
    const nextLines = lines.slice(lineNum - 1, Math.min(lineNum + 5, lines.length)).join('\n');
    const hasErrorCheck = /if\s*\(error\)/.test(nextLines) || /error\s*&&/.test(nextLines);

    if (!hasErrorCheck) {
      issues.push({
        line: lineNum,
        query: queryLine.trim(),
        type: 'missing-error-handling'
      });
    }
  }

  return issues;
}

function fixFile(filePath, issues) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let hasChanges = false;
  let needsLogger = false;
  let needsApiErrorHandler = false;

  // Check imports
  const hasLoggerImport = /import.*logger.*from/.test(content);
  const hasApiErrorHandlerImport = /import.*ApiErrorHandler.*from/.test(content);

  // Process issues in reverse order to maintain line numbers
  issues.sort((a, b) => b.line - a.line);

  for (const issue of issues) {
    if (issue.type === 'missing-error-handling') {
      const lineIdx = issue.line - 1;
      const queryLine = lines[lineIdx];

      // Check if next line already has error handling
      if (lineIdx + 1 < lines.length) {
        const nextLine = lines[lineIdx + 1];
        if (/if\s*\(error\)/.test(nextLine) || /error\s*&&/.test(nextLine)) {
          continue; // Already has error handling
        }
      }

      // Add error handling block after the query
      const indent = queryLine.match(/^(\s*)/)[1];
      const errorBlock = `
${indent}if (error) {
${indent}  logger.error('[API] Database error:', {
${indent}    error: error.message,
${indent}    code: (error as any).code,
${indent}  });
${indent}  throw ApiErrorHandler.fromSupabaseError(error, 500);
${indent}}`;

      lines.splice(lineIdx + 1, 0, errorBlock);
      hasChanges = true;
      needsLogger = true;
      needsApiErrorHandler = true;
    }
  }

  if (hasChanges) {
    content = lines.join('\n');

    // Add imports if needed
    if (needsLogger && !hasLoggerImport) {
      const lastImport = content.lastIndexOf('import ');
      const nextLine = content.indexOf('\n', lastImport);
      content = content.slice(0, nextLine + 1) +
        "import { logger } from '@/lib/logger';\n" +
        content.slice(nextLine + 1);
    }

    if (needsApiErrorHandler && !hasApiErrorHandlerImport) {
      const lastImport = content.lastIndexOf('import ');
      const nextLine = content.indexOf('\n', lastImport);
      content = content.slice(0, nextLine + 1) +
        "import { ApiErrorHandler } from '@/lib/api-error-handler';\n" +
        content.slice(nextLine + 1);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--write');
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  console.log('🔍 Scanning for files with missing error handling...\n');

  const files = findFiles();
  const filesWithIssues = [];

  for (const file of files) {
    const issues = analyzeFile(file);
    if (issues.length > 0) {
      filesWithIssues.push({ path: file, issues });
    }
  }

  if (limit) {
    filesWithIssues.splice(limit);
  }

  console.log(`📊 Found ${filesWithIssues.length} files with missing error handling\n`);

  if (shouldFix) {
    let fixed = 0;
    filesWithIssues.forEach((file, index) => {
      console.log(`${index + 1}. ${file.path} (${file.issues.length} issues)`);
      if (fixFile(file.path, file.issues)) {
        console.log(`   ✅ Fixed`);
        fixed++;
      } else {
        console.log(`   ⚠️  Needs manual review`);
      }
    });
    console.log(`\n✨ Fixed ${fixed} files`);
  } else {
    filesWithIssues.forEach((file, index) => {
      console.log(`${index + 1}. ${file.path} (${file.issues.length} issues)`);
      file.issues.forEach(issue => {
        console.log(`   Line ${issue.line}: ${issue.type}`);
      });
    });
    console.log(`\n💡 Run with --write to apply fixes`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, analyzeFile, fixFile };



