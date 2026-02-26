#!/usr/bin/env node

/**
 * Dead Code Fix Module
 * Auto-removes unused exports using ts-prune
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.next/,
  /out/,
  /build/,
  /dist/,
  /\.test\.tsx?$/,
  /\.spec\.tsx?$/,
  /\.d\.ts$/,
  /\/types\//,
  /page\.tsx$/,
  /layout\.tsx$/,
  /loading\.tsx$/,
  /error\.tsx$/,
  /not-found\.tsx$/,
  /route\.ts$/,
  /proxy\.ts$/,
  /next\.config\./,
  /playwright\.config\./,
  /curbos/,
];

function shouldExcludeFile(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  return EXCLUDE_PATTERNS.some(p => p.test(normalized));
}

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
 * Remove unused export from file.
 * CONSERVATIVE: Only handles barrel file re-exports (export { X } from '...').
 * Never removes multi-line exports (interfaces, types, functions) - too error-prone.
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

  // ONLY process barrel files (index.ts/tsx) - safest for re-export removal
  const normalizedPath = filePath.replace(/\\/g, '/');
  if (!/\/index\.tsx?$/.test(normalizedPath)) {
    return false;
  }

  // Skip critical modules that ts-prune may misreport (used via API routes, demo-mode, etc.)
  const skipPaths = [
    'lib/populate-helpers/index',
    'lib/qr-codes/index',
    'hooks/utils/temperatureWarningChecks/index',
  ];
  if (skipPaths.some(p => normalizedPath.includes(p))) {
    return false;
  }

  // ONLY handle re-export lines: export { X } from '...' or export type { X } from '...'
  const reExportMatch = targetLine.match(
    /export\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"][^'"]+['"]/,
  );
  if (!reExportMatch || !targetLine.includes(exportName)) {
    return false;
  }

  const exports = reExportMatch[1].split(',').map(e =>
    e
      .trim()
      .split(/\s+as\s+/)[0]
      .trim(),
  );
  const newExports = exports.filter(e => e !== exportName);

  if (newExports.length === exports.length) {
    return false; // exportName not in list
  }

  let modified = false;
  const newLines = [...lines];

  if (newExports.length === 0) {
    newLines.splice(lineNum - 1, 1);
    modified = true;
  } else {
    const prefix = targetLine.includes('export type') ? 'export type ' : 'export ';
    const fromPart = targetLine.match(/\s+from\s+['"][^'"]+['"]/)?.[0] ?? '';
    const newLine = `${prefix}{ ${newExports.join(', ')} }${fromPart}`;
    newLines[lineNum - 1] = newLine;
    modified = true;
  }

  if (modified) {
    writeFile(filePath, newLines.join('\n'));
    return true;
  }

  return false;
}

/**
 * Parse ts-prune output
 * Format: filePath:line - exportName
 */
function parseTsPruneOutput(output) {
  const lines = output.split('\n').filter(line => line.trim());
  const unusedExports = [];

  for (const line of lines) {
    if (!line.trim() || line.includes('Found') || line.includes('unused')) {
      continue;
    }
    // Skip "used in module" - not dead code
    if (line.includes('(used in module)')) {
      continue;
    }

    const match = line.match(/^(.+?):(\d+) - (.+)$/);
    if (match) {
      const [, filePath, lineNum, exportName] = match;
      const fullPath = path.resolve(process.cwd(), filePath);
      if (shouldExcludeFile(fullPath)) {
        continue;
      }
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
