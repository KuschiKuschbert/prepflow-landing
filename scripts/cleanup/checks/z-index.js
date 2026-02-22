#!/usr/bin/env node

/**
 * Z-Index Check Module
 * Validates z-index values follow Cyber Carrot hierarchy
 * Source: design.mdc (Z-Index Hierarchy)
 *
 * Documented levels: 80, 79, 75, 70, 65, 60, 55, 50, 40, 30
 * Modals: z-[80], Search: z-[75], FAB: z-[70], Drawer: z-[65], Sidebar: z-[60], etc.
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

// design.mdc hierarchy + common low values for nested stacking (z-0, z-10, z-20)
const VALID_Z_INDICES = new Set([80, 79, 75, 70, 65, 60, 55, 50, 40, 30, 20, 10, 0]);

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walkDir(fullPath);
        }
      } else if (/\.(tsx|jsx|css)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function extractZIndexViolations(content) {
  const violations = [];

  // Match Tailwind z-index: z-[NN] or z-NN (e.g. z-50)
  const zBracketPattern = /z-\[(\d+)\]/g;
  const zNumberPattern = /\bz-(\d+)\b/g;

  let match;
  while ((match = zBracketPattern.exec(content)) !== null) {
    const value = parseInt(match[1], 10);
    if (!VALID_Z_INDICES.has(value)) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      violations.push({ line: lineNumber, value, match: match[0] });
    }
  }

  while ((match = zNumberPattern.exec(content)) !== null) {
    const value = parseInt(match[1], 10);
    if (!VALID_Z_INDICES.has(value)) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      violations.push({ line: lineNumber, value, match: match[0] });
    }
  }

  return violations;
}

/**
 * Check z-index standards
 */
async function checkZIndex(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('z-index') || {
    severity: 'warning',
    fixable: false,
    source: 'design.mdc#z-index-hierarchy',
  };

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = extractZIndexViolations(content);

    for (const v of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: v.line,
          message: `Z-index ${v.match} not in hierarchy. Valid: 80,79,75,70,65,60,55,50,40,30,20,10,0`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See design.mdc (Z-Index Hierarchy)',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All z-index values follow hierarchy'
        : `❌ ${violations.length} z-index violation(s) found`,
  };
}

module.exports = {
  name: 'z-index',
  check: checkZIndex,
};
