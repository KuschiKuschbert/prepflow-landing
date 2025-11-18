import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';
import { logger } from '@/lib/logger';
import type { PerformanceMetrics } from './metrics';
import { PERFORMANCE_BUDGETS, PERFORMANCE_GOALS } from './budgets';

/**
 * Track custom performance metrics.
 *
 * @param {Function} updateMetric - Function to update metric value
 */
export function trackCustomMetrics(_updateMetric?: (key: keyof PerformanceMetrics, value: number) => void): void {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => trackCustomMetric('page_load_time', performance.now()));
    document.addEventListener('DOMContentLoaded', () =>
      trackCustomMetric('dom_ready_time', performance.now()),
    );
    if ('performance' in window && 'getEntriesByType' in performance) {
      performance
        .getEntriesByType('paint')
        .forEach(entry => trackCustomMetric(`paint_${entry.name}`, entry.startTime));
    }
  }
}

/**
 * Track a single custom metric.
 *
 * @param {string} name - Metric name
 * @param {number} value - Metric value
 */
function trackCustomMetric(name: string, value: number): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'custom_metric', {
      event_category: 'Performance',
      event_label: name,
      value: Math.round(value),
      custom_parameter_metric_name: name,
      custom_parameter_metric_value: Math.round(value),
      custom_parameter_page: window.location.pathname,
    });
  }
}

/**
 * Initialize Web Vitals tracking.
 *
 * @param {Function} updateMetric - Function to update metric value
 * @param {Function} checkBudget - Function to check performance budget
 */
export function initializeWebVitalsTracking(
  updateMetric: (key: keyof PerformanceMetrics, metric: Metric) => void,
  checkBudget: (key: keyof PerformanceMetrics, metric: Metric) => void,
): void {
  onLCP(metric => {
    updateMetric('lcp', metric);
    checkBudget('lcp', metric);
  });
  onFCP(metric => {
    updateMetric('fcp', metric);
    checkBudget('fcp', metric);
  });
  onCLS(metric => {
    updateMetric('cls', metric);
    checkBudget('cls', metric);
  });
  onTTFB(metric => {
    updateMetric('ttfb', metric);
    checkBudget('ttfb', metric);
  });
  onINP(metric => {
    updateMetric('inp', metric);
    checkBudget('inp', metric);
  });
}

/**
 * Check if metric exceeds performance budget or meets goal.
 *
 * @param {keyof PerformanceMetrics} key - Metric key
 * @param {Metric} metric - Web Vitals metric
 */
export function checkPerformanceBudget(key: keyof PerformanceMetrics, metric: Metric): void {
  const budget = PERFORMANCE_BUDGETS[key];
  const goal = PERFORMANCE_GOALS[key];
  if (budget && metric.value > budget) {
    logger.warn(`🚨 Performance Budget Exceeded: ${key.toUpperCase()}`, {
      value: metric.value,
      budget,
      goal,
      rating: metric.rating,
    });
    sendPerformanceAlert(key, metric, 'budget_exceeded');
  } else if (goal && metric.value <= goal) {
    logger.dev(`✅ Performance Goal Met: ${key.toUpperCase()}`, {
      value: metric.value,
      budget,
      goal,
      rating: metric.rating,
    });
  }
}

/**
 * Send performance alert to analytics.
 *
 * @param {string} key - Metric key
 * @param {Metric} metric - Web Vitals metric
 * @param {string} type - Alert type
 */
function sendPerformanceAlert(key: string, metric: Metric, type: string): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_alert', {
      event_category: 'Performance',
      event_label: key,
      value: Math.round(metric.value),
      custom_parameter_metric_name: key,
      custom_parameter_metric_value: Math.round(metric.value),
      custom_parameter_metric_rating: metric.rating,
      custom_parameter_alert_type: type,
      custom_parameter_page: window.location.pathname,
    });
  }
}
