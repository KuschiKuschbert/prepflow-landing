import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

import { logger } from '@/lib/logger';

export interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
}

export interface PerformanceBudget {
  lcp: number; // 2.5s
  fid: number; // 100ms
  cls: number; // 0.1
  fcp: number; // 1.8s
  ttfb: number; // 600ms
  inp: number; // 200ms
}

export const PERFORMANCE_BUDGETS: PerformanceBudget = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
  inp: 200,
};

export const PERFORMANCE_GOALS: PerformanceBudget = {
  lcp: 1500,
  fid: 50,
  cls: 0.05,
  fcp: 1200,
  ttfb: 300,
  inp: 100,
};

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
    onLCP(metric => this.updateMetric('lcp', metric));
    onFCP(metric => this.updateMetric('fcp', metric));
    onCLS(metric => this.updateMetric('cls', metric));
    onTTFB(metric => this.updateMetric('ttfb', metric));
    onINP(metric => this.updateMetric('inp', metric));
    this.trackCustomMetrics();
  }

  private updateMetric(key: keyof PerformanceMetrics, metric: Metric) {
    this.metrics[key] = metric.value;
    this.notifyListeners();
    this.checkPerformanceBudget(key, metric);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.metrics));
  }

  private checkPerformanceBudget(key: keyof PerformanceMetrics, metric: Metric) {
    const budget = PERFORMANCE_BUDGETS[key];
    const goal = PERFORMANCE_GOALS[key];
    if (budget && metric.value > budget) {
      logger.warn(`🚨 Performance Budget Exceeded: ${key.toUpperCase()}`, {
        value: metric.value,
        budget,
        goal,
        rating: metric.rating,
      });
      this.sendPerformanceAlert(key, metric, 'budget_exceeded');
    } else if (goal && metric.value <= goal) {
      logger.dev(`✅ Performance Goal Met: ${key.toUpperCase()}`, {
        value: metric.value,
        budget,
        goal,
        rating: metric.rating,
      });
    }
  }

  private sendPerformanceAlert(key: string, metric: Metric, type: string) {
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

  private trackCustomMetrics() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () =>
        this.trackCustomMetric('page_load_time', performance.now()),
      );
      document.addEventListener('DOMContentLoaded', () =>
        this.trackCustomMetric('dom_ready_time', performance.now()),
      );
      if ('performance' in window && 'getEntriesByType' in performance) {
        performance
          .getEntriesByType('paint')
          .forEach(entry => this.trackCustomMetric(`paint_${entry.name}`, entry.startTime));
      }
    }
  }

  private trackCustomMetric(name: string, value: number) {
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
    const metrics = this.getMetrics();
    let score = 0;
    let count = 0;
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== null) {
        const budget = PERFORMANCE_BUDGETS[key as keyof PerformanceBudget];
        const goal = PERFORMANCE_GOALS[key as keyof PerformanceBudget];
        if (budget && goal) {
          score += (1 - Math.min(value / goal, 1)) * 100;
          count++;
        }
      }
    });
    return count > 0 ? Math.round(score / count) : 0;
  }

  public getPerformanceGrade(): 'A' | 'B' | 'C' | 'D' | 'F' {
    const score = this.getPerformanceScore();
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return score >= 60 ? 'D' : 'F';
  }
}

export const performanceMonitor = new PerformanceMonitor();
export const getPerformanceMetrics = () => performanceMonitor.getMetrics();
export const subscribeToPerformance = (listener: (metrics: PerformanceMetrics) => void) =>
  performanceMonitor.subscribe(listener);
export const getPerformanceScore = () => performanceMonitor.getPerformanceScore();
export const getPerformanceGrade = () => performanceMonitor.getPerformanceGrade();
