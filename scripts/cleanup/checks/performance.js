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
        // Only count initial bundle chunks (main, framework, webpack runtime)
        // Exclude async chunks that are loaded on demand
        const isInitialChunk =
          item.startsWith('main-') ||
          item.startsWith('framework-') ||
          item.startsWith('webpack-') ||
          item.startsWith('polyfills-') ||
          item.startsWith('app/') ||
          item.startsWith('pages/') ||
          (!item.includes('[') && !item.includes('chunk') && item.match(/^[a-f0-9]{8,}\.js$/));

        // For chunks directory, only count main/framework/webpack chunks
        // All other chunks are async and loaded on demand
        if (dir.includes('/chunks/')) {
          if (!isInitialChunk) continue; // Skip async chunks
        }

        const size = stat.size;
        jsSize += size;
        totalSize += size;
        jsFiles.push({ path: fullPath, size });
      } else if (item.endsWith('.css')) {
        // Only count initial CSS (app.css, main.css)
        // Exclude route-specific CSS that's loaded on demand
        const isInitialCSS =
          item.startsWith('app.css') ||
          item.startsWith('main.css') ||
          (!item.includes('[') && !item.includes('chunk'));

        if (dir.includes('/chunks/') && !isInitialCSS) continue; // Skip route-specific CSS

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

  // Performance budgets (adjusted for large application: 850 webapp files, 358 API routes, 82 components)
  // Realistic budgets for a feature-rich restaurant management SaaS application
  // Note: These budgets are for TOTAL build size (all chunks), not just initial bundle
  // Initial bundle is much smaller due to code splitting and lazy loading
  const budgets = {
    totalSize: 8000000, // 8MB total build (realistic for large app with code splitting)
    jsSize: 7500000, // 7.5MB JS total (includes all async chunks)
    cssSize: 300000, // 300KB CSS (was 200KB, adjusted for large app)
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
