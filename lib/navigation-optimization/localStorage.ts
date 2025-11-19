// PrepFlow Adaptive Navigation Optimization - Local Storage Utilities

import { type NavigationUsageLog, type OptimizationResult } from './schema';

const USAGE_LOGS_KEY = 'prepflow-nav-usage-logs';
const OPTIMIZATION_CACHE_KEY = 'prepflow-nav-optimization-cache';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Get navigation usage logs from localStorage.
 *
 * @param {number} days - Number of days to retrieve (default: 30)
 * @returns {NavigationUsageLog[]} Array of usage logs
 */
export function getUsageLogs(days = 30): NavigationUsageLog[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(USAGE_LOGS_KEY);
    if (!stored) {
      return [];
    }

    const logs = JSON.parse(stored) as NavigationUsageLog[];
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;

    // Filter logs within the specified time range
    return logs.filter(log => log.timestamp >= cutoffTime);
  } catch {
    return [];
  }
}

/**
 * Save navigation usage log to localStorage.
 *
 * @param {NavigationUsageLog} log - Usage log to save
 */
export function saveUsageLog(log: NavigationUsageLog): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const existingLogs = getUsageLogs(30);
    existingLogs.push(log);

    // Keep only last 1000 logs
    const logsToKeep = existingLogs.slice(-1000);
    localStorage.setItem(USAGE_LOGS_KEY, JSON.stringify(logsToKeep));
  } catch {
    // Storage quota exceeded, ignore
  }
}

/**
 * Get cached optimization result from localStorage.
 *
 * @returns {OptimizationResult | null} Cached optimization result or null
 */
export function getCachedOptimization(): OptimizationResult | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem(OPTIMIZATION_CACHE_KEY);
    if (!stored) {
      return null;
    }

    const cached = JSON.parse(stored) as OptimizationResult & { cachedAt: number };
    const age = Date.now() - cached.cachedAt;

    // Return cached result if not expired
    if (age < CACHE_EXPIRY_MS) {
      return {
        items: cached.items,
        lastCalculated: cached.lastCalculated,
        patternVersion: cached.patternVersion,
      };
    }

    // Cache expired, remove it
    localStorage.removeItem(OPTIMIZATION_CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

/**
 * Cache optimization result in localStorage.
 *
 * @param {OptimizationResult} result - Optimization result to cache
 */
export function cacheOptimization(result: OptimizationResult): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const cached = {
      ...result,
      cachedAt: Date.now(),
    };
    localStorage.setItem(OPTIMIZATION_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Storage quota exceeded, ignore
  }
}

/**
 * Clear all cached optimization data.
 */
export function clearOptimizationCache(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(OPTIMIZATION_CACHE_KEY);
    localStorage.removeItem(USAGE_LOGS_KEY);
  } catch {
    // Ignore errors
  }
}

