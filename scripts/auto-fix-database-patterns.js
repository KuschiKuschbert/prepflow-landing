#!/usr/bin/env node

/**
 * Auto-fix Database Pattern Violations
 * Uses cleanup check to find violations, then applies targeted fixes
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get files with violations from cleanup check
function getViolationsFromCleanup() {
  try {
    const output = execSync('npm run cleanup:check 2>&1', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    // Parse output to find database pattern violations
    // This is a simplified approach - in reality we'd parse the JSON report
    return [];
  } catch (error) {
    // Cleanup check returns non-zero on violations
    return [];
  }
}

// Find files with specific violation patterns
function findViolationFiles() {
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

// Pattern 1: Fix throw new Error('Database connection not available')
function fixThrowDbConnection(content, filePath) {
  const pattern = /if\s*\(!supabaseAdmin\)\s*\{\s*throw\s+new\s+Error\(['"]Database connection not available['"]\)/g;

  if (!pattern.test(content)) return { changed: false, content };

  const hasApiErrorHandler = content.includes('ApiErrorHandler');
  const hasLogger = content.includes('logger');

  // Only fix if we have the necessary imports
  if (!hasApiErrorHandler || !hasLogger) {
    return { changed: false, content, reason: 'Missing imports' };
  }

  // Extract context for logger
  const context = getContext(filePath);

  const replacement = `if (!supabaseAdmin) {
      logger.error('[${context}] Database connection not available');
      return null;`;

  const newContent = content.replace(pattern, replacement);
  return { changed: true, content: newContent };
}

// Pattern 2: Add missing error handling for Supabase queries
function fixMissingErrorHandling(content, filePath) {
  const lines = content.split('\n');
  let changed = false;
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line has a Supabase query with error destructuring
    if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin/.test(line)) {
      // Find where the query chain ends (semicolon or closing brace)
      let queryEndIndex = i;
      let foundSemicolon = false;

      // Look ahead to find the end of the query
      for (let j = i; j < Math.min(i + 10, lines.length); j++) {
        if (lines[j].includes(';')) {
          queryEndIndex = j;
          foundSemicolon = true;
          break;
        }
      }

      // Check if error handling exists after the query
      const afterQuery = lines.slice(queryEndIndex + 1, queryEndIndex + 6).join('\n');

      if (!foundSemicolon || !/if\s*\(error\)|error\s*&&/.test(afterQuery)) {
        // Add the query lines first
        for (let j = i; j <= queryEndIndex; j++) {
          newLines.push(lines[j]);
        }

        // Then add error handling after the query ends
        if (foundSemicolon) {
          const indent = line.match(/^(\s*)/)[1];
          const context = getContext(filePath);

          // Check if we have logger and ApiErrorHandler
          const hasLogger = content.includes('logger');
          const hasApiErrorHandler = content.includes('ApiErrorHandler');

          if (hasLogger && hasApiErrorHandler) {
            // Add error handling after the semicolon
            newLines.push('');
            newLines.push(`${indent}if (error) {`);
            newLines.push(`${indent}  logger.error('[${context}] Database error:', {`);
            newLines.push(`${indent}    error: error.message,`);
            newLines.push(`${indent}  });`);
            newLines.push(`${indent}  throw ApiErrorHandler.fromSupabaseError(error, 500);`);
            newLines.push(`${indent}}`);
            changed = true;
          }
        }

        i = queryEndIndex;
        continue;
      }
    }

    newLines.push(line);
  }

  return { changed, content: newLines.join('\n') };
}

// Pattern 3: Replace .catch() chaining (complex - mark for manual review)
function findCatchChaining(content, filePath) {
  const pattern = /\.(from|select|insert|update|delete)\([^)]*\)[^}]*\.catch\(/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(content)) !== null) {
    matches.push({
      index: match.index,
      match: match[0],
    });
  }

  return matches;
}

function getContext(filePath) {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace(/\.(ts|tsx)$/, '');
  const dir = parts[parts.length - 2] || '';
  return `${dir}/${fileName}`;
}

function main() {
  const files = findViolationFiles();
  const fixes = [];
  const needsReview = [];

  console.log(`Analyzing ${files.length} files for auto-fixable violations...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if no Supabase usage
    if (!content.includes('supabaseAdmin') && !content.includes('supabase')) {
      return;
    }

    // Pattern 1: Fix throw new Error
    const fix1 = fixThrowDbConnection(content, filePath);
    if (fix1.changed) {
      fixes.push({ file: filePath, pattern: 'throw-db-connection', fix: fix1 });
    }

    // Pattern 2: Fix missing error handling (conservative - only if imports exist)
    const hasLogger = content.includes('logger');
    const hasApiErrorHandler = content.includes('ApiErrorHandler');
    if (hasLogger && hasApiErrorHandler) {
      const fix2 = fixMissingErrorHandling(content, filePath);
      if (fix2.changed) {
        fixes.push({ file: filePath, pattern: 'missing-error-handling', fix: fix2 });
      }
    }

    // Pattern 3: Find .catch() chaining (mark for review)
    const catchChains = findCatchChaining(content, filePath);
    if (catchChains.length > 0) {
      needsReview.push({ file: filePath, count: catchChains.length });
    }
  });

  console.log(`Found ${fixes.length} auto-fixable violations:\n`);
  fixes.forEach((fix, i) => {
    console.log(`${i + 1}. ${fix.file} (${fix.pattern})`);
  });

  console.log(`\nFound ${needsReview.length} files with .catch() chaining (needs manual review):\n`);
  needsReview.forEach((item, i) => {
    console.log(`${i + 1}. ${item.file} (${item.count} instances)`);
  });

  // Apply fixes
  if (fixes.length > 0) {
    console.log(`\nApplying ${fixes.length} fixes...`);
    fixes.forEach(({ file, fix }) => {
      fs.writeFileSync(file, fix.content, 'utf8');
      console.log(`✓ Fixed ${file}`);
    });
    console.log(`\n✓ Applied ${fixes.length} fixes`);
  } else {
    console.log('\nNo auto-fixable violations found.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixThrowDbConnection, fixMissingErrorHandling, findCatchChaining };
