/**
 * Performance Analyzer
 * Detects performance regressions and suggests optimizations
 */

import fs from 'fs/promises';
import path from 'path';

export interface PerformanceIssue {
  type: 'regression' | 'bundle-size' | 'query-optimization' | 'memory-leak' | 'render-optimization';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  file?: string;
  suggestion: string;
  baseline?: number;
  current?: number;
  improvement?: number;
}

export interface PerformanceMetrics {
  bundleSize: number;
  bundleSizeGzipped: number;
  renderTime?: number;
  queryTime?: number;
  memoryUsage?: number;
  timestamp: string;
}

const PERFORMANCE_METRICS_FILE = path.join(process.cwd(), 'docs/autonomous-developer/performance-metrics.json');

/**
 * Load performance metrics history
 */
export async function loadPerformanceMetrics(): Promise<PerformanceMetrics[]> {
  try {
    const content = await fs.readFile(PERFORMANCE_METRICS_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

/**
 * Save performance metrics
 */
export async function savePerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
  const allMetrics = await loadPerformanceMetrics();
  allMetrics.push(metrics);

  const dir = path.dirname(PERFORMANCE_METRICS_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(PERFORMANCE_METRICS_FILE, JSON.stringify(allMetrics, null, 2));
}

/**
 * Detect performance regressions
 */
export async function detectPerformanceRegressions(
  currentMetrics: PerformanceMetrics,
): Promise<PerformanceIssue[]> {
  const history = await loadPerformanceMetrics();
  if (history.length === 0) return [];

  const issues: PerformanceIssue[] = [];
  const baseline = history[history.length - 1]; // Last known good

  // Bundle size regression
  if (currentMetrics.bundleSize > baseline.bundleSize * 1.1) {
    const increase = ((currentMetrics.bundleSize - baseline.bundleSize) / baseline.bundleSize) * 100;
    issues.push({
      type: 'bundle-size',
      description: `Bundle size increased by ${increase.toFixed(1)}% (${baseline.bundleSize} → ${currentMetrics.bundleSize} bytes)`,
      severity: increase > 20 ? 'critical' : increase > 10 ? 'high' : 'medium',
      suggestion: 'Review bundle size - consider code splitting or removing unused dependencies',
      baseline: baseline.bundleSize,
      current: currentMetrics.bundleSize,
      improvement: baseline.bundleSize - currentMetrics.bundleSize,
    });
  }

  // Gzipped bundle size regression
  if (currentMetrics.bundleSizeGzipped > baseline.bundleSizeGzipped * 1.1) {
    const increase = ((currentMetrics.bundleSizeGzipped - baseline.bundleSizeGzipped) / baseline.bundleSizeGzipped) * 100;
    issues.push({
      type: 'bundle-size',
      description: `Gzipped bundle size increased by ${increase.toFixed(1)}%`,
      severity: increase > 20 ? 'critical' : 'high',
      suggestion: 'Optimize bundle - use dynamic imports, tree-shaking, or code splitting',
      baseline: baseline.bundleSizeGzipped,
      current: currentMetrics.bundleSizeGzipped,
    });
  }

  // Render time regression
  if (currentMetrics.renderTime && baseline.renderTime) {
    if (currentMetrics.renderTime > baseline.renderTime * 1.2) {
      issues.push({
        type: 'render-optimization',
        description: `Render time increased by ${((currentMetrics.renderTime - baseline.renderTime) / baseline.renderTime * 100).toFixed(1)}%`,
        severity: 'high',
        suggestion: 'Optimize renders - use React.memo(), useMemo(), or useCallback()',
        baseline: baseline.renderTime,
        current: currentMetrics.renderTime,
      });
    }
  }

  // Query time regression
  if (currentMetrics.queryTime && baseline.queryTime) {
    if (currentMetrics.queryTime > baseline.queryTime * 1.5) {
      issues.push({
        type: 'query-optimization',
        description: `Query time increased by ${((currentMetrics.queryTime - baseline.queryTime) / baseline.queryTime * 100).toFixed(1)}%`,
        severity: 'high',
        suggestion: 'Optimize database queries - check for N+1 queries, add indexes, or use batch fetching',
        baseline: baseline.queryTime,
        current: currentMetrics.queryTime,
      });
    }
  }

  return issues;
}

/**
 * Detect N+1 query patterns
 */
export function detectNPlusOneQueries(content: string, filePath: string): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];

  // Detect patterns like: forEach/map with await inside
  const nPlusOnePattern = /\.(forEach|map|filter)\([^)]*async\s*\([^)]*\)\s*=>\s*\{[^}]*await\s+.*\.(select|find|get)/;
  if (nPlusOnePattern.test(content)) {
    issues.push({
      type: 'query-optimization',
      description: 'Potential N+1 query pattern detected',
      severity: 'high',
      file: filePath,
      suggestion: 'Use batch fetching or parallel queries instead of sequential queries in loops',
    });
  }

  // Detect sequential await calls
  const sequentialAwaits = content.match(/await\s+[^;]+;\s*await\s+[^;]+;/g);
  if (sequentialAwaits && sequentialAwaits.length > 3) {
    issues.push({
      type: 'query-optimization',
      description: 'Multiple sequential await calls detected - consider parallelization',
      severity: 'medium',
      file: filePath,
      suggestion: 'Use Promise.all() for independent async operations',
    });
  }

  return issues;
}

