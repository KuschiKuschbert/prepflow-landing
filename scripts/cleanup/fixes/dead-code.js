#!/usr/bin/env node

/**
 * Dead Code Fix Module
 * Auto-removes unused exports using ts-prune
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Read file content
 */
function readFile(filePath) {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Write file content
 */
function writeFile(filePath, content) {
  const fullPath = path.resolve(process.cwd(), filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
}

/**
 * Remove unused export from file
 */
function removeUnusedExport(filePath, lineNum, exportName) {
  const content = readFile(filePath);
  if (!content) {
    return false;
  }

  const lines = content.split('\n');
  const targetLine = lines[lineNum - 1]; // lineNum is 1-indexed

  if (!targetLine) {
    return false;
  }

  // Handle different export patterns
  let modified = false;
  let newLines = [...lines];

  // Never remove export function/async function - entry points, often multi-line
  if (/export\s+(async\s+)?function\s+/i.test(targetLine)) {
    return false;
  }

  // Never remove export const X = when value spans multiple lines (z.object, template literal)
  if (/export\s+const\s+\w+\s*=/.test(targetLine)) {
    if (/\s*=\s*z\.object\s*\(\{/.test(targetLine) || /\s*=\s*`/.test(targetLine)) {
      return false;
    }
  }

  // Pattern 1: export const/function/class/type/interface Name
  if (targetLine.includes(`export `) && targetLine.includes(exportName)) {
    // Check if it's a single-line export
    if (targetLine.trim().startsWith('export ')) {
      // Remove the line entirely
      newLines.splice(lineNum - 1, 1);
      modified = true;
    } else {
      // Multi-line export - more complex, skip for now
      // Could be enhanced with AST parsing
    }
  }

  // Pattern 2: export { name } from './file'
  if (targetLine.includes(`export {`) && targetLine.includes(exportName)) {
    // Check if it's the only export in the braces
    const exportMatch = targetLine.match(/export\s*\{([^}]+)\}/);
    if (exportMatch) {
      const exports = exportMatch[1].split(',').map(e => e.trim());
      if (exports.length === 1 && exports[0] === exportName) {
        // Only export, remove entire line
        newLines.splice(lineNum - 1, 1);
        modified = true;
      } else {
        // Multiple exports, remove just this one
        const newExports = exports.filter(e => e !== exportName);
        if (newExports.length > 0) {
          const newLine = targetLine.replace(
            /export\s*\{[^}]+\}/,
            `export { ${newExports.join(', ')} }`,
          );
          newLines[lineNum - 1] = newLine;
          modified = true;
        } else {
          // All exports removed, remove entire line
          newLines.splice(lineNum - 1, 1);
          modified = true;
        }
      }
    }
  }

  if (modified) {
    writeFile(filePath, newLines.join('\n'));
    return true;
  }

  return false;
}

/**
 * Parse ts-prune output
 */
function parseTsPruneOutput(output) {
  const lines = output.split('\n').filter(line => line.trim());
  const unusedExports = [];

  for (const line of lines) {
    if (!line.trim() || line.includes('Found') || line.includes('unused')) {
      continue;
    }

    const match = line.match(/^(.+?):(\d+):(.+)$/);
    if (match) {
      const [, filePath, lineNum, exportName] = match;
      unusedExports.push({
        file: filePath,
        line: parseInt(lineNum, 10),
        export: exportName,
      });
    }
  }

  return unusedExports;
}

/**
 * Fix dead code by removing unused exports
 */
async function fixDeadCode(files = null) {
  const changes = [];
  const errors = [];

  // Check if tsconfig.json exists
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    return {
      fixed: false,
      changes,
      errors: [{ file: 'tsconfig.json', error: 'TypeScript project required' }],
    };
  }

  try {
    // Get unused exports from ts-prune
    const command = 'npx ts-prune --project tsconfig.json 2>/dev/null || true';
    const output = execSync(command, { encoding: 'utf-8', cwd: process.cwd() });

    if (!output || output.trim().length === 0) {
      return {
        fixed: true,
        changes: [],
        errors: [],
      };
    }

    const unusedExports = parseTsPruneOutput(output);

    // Group by file to process efficiently
    const exportsByFile = {};
    for (const unused of unusedExports) {
      if (!exportsByFile[unused.file]) {
        exportsByFile[unused.file] = [];
      }
      exportsByFile[unused.file].push(unused);
    }

    // Process each file
    for (const [filePath, exports] of Object.entries(exportsByFile)) {
      try {
        // Sort by line number (descending) to avoid line number shifts
        exports.sort((a, b) => b.line - a.line);

        let fileModified = false;
        for (const unused of exports) {
          const removed = removeUnusedExport(unused.file, unused.line, unused.export);
          if (removed) {
            fileModified = true;
          }
        }

        if (fileModified) {
          changes.push({
            file: filePath,
            changes: `Removed ${exports.length} unused export(s)`,
          });
        }
      } catch (error) {
        errors.push({
          file: filePath,
          error: error.message,
        });
      }
    }

    return {
      fixed: errors.length === 0,
      changes,
      errors,
    };
  } catch (error) {
    return {
      fixed: false,
      changes,
      errors: [{ file: 'all', error: error.message }],
    };
  }
}

module.exports = {
  name: 'dead-code',
  fix: fixDeadCode,
};
