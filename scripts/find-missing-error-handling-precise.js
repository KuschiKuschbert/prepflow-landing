#!/usr/bin/env node

/**
 * Precise Missing Error Handling Finder
 * Finds queries that actually lack error handling (checks after query ends)
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

function findMissingErrorHandling(content, filePath) {
  const violations = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find Supabase queries with error destructuring
    if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin/.test(line)) {
      // Find where the query chain ends (semicolon)
      let queryEndLine = i;
      let foundSemicolon = false;

      for (let j = i; j < Math.min(i + 20, lines.length); j++) {
        if (lines[j].trim().endsWith(';')) {
          queryEndLine = j;
          foundSemicolon = true;
          break;
        }
      }

      if (!foundSemicolon) continue; // Skip if we can't find the end

      // Check next 8 lines AFTER the semicolon for error handling
      const afterQuery = lines.slice(queryEndLine + 1, queryEndLine + 9).join('\n');

      // Skip if error handling exists
      if (/if\s*\(error\)|error\s*&&/.test(afterQuery)) {
        continue;
      }

      // Skip if this is inside a try-catch that handles errors
      // (check if there's a try block before and catch after)
      let hasTryCatch = false;
      for (let k = Math.max(0, i - 20); k < i; k++) {
        if (/try\s*\{/.test(lines[k])) {
          // Look for catch after query
          for (let m = queryEndLine + 1; m < Math.min(queryEndLine + 30, lines.length); m++) {
            if (/catch\s*\(/.test(lines[m])) {
              hasTryCatch = true;
              break;
            }
          }
          break;
        }
      }

      if (hasTryCatch) continue;

      violations.push({
        file: filePath,
        queryStartLine: i + 1,
        queryEndLine: queryEndLine + 1,
        queryPreview: lines.slice(i, Math.min(i + 3, lines.length)).join(' ').substring(0, 100),
      });
    }
  }

  return violations;
}

function main() {
  const files = findFiles();
  const allViolations = [];

  console.log(`Analyzing ${files.length} files for missing error handling...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if no Supabase usage
    if (!content.includes('supabaseAdmin') && !content.includes('supabase')) {
      return;
    }

    const violations = findMissingErrorHandling(content, filePath);
    allViolations.push(...violations);
  });

  if (allViolations.length > 0) {
    console.log(`Found ${allViolations.length} queries missing error handling:\n`);
    allViolations.slice(0, 30).forEach((v, i) => {
      console.log(`${i + 1}. ${v.file}:${v.queryStartLine}-${v.queryEndLine}`);
      console.log(`   Query: ${v.queryPreview}...`);
    });
    if (allViolations.length > 30) {
      console.log(`\n... and ${allViolations.length - 30} more`);
    }

    // Group by file
    const byFile = {};
    allViolations.forEach(v => {
      if (!byFile[v.file]) byFile[v.file] = [];
      byFile[v.file].push(v);
    });

    console.log(`\n\nFiles needing fixes (${Object.keys(byFile).length} files):\n`);
    Object.keys(byFile).slice(0, 20).forEach((file, i) => {
      console.log(`${i + 1}. ${file} (${byFile[file].length} violation${byFile[file].length > 1 ? 's' : ''})`);
    });
  } else {
    console.log('No violations found!');
  }
}

if (require.main === module) {
  main();
}

module.exports = { findMissingErrorHandling };




