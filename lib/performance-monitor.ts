/**
 * Performance monitoring utilities - re-exported from specialized modules.
 */

import type { PerformanceMetrics } from './performance-monitor/metrics';
import {
  initializeWebVitalsTracking,
  trackCustomMetrics,
  checkPerformanceBudget,
} from './performance-monitor/tracking';
import {
  calculatePerformanceScore,
  getPerformanceGrade as calculateGrade,
} from './performance-monitor/scoring';
import { PERFORMANCE_BUDGETS, PERFORMANCE_GOALS } from './performance-monitor/budgets';
import type { PerformanceBudget } from './performance-monitor/budgets';

// Re-export types and constants
export type { PerformanceMetrics, PerformanceBudget };
export { PERFORMANCE_BUDGETS, PERFORMANCE_GOALS };

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  };

  private listeners: Array<(metrics: PerformanceMetrics) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') this.initializeTracking();
  }

  private initializeTracking() {
    initializeWebVitalsTracking(
      (key, metric) => this.updateMetric(key, metric),
      (key, metric) => checkPerformanceBudget(key, metric),
    );
    trackCustomMetrics(() => {
      // Custom metrics don't map to standard keys, so we'll skip them for now
    });
  }

  private updateMetric(key: keyof PerformanceMetrics, metric: { value: number }) {
    this.metrics[key] = metric.value;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.metrics));
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public subscribe(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  public getPerformanceScore(): number {
    return calculatePerformanceScore(this.getMetrics());
  }

  public getPerformanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    return calculateGrade(this.getPerformanceScore());
  }
}

export const performanceMonitor = new PerformanceMonitor();
export const getPerformanceMetrics = () => performanceMonitor.getMetrics();
export const subscribeToPerformance = (listener: (metrics: PerformanceMetrics) => void) =>
  performanceMonitor.subscribe(listener);
export const getPerformanceScore = () => performanceMonitor.getPerformanceScore();
export const getPerformanceGrade = () => performanceMonitor.getPerformanceGrade();
