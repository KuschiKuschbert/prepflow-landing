#!/usr/bin/env node

/**
 * Precise Database Violation Analyzer
 * Analyzes actual code structure to find real violations
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

function analyzeFile(content, filePath) {
  const violations = [];
  const lines = content.split('\n');

  // Check 1: .catch() chaining on Supabase queries (actual chaining, not background ops)
  const catchChainingPattern = /(supabaseAdmin|supabase)\s*\.(from|select|insert|update|delete)\([^)]*\)[^}]*\.catch\(/;
  if (catchChainingPattern.test(content)) {
    violations.push({ type: 'catch-chaining', file: filePath });
  }

  // Check 2: Ignored errors - const { data, error } = await but no if (error) check
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Find Supabase queries with error destructuring
    if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+(supabaseAdmin|supabase)/.test(line)) {
      // Find where query ends (semicolon)
      let queryEndLine = i;
      for (let j = i; j < Math.min(i + 20, lines.length); j++) {
        if (lines[j].trim().endsWith(';')) {
          queryEndLine = j;
          break;
        }
      }

      // Check next 10 lines after query for error handling
      const afterQuery = lines.slice(queryEndLine + 1, queryEndLine + 11).join('\n');

      // Skip if inside try-catch
      let hasTryCatch = false;
      for (let k = Math.max(0, i - 30); k < i; k++) {
        if (/try\s*\{/.test(lines[k])) {
          for (let m = queryEndLine + 1; m < Math.min(queryEndLine + 50, lines.length); m++) {
            if (/catch\s*\(/.test(lines[m])) {
              hasTryCatch = true;
              break;
            }
          }
          break;
        }
      }

      if (!hasTryCatch && !/if\s*\(error\)|error\s*&&/.test(afterQuery)) {
        violations.push({
          type: 'ignored-error',
          file: filePath,
          line: i + 1,
          queryEndLine: queryEndLine + 1,
        });
      }
    }
  }

  // Check 3: console.error usage (should use logger.error)
  if (/console\.error\(/.test(content)) {
    const consoleErrorLines = [];
    lines.forEach((line, idx) => {
      if (/console\.error\(/.test(line)) {
        consoleErrorLines.push(idx + 1);
      }
    });
    violations.push({
      type: 'console-error',
      file: filePath,
      lines: consoleErrorLines,
    });
  }

  // Check 4: Missing ApiErrorHandler for error responses
  const hasErrorResponse = /NextResponse\.json\(.*error/i.test(content);
  const hasApiErrorHandler = /ApiErrorHandler/.test(content);
  if (hasErrorResponse && !hasApiErrorHandler && /app\/api/.test(filePath)) {
    violations.push({ type: 'missing-api-error-handler', file: filePath });
  }

  return violations;
}

function main() {
  const files = findFiles();
  const allViolations = [];

  console.log(`Analyzing ${files.length} files for database pattern violations...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if no Supabase usage
    if (!content.includes('supabaseAdmin') && !content.includes('supabase')) {
      return;
    }

    const violations = analyzeFile(content, filePath);
    violations.forEach(v => {
      v.file = filePath;
      allViolations.push(v);
    });
  });

  // Group by type
  const byType = {};
  allViolations.forEach(v => {
    if (!byType[v.type]) byType[v.type] = [];
    byType[v.type].push(v);
  });

  console.log('Violations found by type:\n');
  Object.keys(byType).forEach(type => {
    console.log(`${type}: ${byType[type].length} violations`);
  });

  console.log('\n--- Detailed violations ---\n');

  // Show catch-chaining
  if (byType['catch-chaining']) {
    console.log('Catch chaining violations:');
    byType['catch-chaining'].forEach((v, i) => {
      console.log(`${i + 1}. ${v.file}`);
    });
    console.log('');
  }

  // Show ignored errors (first 20)
  if (byType['ignored-error']) {
    console.log(`Ignored errors (showing first 20 of ${byType['ignored-error'].length}):`);
    byType['ignored-error'].slice(0, 20).forEach((v, i) => {
      console.log(`${i + 1}. ${v.file}:${v.line} (query ends at ${v.queryEndLine})`);
    });
    if (byType['ignored-error'].length > 20) {
      console.log(`... and ${byType['ignored-error'].length - 20} more`);
    }
    console.log('');
  }

  // Show console.error usage
  if (byType['console-error']) {
    console.log(`Console.error usage (${byType['console-error'].length} files):`);
    byType['console-error'].slice(0, 10).forEach((v, i) => {
      console.log(`${i + 1}. ${v.file} (lines: ${v.lines.join(', ')})`);
    });
    if (byType['console-error'].length > 10) {
      console.log(`... and ${byType['console-error'].length - 10} more`);
    }
    console.log('');
  }

  // Show missing ApiErrorHandler
  if (byType['missing-api-error-handler']) {
    console.log(`Missing ApiErrorHandler (${byType['missing-api-error-handler'].length} files):`);
    byType['missing-api-error-handler'].slice(0, 10).forEach((v, i) => {
      console.log(`${i + 1}. ${v.file}`);
    });
    if (byType['missing-api-error-handler'].length > 10) {
      console.log(`... and ${byType['missing-api-error-handler'].length - 10} more`);
    }
  }

  console.log(`\nTotal: ${allViolations.length} violations found`);
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile };


