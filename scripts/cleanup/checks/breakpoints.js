#!/usr/bin/env node

/**
 * Breakpoint Check Module
 * Validates custom breakpoint usage and detects rogue breakpoints
 * Source: design.mdc (Custom Breakpoint System)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

const CUSTOM_BREAKPOINTS = ['tablet', 'desktop', 'large-desktop', 'xl', '2xl'];
const ROGUE_BREAKPOINTS = ['sm', 'md', 'lg'];

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
      } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  searchDirs.forEach(dir => walkDir(dir));
  return files;
}

function extractBreakpoints(content) {
  const found = { custom: new Set(), rogue: new Set() };

  // Match breakpoints in className attributes and template literals only
  // We only care about breakpoints in actual CSS usage, not object literal keys
  const classNamePattern =
    /(?:className|class)=["'`][^"'`]*(?:tablet|desktop|large-desktop|xl|2xl|sm|md|lg):[^"'`]*["'`]/g;
  let match;
  while ((match = classNamePattern.exec(content)) !== null) {
    const breakpointMatch = match[0].match(/\b(tablet|desktop|large-desktop|xl|2xl|sm|md|lg):/);
    if (breakpointMatch) {
      const bp = breakpointMatch[1];
      if (CUSTOM_BREAKPOINTS.includes(bp)) {
        found.custom.add(bp);
      } else if (ROGUE_BREAKPOINTS.includes(bp)) {
        found.rogue.add(bp);
      }
    }
  }

  // Match in template literals used in className/class attributes
  // Only check template literals that are in className/class context
  const templatePattern =
    /(?:className|class)=`([^`]*(?:tablet|desktop|large-desktop|xl|2xl|sm|md|lg):[^`]*)`/g;
  while ((match = templatePattern.exec(content)) !== null) {
    const templateContent = match[1];
    // Skip if this is an object literal key pattern (unlikely in className, but check anyway)
    const beforeMatch = content.substring(0, match.index);
    const isObjectKey = /{\s*\n?\s*(sm|md|lg):\s*`/.test(beforeMatch.slice(-50));
    if (isObjectKey) continue;

    if (
      templateContent.includes('px-') ||
      templateContent.includes('py-') ||
      templateContent.includes('text-') ||
      templateContent.includes('bg-')
    ) {
      const breakpointMatch = templateContent.match(
        /\b(tablet|desktop|large-desktop|xl|2xl|sm|md|lg):/,
      );
      if (breakpointMatch) {
        const bp = breakpointMatch[1];
        if (CUSTOM_BREAKPOINTS.includes(bp)) {
          found.custom.add(bp);
        } else if (ROGUE_BREAKPOINTS.includes(bp)) {
          found.rogue.add(bp);
        }
      }
    }
  }

  return found;
}

/**
 * Check breakpoints
 */
async function checkBreakpoints(files = null) {
  const filesToCheck = files || findFiles();
  const violations = [];
  const standardConfig = getStandardConfig('breakpoints');

  for (const file of filesToCheck) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const found = extractBreakpoints(content);

    if (found.rogue.size > 0) {
      const rogueList = Array.from(found.rogue).join(', ');
      violations.push(
        createViolation({
          file: path.relative(process.cwd(), file),
          message: `Rogue breakpoints found: ${rogueList}: (DISABLED - will not work)`,
          severity: standardConfig.severity,
          fixable: standardConfig.fixable,
          standard: standardConfig.source,
          reference: 'See cleanup.mdc (Breakpoint Standards) - use cleanup:fix to auto-migrate',
        }),
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? '✅ No rogue breakpoints found'
        : `❌ ${violations.length} file(s) contain rogue breakpoints`,
  };
}

module.exports = {
  name: 'breakpoints',
  check: checkBreakpoints,
};
