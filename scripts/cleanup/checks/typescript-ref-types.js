#!/usr/bin/env node

/**
 * TypeScript Ref Types Check Module
 * Validates RefObject patterns
 * Source: core.mdc (TypeScript Ref Types)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

function findFiles() {
  const files = [];
  const searchDirs = ['app', 'components', 'hooks', 'lib'];

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== '.next'
        ) {
          walkDir(fullPath);
        }
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function checkRefTypes(content, filePath) {
  const violations = [];
  const lines = content.split(/\r?\n/);

  // Check for incorrect RefObject patterns in interfaces
  const interfaceRefPattern = /interface\s+\w+.*?\{[\s\S]*?RefObject<(\w+)>\s*[;:]/g;
  let match;
  while ((match = interfaceRefPattern.exec(content)) !== null) {
    const type = match[1];
    if (type && !type.includes('null')) {
      const lineNum = content.substring(0, match.index).split(/\r?\n/).length;
      violations.push({
        line: lineNum,
        type,
      });
    }
  }

  return violations;
}

/**
 * Check TypeScript ref types
 */
async function checkTypeScriptRefTypes(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('typescript-ref-types');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = checkRefTypes(content, file);

    for (const violation of found) {
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          line: violation.line,
          message: `RefObject<${violation.type}> should be RefObject<${violation.type} | null>`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (Code Quality Standards) and core.mdc (TypeScript Ref Types)',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ All ref types correct'
        : `❌ ${violations.length} incorrect ref type(s) found`,
  };
}

module.exports = {
  name: 'typescript-ref-types',
  check: checkTypeScriptRefTypes,
};
