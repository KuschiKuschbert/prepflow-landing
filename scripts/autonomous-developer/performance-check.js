#!/usr/bin/env node

/**
 * Performance Check Script
 * Detects performance regressions and optimization opportunities
 */

const fs = require('fs');
const path = require('path');
const {
  detectPerformanceRegressions,
  detectNPlusOneQueries,
  detectMemoryLeaks,
  detectRenderOptimizations,
  analyzeBundleSize,
  savePerformanceMetrics,
} = require('../../lib/autonomous-developer/performance/performance-analyzer');

/**
 * Check performance for file
 */
async function checkFilePerformance(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n⚡ Performance Analysis: ${filePath}\n`);

  // Detect N+1 queries
  const nPlusOne = detectNPlusOneQueries(content, filePath);
  if (nPlusOne.length > 0) {
    console.log('🔍 N+1 Query Issues:');
    nPlusOne.forEach(issue => {
      console.log(`  - ${issue.description}`);
      console.log(`    Suggestion: ${issue.suggestion}\n`);
    });
  }

  // Detect memory leaks
  const leaks = detectMemoryLeaks(content, filePath);
  if (leaks.length > 0) {
    console.log('🔍 Memory Leak Issues:');
    leaks.forEach(issue => {
      console.log(`  - ${issue.description}`);
      console.log(`    Suggestion: ${issue.suggestion}\n`);
    });
  }

  // Detect render optimizations
  const renderOpts = detectRenderOptimizations(content, filePath);
  if (renderOpts.length > 0) {
    console.log('🔍 Render Optimization Opportunities:');
    renderOpts.forEach(issue => {
      console.log(`  - ${issue.description}`);
      console.log(`    Suggestion: ${issue.suggestion}\n`);
    });
  }

  if (nPlusOne.length === 0 && leaks.length === 0 && renderOpts.length === 0) {
    console.log('✅ No performance issues detected');
  }
}

/**
 * Analyze bundle size
 */
async function checkBundleSize(bundlePath) {
  const issues = await analyzeBundleSize(bundlePath);

  if (issues.length === 0) {
    console.log('✅ Bundle size within budget');
    return;
  }

  console.log(`\n📦 Bundle Size Analysis: ${bundlePath}\n`);

  issues.forEach(issue => {
    console.log(`⚠️ ${issue.type.toUpperCase()}`);
    console.log(`   ${issue.description}`);
    console.log(`   Severity: ${issue.severity}`);
    console.log(`   Suggestion: ${issue.suggestion}\n`);
  });
}

/**
 * Record performance metrics
 */
async function recordMetrics() {
  // This would typically run after build
  const bundlePath = path.join(process.cwd(), '.next/static/chunks/main.js');
  
  let bundleSize = 0;
  let bundleSizeGzipped = 0;

  try {
    if (fs.existsSync(bundlePath)) {
      const stats = fs.statSync(bundlePath);
      bundleSize = stats.size;
      // Gzipped size would need actual gzip compression
      bundleSizeGzipped = Math.round(bundleSize * 0.3); // Rough estimate
    }
  } catch {
    // Bundle doesn't exist yet
  }

  const metrics = {
    bundleSize,
    bundleSizeGzipped,
    timestamp: new Date().toISOString(),
  };

  await savePerformanceMetrics(metrics);

  // Check for regressions
  const regressions = await detectPerformanceRegressions(metrics);
  if (regressions.length > 0) {
    console.log('\n⚠️ Performance Regressions Detected:\n');
    regressions.forEach(issue => {
      console.log(`  - ${issue.description}`);
      console.log(`    Suggestion: ${issue.suggestion}\n`);
    });
  } else {
    console.log('✅ No performance regressions detected');
  }

  console.log(`\n📊 Current Metrics:`);
  console.log(`   Bundle Size: ${(bundleSize / 1024).toFixed(1)}KB`);
  console.log(`   Gzipped: ${(bundleSizeGzipped / 1024).toFixed(1)}KB`);
}

/**
 * Main CLI
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'file':
      const filePath = args[1];
      if (!filePath) {
        console.error('Usage: performance-check.js file <file-path>');
        process.exit(1);
      }
      await checkFilePerformance(filePath);
      break;

    case 'bundle':
      const bundlePath = args[1] || path.join(process.cwd(), '.next/static/chunks/main.js');
      await checkBundleSize(bundlePath);
      break;

    case 'record':
      await recordMetrics();
      break;

    default:
      console.log(`
Performance Check Script

Usage:
  performance-check.js file <file>     Check file for performance issues
  performance-check.js bundle [path]   Analyze bundle size
  performance-check.js record          Record current metrics and check regressions

Examples:
  performance-check.js file app/api/route.ts
  performance-check.js bundle
  performance-check.js record
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { checkFilePerformance, checkBundleSize, recordMetrics };
