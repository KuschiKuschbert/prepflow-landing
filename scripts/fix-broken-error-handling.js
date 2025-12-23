#!/usr/bin/env node

/**
 * Fix Broken Error Handling
 * Fixes files where error handling was inserted in the middle of query chains
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

function fixBrokenErrorHandling(content) {
  // Pattern: const { data, error } = await supabaseAdmin\n  if (error) { ... }\n    .from(
  // This is broken - error handling is in the middle of the query chain

  const brokenPattern = /const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin\s*\n\s*if\s*\(error\)\s*\{[^}]*\}\s*\n\s*\.from\(/g;

  if (!brokenPattern.test(content)) {
    return { changed: false, content };
  }

  const lines = content.split('\n');
  const newLines = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is the start of a broken pattern
    if (/const\s+\{\s*data\s*,\s*error\s*\}\s*=\s*await\s+supabaseAdmin/.test(line)) {
      // Collect the query lines (until we find a semicolon)
      const queryLines = [line];
      let j = i + 1;
      let foundErrorBlock = false;
      let errorBlockLines = [];

      // Look for the broken error handling block
      if (j < lines.length && /if\s*\(error\)/.test(lines[j])) {
        foundErrorBlock = true;
        let braceCount = 0;
        while (j < lines.length) {
          const currentLine = lines[j];
          errorBlockLines.push(currentLine);
          braceCount += (currentLine.match(/\{/g) || []).length;
          braceCount -= (currentLine.match(/\}/g) || []).length;
          j++;
          if (braceCount === 0 && currentLine.includes('}')) {
            break;
          }
        }
      }

      // Now collect the actual query lines (until semicolon)
      while (j < lines.length) {
        const currentLine = lines[j];
        queryLines.push(currentLine);
        if (currentLine.trim().endsWith(';')) {
          j++;
          break;
        }
        j++;
      }

      // Reconstruct: query first, then error handling
      newLines.push(...queryLines);
      if (foundErrorBlock && errorBlockLines.length > 0) {
        // Add error handling after the query
        newLines.push('');
        newLines.push(...errorBlockLines);
      }

      i = j;
      continue;
    }

    newLines.push(line);
    i++;
  }

  return { changed: true, content: newLines.join('\n') };
}

function main() {
  const files = findFiles();
  const fixes = [];

  console.log(`Checking ${files.length} files for broken error handling...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if no Supabase usage
    if (!content.includes('supabaseAdmin') && !content.includes('supabase')) {
      return;
    }

    const fix = fixBrokenErrorHandling(content);
    if (fix.changed) {
      fixes.push(filePath);
      fs.writeFileSync(filePath, fix.content, 'utf8');
    }
  });

  if (fixes.length > 0) {
    console.log(`✓ Fixed ${fixes.length} files:\n`);
    fixes.forEach((file, i) => {
      console.log(`${i + 1}. ${file}`);
    });
  } else {
    console.log('No broken error handling patterns found.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixBrokenErrorHandling };




