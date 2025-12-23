#!/usr/bin/env node

/**
 * Precise Database Pattern Fixer
 * Targets specific violation patterns that can be safely auto-fixed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to find and fix
const PATTERNS = {
  // Pattern 1: throw new Error('Database connection not available')
  throwDbConnection: {
    find: /if\s*\(!supabaseAdmin\)\s*\{\s*throw\s+new\s+Error\(['"]Database connection not available['"]\)/g,
    replace: (match, filePath) => {
      const hasApiErrorHandler = fs.readFileSync(filePath, 'utf8').includes('ApiErrorHandler');
      if (hasApiErrorHandler) {
        return `if (!supabaseAdmin) {
      logger.error('[${getContext(filePath)}] Database connection not available');
      return null;`;
      }
      return match; // Skip if no ApiErrorHandler import
    },
  },

  // Pattern 2: Missing error handling for Supabase queries
  missingErrorHandling: {
    find: /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin[^}]*\n(?!\s*if\s*\(error\))/g,
    // This is complex - need to check line by line
  },

  // Pattern 3: .catch() chaining on Supabase queries
  catchChaining: {
    find: /\.(from|select|insert|update|delete)\([^)]*\)[^}]*\.catch\(/g,
  },
};

function getContext(filePath) {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1].replace(/\.(ts|tsx|js|jsx)$/, '');
  const dir = parts[parts.length - 2] || '';
  return `${dir}/${fileName}`;
}

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

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];

  // Check for .catch() chaining
  if (/\.(from|select|insert|update|delete)\([^)]*\)[^}]*\.catch\(/.test(content)) {
    violations.push({
      type: 'catch-chaining',
      file: filePath,
      fixable: false, // Too complex to auto-fix safely
    });
  }

  // Check for throw new Error('Database connection not available')
  if (/if\s*\(!supabaseAdmin\)\s*\{\s*throw\s+new\s+Error\(['"]Database connection not available['"]\)/.test(content)) {
    violations.push({
      type: 'throw-db-connection',
      file: filePath,
      fixable: true,
    });
  }

  // Check for missing error handling (const { data, error } = await without if (error))
  const errorPattern = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin/g;
  const errorHandlingPattern = /if\s*\(error\)|error\s*&&/g;

  let match;
  const errorMatches = [];
  while ((match = errorPattern.exec(content)) !== null) {
    errorMatches.push(match.index);
  }

  // Check if each error match has corresponding error handling
  const lines = content.split('\n');
  errorMatches.forEach(matchIndex => {
    const matchLine = content.substring(0, matchIndex).split('\n').length - 1;
    const nextLines = lines.slice(matchLine, matchLine + 5).join('\n');

    if (!errorHandlingPattern.test(nextLines)) {
      violations.push({
        type: 'missing-error-handling',
        file: filePath,
        line: matchLine + 1,
        fixable: false, // Context-dependent, need manual review
      });
    }
  });

  return violations;
}

function main() {
  const files = findFiles();
  const allViolations = [];

  console.log(`Analyzing ${files.length} files...\n`);

  files.forEach(file => {
    const violations = analyzeFile(file);
    violations.forEach(v => {
      allViolations.push(v);
    });
  });

  // Group by type
  const byType = {};
  allViolations.forEach(v => {
    if (!byType[v.type]) byType[v.type] = [];
    byType[v.type].push(v);
  });

  console.log('Violations found:\n');
  Object.keys(byType).forEach(type => {
    console.log(`${type}: ${byType[type].length} violations`);
    if (byType[type].some(v => v.fixable)) {
      console.log(`  → ${byType[type].filter(v => v.fixable).length} auto-fixable`);
    }
  });

  console.log('\n--- Fixable violations ---\n');
  const fixable = allViolations.filter(v => v.fixable);
  fixable.forEach((v, i) => {
    console.log(`${i + 1}. ${v.file}`);
  });

  console.log(`\nTotal: ${allViolations.length} violations, ${fixable.length} fixable`);
}

if (require.main === module) {
  main();
}

module.exports = { analyzeFile, findFiles };
