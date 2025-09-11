interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  fcp: number | null;
  bundleSize: number | null;
  apiResponseTime: number | null;
  memoryUsage: number | null;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: number;
  metric: string;
  value: number;
  threshold: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
    bundleSize: null,
    apiResponseTime: null,
    memoryUsage: null,
  };

  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private thresholds = {
    lcp: 2500, // 2.5 seconds
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    ttfb: 800, // 800ms
    fcp: 1800, // 1.8 seconds
    apiResponseTime: 2000, // 2 seconds
    memoryUsage: 50 * 1024 * 1024, // 50MB
  };

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeFCP();
    this.observeTTFB();

    // Monitor API performance
    this.observeAPICalls();

    // Monitor memory usage
    this.observeMemoryUsage();

    // Monitor bundle size
    this.observeBundleSize();
  }

  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      this.metrics.lcp = lastEntry.startTime;
      this.checkThreshold('lcp', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }

  private observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        this.metrics.fid = entry.processingStart - entry.startTime;
        this.checkThreshold('fid', entry.processingStart - entry.startTime);
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.push(observer);
  }

  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.cls = clsValue;
          this.checkThreshold('cls', clsValue);
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(observer);
  }

  private observeFCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry: any) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
        this.checkThreshold('fcp', fcpEntry.startTime);
      }
    });

    observer.observe({ entryTypes: ['paint'] });
    this.observers.push(observer);
  }

  private observeTTFB() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.responseStart > 0) {
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
          this.checkThreshold('ttfb', entry.responseStart - entry.requestStart);
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
    this.observers.push(observer);
  }

  private observeAPICalls() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name.includes('/api/')) {
          const responseTime = entry.responseEnd - entry.requestStart;
          this.metrics.apiResponseTime = responseTime;
          this.checkThreshold('apiResponseTime', responseTime);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }

  private observeMemoryUsage() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.checkThreshold('memoryUsage', memory.usedJSHeapSize);
      }
    };

    // Check memory usage every 30 seconds
    setInterval(checkMemory, 30000);
    checkMemory(); // Initial check
  }

  private observeBundleSize() {
    if (typeof window === 'undefined') return;

    // Estimate bundle size from loaded scripts
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;

    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && src.includes('_next/static')) {
        // This is a rough estimate - in production you'd want more accurate measurement
        totalSize += 100000; // Assume ~100KB per script
      }
    });

    this.metrics.bundleSize = totalSize;
  }

  private checkThreshold(metric: string, value: number) {
    const threshold = this.thresholds[metric as keyof typeof this.thresholds];
    if (!threshold) return;

    let alertType: 'warning' | 'error' | 'info' = 'info';
    let message = '';

    if (value > threshold) {
      alertType = 'error';
      message = `${metric.toUpperCase()} exceeded threshold: ${value}ms > ${threshold}ms`;
    } else if (value > threshold * 0.8) {
      alertType = 'warning';
      message = `${metric.toUpperCase()} approaching threshold: ${value}ms (${threshold}ms)`;
    }

    if (alertType !== 'info') {
      this.addAlert({
        id: `${metric}-${Date.now()}`,
        type: alertType,
        message,
        timestamp: Date.now(),
        metric,
        value,
        threshold,
      });
    }
  }

  private addAlert(alert: PerformanceAlert) {
    this.alerts.push(alert);
    
    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-50);
    }

    // Dispatch custom event for UI to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performance-alert', { detail: alert }));
    }
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public getPerformanceScore(): number {
    const scores = [];
    
    if (this.metrics.lcp !== null) {
      scores.push(this.metrics.lcp <= 2500 ? 100 : Math.max(0, 100 - (this.metrics.lcp - 2500) / 10));
    }
    
    if (this.metrics.fid !== null) {
      scores.push(this.metrics.fid <= 100 ? 100 : Math.max(0, 100 - (this.metrics.fid - 100) / 2));
    }
    
    if (this.metrics.cls !== null) {
      scores.push(this.metrics.cls <= 0.1 ? 100 : Math.max(0, 100 - (this.metrics.cls - 0.1) * 1000));
    }

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }

  public getRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push('Optimize images and reduce Largest Contentful Paint time');
    }

    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time to improve First Input Delay');
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push('Fix layout shifts by setting dimensions for dynamic content');
    }

    if (this.metrics.apiResponseTime && this.metrics.apiResponseTime > 2000) {
      recommendations.push('Optimize API response times or implement caching');
    }

    if (this.metrics.memoryUsage && this.metrics.memoryUsage > 50 * 1024 * 1024) {
      recommendations.push('Reduce memory usage by optimizing JavaScript and images');
    }

    return recommendations;
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export types
export type { PerformanceMetrics, PerformanceAlert };