/**
 * Detect memory leak patterns
 */
export function detectMemoryLeaks(content: string, filePath: string): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];

  // Detect missing cleanup in useEffect
  const useEffectPattern = /useEffect\([^)]*\(\)\s*=>\s*\{[^}]*setInterval|setTimeout|addEventListener/;
  const cleanupPattern = /useEffect\([^)]*\(\)\s*=>\s*\{[\s\S]*?return\s+\(\)\s*=>\s*\{[\s\S]*?clearInterval|clearTimeout|removeEventListener/;

  if (useEffectPattern.test(content) && !cleanupPattern.test(content)) {
    issues.push({
      type: 'memory-leak',
      description: 'useEffect with timers/event listeners missing cleanup function',
      severity: 'high',
      file: filePath,
      suggestion: 'Add cleanup function to useEffect to prevent memory leaks',
    });
  }

  // Detect event listeners without removal
  const addEventListenerPattern = /addEventListener\(/g;
  const removeEventListenerPattern = /removeEventListener\(/g;
  const addCount = (content.match(addEventListenerPattern) || []).length;
  const removeCount = (content.match(removeEventListenerPattern) || []).length;

  if (addCount > removeCount) {
    issues.push({
      type: 'memory-leak',
      description: `More addEventListener calls (${addCount}) than removeEventListener (${removeCount})`,
      severity: 'high',
      file: filePath,
      suggestion: 'Ensure all event listeners are removed in cleanup functions',
    });
  }

  return issues;
}

/**
 * Detect render optimization opportunities
 */
export function detectRenderOptimizations(content: string, filePath: string): PerformanceIssue[] {
  const issues: PerformanceIssue[] = [];

  // Detect expensive computations in render
  const expensiveInRender = /(?:function|const)\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\.(filter|map|reduce|sort)\([^}]*\}/;
  if (expensiveInRender.test(content) && !content.includes('useMemo')) {
    issues.push({
      type: 'render-optimization',
      description: 'Expensive computation in render without useMemo',
      severity: 'medium',
      file: filePath,
      suggestion: 'Wrap expensive computations in useMemo() to prevent unnecessary recalculations',
    });
  }

  // Detect inline functions in JSX
  const inlineFunctions = (content.match(/onClick=\{\(\)\s*=>|onChange=\{\([^)]*\)\s*=>/g) || []).length;
  if (inlineFunctions > 5) {
    issues.push({
      type: 'render-optimization',
      description: `Multiple inline functions detected (${inlineFunctions})`,
      severity: 'low',
      file: filePath,
      suggestion: 'Use useCallback() for event handlers to prevent unnecessary re-renders',
    });
  }

  // Detect missing React.memo for list items
  const listItemPattern = /\.map\([^)]*\([^)]*\)\s*=>\s*<[^>]+>/;
  if (listItemPattern.test(content) && !content.includes('React.memo') && !content.includes('memo(')) {
    issues.push({
      type: 'render-optimization',
      description: 'List items without React.memo()',
      severity: 'medium',
      file: filePath,
      suggestion: 'Wrap list items in React.memo() to prevent unnecessary re-renders',
    });
  }

  return issues;
}

/**
 * Analyze bundle size
 */
export async function analyzeBundleSize(bundlePath: string): Promise<PerformanceIssue[]> {
  const issues: PerformanceIssue[] = [];

  try {
    const stats = await fs.stat(bundlePath);
    const size = stats.size;
    const sizeKB = size / 1024;
    const sizeMB = sizeKB / 1024;

    // Check against performance budgets
    const BUDGET_JS = 200 * 1024; // 200KB
    const BUDGET_CSS = 50 * 1024; // 50KB

    if (bundlePath.endsWith('.js') && size > BUDGET_JS) {
      issues.push({
        type: 'bundle-size',
        description: `JavaScript bundle exceeds budget: ${sizeKB.toFixed(1)}KB (budget: ${BUDGET_JS / 1024}KB)`,
        severity: size > BUDGET_JS * 1.5 ? 'critical' : 'high',
        suggestion: 'Reduce bundle size - use code splitting, remove unused dependencies, or optimize imports',
        current: size,
        baseline: BUDGET_JS,
      });
    }

    if (bundlePath.endsWith('.css') && size > BUDGET_CSS) {
      issues.push({
        type: 'bundle-size',
        description: `CSS bundle exceeds budget: ${sizeKB.toFixed(1)}KB (budget: ${BUDGET_CSS / 1024}KB)`,
        severity: 'medium',
        suggestion: 'Optimize CSS - remove unused styles, use CSS modules, or purge unused CSS',
        current: size,
        baseline: BUDGET_CSS,
      });
    }
  } catch {
    // File doesn't exist, skip
  }

  return issues;
}
