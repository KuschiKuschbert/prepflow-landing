#!/usr/bin/env node

/**
 * Fix throw error; patterns - replace with ApiErrorHandler.fromSupabaseError
 *
 * Usage:
 *   node scripts/fix-throw-error-patterns.js [--write]
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
        const content = fs.readFileSync(fullPath, 'utf8');
        if (/throw\s+error;/.test(content) || /throw\s+\w+Error;/.test(content)) {
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

  // Replace throw error; with ApiErrorHandler (only for database errors)
  // Pattern: if (error) throw error; or throw error; after Supabase query
  content = content.replace(/if\s*\(error\)\s*throw\s+error;/g, (match) => {
    return match.replace('throw error;', 'throw ApiErrorHandler.fromSupabaseError(error, 500);');
  });

  // Replace standalone throw error; after Supabase queries (be more careful here)
  // Only replace if it's in a context that suggests it's a database error
  const lines = content.split('\n');
  let needsApiErrorHandler = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if this is throw error; and previous lines suggest Supabase query
    if (/^\s*throw\s+error;/.test(line)) {
      // Check previous 5 lines for Supabase query pattern
      const context = lines.slice(Math.max(0, i - 5), i).join('\n');
      if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabase/.test(context) ||
          /await\s+supabase/.test(context)) {
        lines[i] = line.replace('throw error;', 'throw ApiErrorHandler.fromSupabaseError(error, 500);');
        needsApiErrorHandler = true;
      }
    }
    // Also handle throw variableError; patterns
    if (/^\s*throw\s+(\w+Error);/.test(line)) {
      const errorVar = line.match(/throw\s+(\w+Error);/)[1];
      const context = lines.slice(Math.max(0, i - 5), i).join('\n');
      if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabase/.test(context) ||
          new RegExp(`const\\s+\\{\\s*.*\\s*,\\s*error:\\s*${errorVar}`).test(context)) {
        lines[i] = line.replace(`throw ${errorVar};`, `throw ApiErrorHandler.fromSupabaseError(${errorVar}, 500);`);
        needsApiErrorHandler = true;
      }
    }
  }

  content = lines.join('\n');

  // Add ApiErrorHandler import if needed
  if (needsApiErrorHandler && !content.includes("import { ApiErrorHandler }")) {
    const lastImport = content.lastIndexOf('import ');
    const nextLine = content.indexOf('\n', lastImport);
    content = content.slice(0, nextLine + 1) +
      "import { ApiErrorHandler } from '@/lib/api-error-handler';\n" +
      content.slice(nextLine + 1);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--write');

  console.log('🔍 Finding files with throw error; patterns...\n');

  const files = findFiles();
  console.log(`📊 Found ${files.length} files\n`);

  if (shouldFix) {
    let fixed = 0;
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
      if (fixFile(file)) {
        console.log(`   ✅ Fixed`);
        fixed++;
      } else {
        console.log(`   ⚠️  Needs manual review`);
      }
    });
    console.log(`\n✨ Fixed ${fixed} files`);
  } else {
    files.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
    console.log(`\n💡 Run with --write to apply fixes`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { findFiles, fixFile };



