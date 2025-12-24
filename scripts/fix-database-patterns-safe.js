#!/usr/bin/env node

/**
 * Safe Database Pattern Fixer
 * Only fixes patterns that are 100% safe to auto-fix
 * Reports others for manual review
 */

const fs = require('fs');
const path = require('path');

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
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

// Pattern 1: throw new Error('Database connection not available') - SAFE TO FIX
function fixThrowDbConnection(content, filePath) {
  // Only fix if we have the necessary imports
  if (!content.includes('ApiErrorHandler') || !content.includes('logger')) {
    return { changed: false, content };
  }

  const pattern =
    /if\s*\(!supabaseAdmin\)\s*\{\s*throw\s+new\s+Error\(['"]Database connection not available['"]\)/g;

  if (!pattern.test(content)) return { changed: false, content };

  const context = getContext(filePath);
  const replacement = `if (!supabaseAdmin) {
      logger.error('[${context}] Database connection not available');
      return null;`;

  const newContent = content.replace(pattern, replacement);
  return { changed: true, content: newContent };
}

// Pattern 2: Find queries missing error handling - REPORT ONLY (too risky to auto-fix)
function findMissingErrorHandling(content, filePath) {
  const violations = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find Supabase queries with error destructuring
    if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin/.test(line)) {
      // Find the end of the query (semicolon)
      let queryEndLine = i;
      for (let j = i; j < Math.min(i + 15, lines.length); j++) {
        if (lines[j].trim().endsWith(';')) {
          queryEndLine = j;
          break;
        }
      }

      // Check next 5 lines after query for error handling
      const afterQuery = lines.slice(queryEndLine + 1, queryEndLine + 6).join('\n');

      if (!/if\s*\(error\)|error\s*&&/.test(afterQuery)) {
        violations.push({
          file: filePath,
          line: i + 1,
          queryLine: queryEndLine + 1,
        });
      }
    }
  }

  return violations;
}

function getContext(filePath) {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace(/\.(ts|tsx)$/, '');
  const dir = parts[parts.length - 2] || '';
  return `${dir}/${fileName}`;
}

function main() {
  const files = findFiles();
  const fixes = [];
  const needsReview = [];

  console.log(`Analyzing ${files.length} files...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if no Supabase usage
    if (!content.includes('supabaseAdmin') && !content.includes('supabase')) {
      return;
    }

    // Pattern 1: Fix throw new Error (safe)
    const fix1 = fixThrowDbConnection(content, filePath);
    if (fix1.changed) {
      fixes.push({ file: filePath, pattern: 'throw-db-connection' });
      fs.writeFileSync(filePath, fix1.content, 'utf8');
    }

    // Pattern 2: Find missing error handling (report only)
    const violations = findMissingErrorHandling(content, filePath);
    if (violations.length > 0) {
      needsReview.push(...violations);
    }
  });

  console.log(`✓ Fixed ${fixes.length} safe violations:\n`);
  fixes.forEach((fix, i) => {
    console.log(`${i + 1}. ${fix.file}`);
  });

  if (needsReview.length > 0) {
    console.log(`\n⚠️  Found ${needsReview.length} violations needing manual review:\n`);
    needsReview.slice(0, 20).forEach((v, i) => {
      console.log(`${i + 1}. ${v.file}:${v.line} (query ends at line ${v.queryLine})`);
    });
    if (needsReview.length > 20) {
      console.log(`\n... and ${needsReview.length - 20} more`);
    }
  }

  console.log(`\nSummary: ${fixes.length} auto-fixed, ${needsReview.length} need manual review`);
}

if (require.main === module) {
  main();
}

module.exports = { fixThrowDbConnection, findMissingErrorHandling };
