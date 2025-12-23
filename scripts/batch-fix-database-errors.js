#!/usr/bin/env node

/**
 * Batch fix common database error patterns
 * Fixes: if (!supabaseAdmin) throw new Error('Database connection not available')
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PATTERN = /if\s*\(!supabaseAdmin\)\s*throw\s+new\s+Error\(['"]Database connection not available['"]\);/g;
const REPLACEMENT = `if (!supabaseAdmin) {
    logger.error('[API] Database connection not available');
    throw ApiErrorHandler.createError('Database connection not available', 'DATABASE_ERROR', 500);
  }`;

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
        if (PATTERN.test(content)) {
          files.push(fullPath);
        }
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;

  // Replace the pattern
  content = content.replace(PATTERN, REPLACEMENT);

  // Add imports if needed
  const needsLogger = /logger\.error/.test(content) && !/import.*logger.*from/.test(content);
  const needsApiErrorHandler = /ApiErrorHandler/.test(content) && !/import.*ApiErrorHandler.*from/.test(content);

  if (needsLogger || needsApiErrorHandler) {
    const imports = [];
    if (needsLogger) imports.push("import { logger } from '@/lib/logger';");
    if (needsApiErrorHandler) imports.push("import { ApiErrorHandler } from '@/lib/api-error-handler';");

    // Find the last import statement
    const importRegex = /^import\s+.*from\s+['"].*['"];$/gm;
    const matches = [...content.matchAll(importRegex)];

    if (matches.length > 0) {
      const lastMatch = matches[matches.length - 1];
      const insertPos = lastMatch.index + lastMatch[0].length;
      content = content.slice(0, insertPos) + '\n' + imports.join('\n') + content.slice(insertPos);
    } else {
      // No imports, add at top after any comments
      const commentEnd = content.match(/^\/\*\*[\s\S]*?\*\/\s*\n/) || content.match(/^\/\/.*\n/);
      const insertPos = commentEnd ? commentEnd.index + commentEnd[0].length : 0;
      content = content.slice(0, insertPos) + imports.join('\n') + '\n' + content.slice(insertPos);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--write');

  console.log('🔍 Finding files with database error pattern...\n');

  const files = findFiles();
  console.log(`📊 Found ${files.length} files to fix\n`);

  if (dryRun) {
    files.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });
    console.log(`\n💡 Run with --write to apply fixes`);
  } else {
    let fixed = 0;
    files.forEach(file => {
      if (fixFile(file)) {
        console.log(`✅ Fixed: ${file}`);
        fixed++;
      }
    });
    console.log(`\n✨ Fixed ${fixed} files`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, fixFile };



