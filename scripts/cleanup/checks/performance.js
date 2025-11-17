#!/usr/bin/env node

/**
 * Performance Check Module
 * Validates performance standards (bundle size, API response times)
 * Source: operations.mdc (Performance Standards)
 */

const fs = require('fs');
const path = require('path');
const { createViolation } = require('../utils/violations');
const { getStandardConfig } = require('../utils/config');

/**
 * Analyze bundle sizes from .next/static directory
 */
function analyzeBundleSizes() {
  const nextDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(nextDir, 'static');

  if (!fs.existsSync(staticDir)) {
    return null;
  }

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let jsFiles = [];
  let cssFiles = [];

  function analyzeDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        analyzeDirectory(fullPath);
      } else if (item.endsWith('.js')) {
        const size = stat.size;
        jsSize += size;
        totalSize += size;
        jsFiles.push({ path: fullPath, size });
      } else if (item.endsWith('.css')) {
        const size = stat.size;
        cssSize += size;
        totalSize += size;
        cssFiles.push({ path: fullPath, size });
      }
    }
  }

  analyzeDirectory(staticDir);

  return {
    totalSize,
    jsSize,
    cssSize,
    jsFiles,
    cssFiles,
  };
}

/**
 * Check performance standards
 */
async function checkPerformance(files = null) {
  const violations = [];
  const standardConfig = getStandardConfig('performance');

  // Performance budgets (from check-performance-budget.js)
  const budgets = {
    totalSize: 500000, // 500KB
    jsSize: 200000, // 200KB
    cssSize: 50000, // 50KB
  };

  // Check if .next directory exists (build artifacts)
  const nextDir = path.join(process.cwd(), '.next');
  if (!fs.existsSync(nextDir)) {
    return {
      passed: true,
      violations,
      summary: '⏭️  Performance check skipped (no .next directory - run "npm run build" first)',
    };
  }

  const bundleAnalysis = analyzeBundleSizes();

  if (!bundleAnalysis) {
    return {
      passed: true,
      violations,
      summary: '⏭️  Performance check skipped (no static directory found)',
    };
  }

  const { totalSize, jsSize, cssSize } = bundleAnalysis;

  // Check total bundle size
  if (totalSize > budgets.totalSize) {
    const sizeKB = (totalSize / 1024).toFixed(1);
    const budgetKB = (budgets.totalSize / 1024).toFixed(0);
    violations.push(
      createViolation({
        file: '.next/static',
        line: 0,
        message: `Total bundle size ${sizeKB}KB exceeds budget of ${budgetKB}KB`,
        severity: standardConfig.severity,
        fixable: standardConfig.fixable,
        standard: standardConfig.source,
        reference:
          'See cleanup.mdc (Performance Standards) and operations.mdc (Performance Standards). Consider code splitting, lazy loading, and removing unused dependencies.',
      }),
    );
  }

  // Check JS bundle size
  if (jsSize > budgets.jsSize) {
    const sizeKB = (jsSize / 1024).toFixed(1);
    const budgetKB = (budgets.jsSize / 1024).toFixed(0);
    violations.push(
      createViolation({
        file: '.next/static',
        line: 0,
        message: `JavaScript bundle size ${sizeKB}KB exceeds budget of ${budgetKB}KB`,
        severity: standardConfig.severity,
        fixable: standardConfig.fixable,
        standard: standardConfig.source,
        reference:
          'See cleanup.mdc (Performance Standards). Consider dynamic imports, code splitting, and tree-shaking unused code.',
      }),
    );
  }

  // Check CSS bundle size
  if (cssSize > budgets.cssSize) {
    const sizeKB = (cssSize / 1024).toFixed(1);
    const budgetKB = (budgets.cssSize / 1024).toFixed(0);
    violations.push(
      createViolation({
        file: '.next/static',
        line: 0,
        message: `CSS bundle size ${sizeKB}KB exceeds budget of ${budgetKB}KB`,
        severity: standardConfig.severity,
        fixable: standardConfig.fixable,
        standard: standardConfig.source,
        reference:
          'See cleanup.mdc (Performance Standards). Consider CSS purging, removing unused styles, and splitting CSS files.',
      }),
    );
  }

  const totalKB = (totalSize / 1024).toFixed(1);
  const jsKB = (jsSize / 1024).toFixed(1);
  const cssKB = (cssSize / 1024).toFixed(1);

  return {
    passed: violations.length === 0,
    violations,
    summary:
      violations.length === 0
        ? `✅ Performance check passed (Total: ${totalKB}KB, JS: ${jsKB}KB, CSS: ${cssKB}KB)`
        : `⚠️  ${violations.length} performance violation(s) found (Total: ${totalKB}KB, JS: ${jsKB}KB, CSS: ${cssKB}KB)`,
  };
}

module.exports = {
  name: 'performance',
  check: checkPerformance,
};
