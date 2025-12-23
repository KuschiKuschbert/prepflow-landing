#!/usr/bin/env node

/**
 * Fix .catch() Chaining Violations
 * Replaces .catch() chaining with try-catch blocks for background operations
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

function fixCatchChaining(content, filePath) {
  // Pattern 1: functionCall().catch(err => { logger.error(...); });
  // Replace with: (async () => { try { await functionCall(); } catch (err) { logger.error(...); } })();

  const pattern1 = /(\s+)([a-zA-Z_$][a-zA-Z0-9_$]*\([^)]*\))\.catch\(err\s*=>\s*\{([^}]+logger\.error\([^}]+\})\s*\}\);/g;

  let changed = false;
  let newContent = content;

  // Find all matches
  const matches = [];
  let match;
  while ((match = pattern1.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      indent: match[1],
      functionCall: match[2],
      errorHandler: match[3],
      index: match.index,
    });
  }

  // Replace from end to start to preserve indices
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const replacement = `${m.indent}(async () => {
${m.indent}  try {
${m.indent}    await ${m.functionCall};
${m.indent}  } catch (err) {
${m.indent}    ${m.errorHandler}
${m.indent}  }
${m.indent}})();`;

    newContent = newContent.substring(0, m.index) + replacement + newContent.substring(m.index + m.fullMatch.length);
    changed = true;
  }

  return { changed, content: newContent };
}

function main() {
  const files = findFiles();
  const fixes = [];

  console.log(`Checking ${files.length} files for .catch() chaining...\n`);

  files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if no .catch() usage
    if (!content.includes('.catch(')) {
      return;
    }

    // Only process if it's a background operation pattern (not Supabase query chaining)
    if (!/trigger.*Sync|invalidate.*Cache|Promise\.all.*\.catch/.test(content)) {
      return;
    }

    const fix = fixCatchChaining(content, filePath);
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
    console.log('No .catch() chaining violations found (or pattern too complex for auto-fix).');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixCatchChaining };



