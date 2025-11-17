import type { PerformanceMetrics } from '../types';

export function trackPerformance(
  sessionId: string,
  performance: PerformanceMetrics[],
  sendPerformanceMetrics: (metrics: PerformanceMetrics) => void,
): void {
  if ('performance' in window) {
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          const metrics: PerformanceMetrics = {
            pageLoadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            firstInputDelay: 0,
            cumulativeLayoutShift: 0,
            timestamp: Date.now(),
            page: window.location.pathname,
            sessionId,
          };
          performance.push(metrics);
          sendPerformanceMetrics(metrics);
        }
      }
    });
    observer.observe({ entryTypes: ['navigation'] });
  }
}
