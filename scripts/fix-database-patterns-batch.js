#!/usr/bin/env node

/**
 * Batch Database Patterns Fix Script
 * Identifies files with database pattern violations and provides prioritized fix suggestions
 *
 * Usage:
 *   node scripts/fix-database-patterns-batch.js [--fix] [--limit=N]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to detect and fix
const PATTERNS = {
  catchChaining: /\.from\([^)]*\)[^}]*\.catch\(/,
  throwNewError: /throw\s+new\s+Error\(/,
  consoleError: /console\.error\(/,
  missingErrorCheck: /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await[^}]*if\s*\(!data\)/,
  missingLogger: /if\s*\(error\)[^}]*throw[^}]*logger/,
};

function findFilesWithViolations() {
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
          const violations = detectViolations(content, fullPath);
          if (violations.length > 0) {
            files.push({ path: fullPath, violations, priority: calculatePriority(violations) });
          }
        }
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files.sort((a, b) => b.priority - a.priority);
}

function detectViolations(content, filePath) {
  const violations = [];

  if (PATTERNS.catchChaining.test(content)) {
    violations.push({ type: 'catch-chaining', fixable: false, description: 'Replace .catch() with try-catch' });
  }

  if (PATTERNS.throwNewError.test(content)) {
    violations.push({ type: 'throw-new-error', fixable: true, description: 'Replace with ApiErrorHandler.createError' });
  }

  if (PATTERNS.consoleError.test(content)) {
    violations.push({ type: 'console-error', fixable: true, description: 'Replace with logger.error()' });
  }

  // Count Supabase queries without error handling
  const supabaseQueries = (content.match(/await\s+supabase[^}]*\.(from|select|insert|update|delete)\(/g) || []).length;
  const errorChecks = (content.match(/if\s*\(error\)/g) || []).length;
  if (supabaseQueries > errorChecks) {
    violations.push({
      type: 'missing-error-handling',
      fixable: false,
      description: `Missing error handling (${supabaseQueries} queries, ${errorChecks} checks)`
    });
  }

  return violations;
}

function calculatePriority(violations) {
  let priority = 0;
  violations.forEach(v => {
    if (v.type === 'catch-chaining') priority += 10; // High priority
    if (v.type === 'missing-error-handling') priority += 8;
    if (v.type === 'throw-new-error') priority += 5;
    if (v.type === 'console-error') priority += 3;
  });
  return priority;
}

function autoFixFile(filePath, violations) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix console.error → logger.error
  if (violations.some(v => v.type === 'console-error')) {
    const consoleErrorRegex = /console\.error\(/g;
    if (consoleErrorRegex.test(content)) {
      content = content.replace(/console\.error\(/g, 'logger.error(');
      changed = true;

      // Add logger import if missing
      if (!content.includes("import { logger }")) {
        const lastImport = content.lastIndexOf('import ');
        const nextLine = content.indexOf('\n', lastImport);
        content = content.slice(0, nextLine + 1) +
          "import { logger } from '@/lib/logger';\n" +
          content.slice(nextLine + 1);
      }
    }
  }

  // Fix throw new Error → ApiErrorHandler
  if (violations.some(v => v.type === 'throw-new-error')) {
    const throwErrorRegex = /throw\s+new\s+Error\((['"`])([^'"`]+)\1\)/g;
    content = content.replace(throwErrorRegex, (match, quote, message) => {
      return `throw ApiErrorHandler.createError(${quote}${message}${quote}, 'DATABASE_ERROR', 500)`;
    });

    if (throwErrorRegex.test(content)) {
      changed = true;

      // Add ApiErrorHandler import if missing
      if (!content.includes("import { ApiErrorHandler }")) {
        const lastImport = content.lastIndexOf('import ');
        const nextLine = content.indexOf('\n', lastImport);
        content = content.slice(0, nextLine + 1) +
          "import { ApiErrorHandler } from '@/lib/api-error-handler';\n" +
          content.slice(nextLine + 1);
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const limitArg = args.find(arg => arg.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  console.log('🔍 Scanning for database pattern violations...\n');

  const files = findFilesWithViolations();
  const totalViolations = files.reduce((sum, f) => sum + f.violations.length, 0);

  console.log(`📊 Found ${files.length} files with ${totalViolations} violations\n`);

  if (limit) {
    files.splice(limit);
    console.log(`📌 Processing top ${files.length} files by priority\n`);
  }

  let fixed = 0;
  let needsManual = 0;

  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file.path}`);
    console.log(`   Priority: ${file.priority} | Violations: ${file.violations.length}`);
    file.violations.forEach(v => {
      const icon = v.fixable ? '✅' : '⚠️';
      console.log(`   ${icon} ${v.type}: ${v.description}`);
    });

    if (shouldFix) {
      const fixableViolations = file.violations.filter(v => v.fixable);
      if (fixableViolations.length > 0) {
        if (autoFixFile(file.path, fixableViolations)) {
          console.log(`   ✨ Auto-fixed ${fixableViolations.length} violation(s)`);
          fixed++;
        }
      } else {
        console.log(`   📝 Needs manual fixing`);
        needsManual++;
      }
    }
    console.log('');
  });

  if (shouldFix) {
    console.log(`\n✅ Auto-fixed: ${fixed} files`);
    console.log(`📝 Needs manual: ${needsManual} files`);
    console.log(`\n💡 Run 'npm run codemod:console:write' to fix remaining console.error issues`);
  } else {
    console.log(`\n💡 Run with --fix to auto-fix violations`);
    console.log(`💡 Run with --limit=N to process top N files`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFilesWithViolations, detectViolations, autoFixFile };




