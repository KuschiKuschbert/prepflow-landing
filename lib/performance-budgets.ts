// Performance Budgets Implementation for PrepFlow
// Automated performance budget enforcement with Lighthouse CI

// Performance budget configuration
export const PERFORMANCE_BUDGETS = {
  // Core Web Vitals budgets
  coreWebVitals: {
    lcp: 2500, // Largest Contentful Paint (ms)
    fid: 100, // First Input Delay (ms)
    cls: 0.1, // Cumulative Layout Shift
    fcp: 1800, // First Contentful Paint (ms)
    tti: 3800, // Time to Interactive (ms)
    si: 3000, // Speed Index (ms)
    tbt: 300, // Total Blocking Time (ms)
  },

  // Resource budgets
  resources: {
    totalSize: 500000, // Total bundle size (bytes)
    jsSize: 200000, // JavaScript bundle size (bytes)
    cssSize: 50000, // CSS bundle size (bytes)
    imageSize: 100000, // Image bundle size (bytes)
    fontSize: 30000, // Font bundle size (bytes)
    thirdPartySize: 100000, // Third-party scripts (bytes)
  },

  // Network budgets
  network: {
    totalRequests: 50, // Total number of requests
    jsRequests: 10, // JavaScript requests
    cssRequests: 3, // CSS requests
    imageRequests: 15, // Image requests
    fontRequests: 5, // Font requests
    thirdPartyRequests: 10, // Third-party requests
  },

  // Performance scores
  scores: {
    performance: 80, // Lighthouse Performance score
    accessibility: 90, // Lighthouse Accessibility score
    bestPractices: 80, // Lighthouse Best Practices score
    seo: 80, // Lighthouse SEO score
  },

  // Page-specific budgets
  pages: {
    landing: {
      lcp: 2000,
      fid: 80,
      cls: 0.08,
      totalSize: 400000,
      jsSize: 150000,
    },
    webapp: {
      lcp: 3000,
      fid: 100,
      cls: 0.1,
      totalSize: 600000,
      jsSize: 250000,
    },
    auth: {
      lcp: 1500,
      fid: 60,
      cls: 0.05,
      totalSize: 200000,
      jsSize: 100000,
    },
  },
};

// Performance budget manager
export class PerformanceBudgetManager {
  private static instance: PerformanceBudgetManager;
  private violations: PerformanceViolation[] = [];
  private budgets = PERFORMANCE_BUDGETS;

  static getInstance(): PerformanceBudgetManager {
    if (!PerformanceBudgetManager.instance) {
      PerformanceBudgetManager.instance = new PerformanceBudgetManager();
    }
    return PerformanceBudgetManager.instance;
  }

  // Check performance budget against metrics
  checkBudget(metrics: PerformanceMetrics, pageType: string = 'landing'): PerformanceBudgetResult {
    const violations: PerformanceViolation[] = [];
    const pageBudgets =
      this.budgets.pages[pageType as keyof typeof this.budgets.pages] || this.budgets.pages.landing;

    // Check Core Web Vitals
    if (metrics.lcp && metrics.lcp > pageBudgets.lcp) {
      violations.push({
        metric: 'lcp',
        actual: metrics.lcp,
        budget: pageBudgets.lcp,
        severity: this.getSeverity(metrics.lcp, pageBudgets.lcp),
        message: `LCP ${metrics.lcp}ms exceeds budget of ${pageBudgets.lcp}ms`,
      });
    }

    if (metrics.fid && metrics.fid > pageBudgets.fid) {
      violations.push({
        metric: 'fid',
        actual: metrics.fid,
        budget: pageBudgets.fid,
        severity: this.getSeverity(metrics.fid, pageBudgets.fid),
        message: `FID ${metrics.fid}ms exceeds budget of ${pageBudgets.fid}ms`,
      });
    }

    if (metrics.cls && metrics.cls > pageBudgets.cls) {
      violations.push({
        metric: 'cls',
        actual: metrics.cls,
        budget: pageBudgets.cls,
        severity: this.getSeverity(metrics.cls, pageBudgets.cls),
        message: `CLS ${metrics.cls} exceeds budget of ${pageBudgets.cls}`,
      });
    }

    // Check resource budgets
    if (metrics.resources) {
      if (metrics.resources.totalSize > pageBudgets.totalSize) {
        violations.push({
          metric: 'totalSize',
          actual: metrics.resources.totalSize,
          budget: pageBudgets.totalSize,
          severity: this.getSeverity(metrics.resources.totalSize, pageBudgets.totalSize),
          message: `Total size ${metrics.resources.totalSize} bytes exceeds budget of ${pageBudgets.totalSize} bytes`,
        });
      }

      if (metrics.resources.jsSize > pageBudgets.jsSize) {
        violations.push({
          metric: 'jsSize',
          actual: metrics.resources.jsSize,
          budget: pageBudgets.jsSize,
          severity: this.getSeverity(metrics.resources.jsSize, pageBudgets.jsSize),
          message: `JavaScript size ${metrics.resources.jsSize} bytes exceeds budget of ${pageBudgets.jsSize} bytes`,
        });
      }
    }

    // Store violations
    this.violations.push(...violations);

    return {
      passed: violations.length === 0,
      violations,
      score: this.calculateScore(violations),
      timestamp: Date.now(),
      pageType,
    };
  }

  // Get severity level for violation
  private getSeverity(actual: number, budget: number): 'low' | 'medium' | 'high' | 'critical' {
    const ratio = actual / budget;

    if (ratio >= 2) return 'critical';
    if (ratio >= 1.5) return 'high';
    if (ratio >= 1.2) return 'medium';
    return 'low';
  }

  // Calculate performance score
  private calculateScore(violations: PerformanceViolation[]): number {
    if (violations.length === 0) return 100;

    const criticalViolations = violations.filter(v => v.severity === 'critical').length;
    const highViolations = violations.filter(v => v.severity === 'high').length;
    const mediumViolations = violations.filter(v => v.severity === 'medium').length;
    const lowViolations = violations.filter(v => v.severity === 'low').length;

    // Calculate score based on violation severity
    const score = Math.max(
      0,
      100 -
        (criticalViolations * 25 + highViolations * 15 + mediumViolations * 10 + lowViolations * 5),
    );

    return Math.round(score);
  }

  // Get all violations
  getViolations(): PerformanceViolation[] {
    return [...this.violations];
  }

  // Get violations by severity
  getViolationsBySeverity(
    severity: 'low' | 'medium' | 'high' | 'critical',
  ): PerformanceViolation[] {
    return this.violations.filter(v => v.severity === severity);
  }

  // Clear violations
  clearViolations(): void {
    this.violations = [];
  }

  // Generate budget report
  generateBudgetReport(): PerformanceBudgetReport {
    const totalViolations = this.violations.length;
    const criticalViolations = this.getViolationsBySeverity('critical').length;
    const highViolations = this.getViolationsBySeverity('high').length;
    const mediumViolations = this.getViolationsBySeverity('medium').length;
    const lowViolations = this.getViolationsBySeverity('low').length;

    return {
      totalViolations,
      criticalViolations,
      highViolations,
      mediumViolations,
      lowViolations,
      score: this.calculateScore(this.violations),
      violations: this.violations,
      timestamp: Date.now(),
    };
  }

  // Check if budget is within acceptable limits
  isWithinBudget(metrics: PerformanceMetrics, pageType: string = 'landing'): boolean {
    const result = this.checkBudget(metrics, pageType);
    return result.passed;
  }

  // Get budget recommendations
  getBudgetRecommendations(violations: PerformanceViolation[]): string[] {
    const recommendations: string[] = [];

    violations.forEach(violation => {
      switch (violation.metric) {
        case 'lcp':
          recommendations.push(
            'Optimize images, reduce server response time, or eliminate render-blocking resources',
          );
          break;
        case 'fid':
          recommendations.push('Reduce JavaScript execution time or break up long tasks');
          break;
        case 'cls':
          recommendations.push(
            'Add size attributes to images and videos, avoid inserting content above existing content',
          );
          break;
        case 'totalSize':
          recommendations.push('Enable compression, remove unused code, or optimize images');
          break;
        case 'jsSize':
          recommendations.push('Code splitting, tree shaking, or remove unused JavaScript');
          break;
        case 'cssSize':
          recommendations.push('Remove unused CSS or inline critical CSS');
          break;
        case 'imageSize':
          recommendations.push(
            'Optimize images, use modern formats (WebP/AVIF), or implement lazy loading',
          );
          break;
        case 'fontSize':
          recommendations.push('Font subsetting, preloading, or use system fonts');
          break;
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }
}

// Performance violation interface
export interface PerformanceViolation {
  metric: string;
  actual: number;
  budget: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp?: number;
}

// Performance budget result interface
export interface PerformanceBudgetResult {
  passed: boolean;
  violations: PerformanceViolation[];
  score: number;
  timestamp: number;
  pageType: string;
}

// Performance budget report interface
export interface PerformanceBudgetReport {
  totalViolations: number;
  criticalViolations: number;
  highViolations: number;
  mediumViolations: number;
  lowViolations: number;
  score: number;
  violations: PerformanceViolation[];
  timestamp: number;
}

// Performance metrics interface
export interface PerformanceMetrics {
  lcp?: number | null;
  fid?: number | null;
  cls?: number | null;
  fcp?: number | null;
  tti?: number | null;
  si?: number | null;
  tbt?: number | null;
  resources?: {
    totalSize: number;
    jsSize: number;
    cssSize: number;
    imageSize: number;
    fontSize: number;
    thirdPartySize: number;
  };
  network?: {
    totalRequests: number;
    jsRequests: number;
    cssRequests: number;
    imageRequests: number;
    fontRequests: number;
    thirdPartyRequests: number;
  };
}

// Export singleton instance
export const performanceBudgetManager = PerformanceBudgetManager.getInstance();

// Performance budget monitoring
export function trackPerformanceBudget(
  metrics: PerformanceMetrics,
  pageType: string = 'landing',
): void {
  const result = performanceBudgetManager.checkBudget(metrics, pageType);

  if (!result.passed) {
    console.warn('🚨 Performance budget violations detected:', result.violations);

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_budget_violation', {
        event_category: 'performance',
        event_label: 'budget_violation',
        value: result.score,
        custom_parameter_violations: result.violations.length,
        custom_parameter_page_type: pageType,
        custom_parameter_score: result.score,
      });
    }
  }
}

// Performance budget alerting
export function alertPerformanceBudgetViolations(violations: PerformanceViolation[]): void {
  const criticalViolations = violations.filter(v => v.severity === 'critical');
  const highViolations = violations.filter(v => v.severity === 'high');

  if (criticalViolations.length > 0) {
    console.error('🚨 CRITICAL performance budget violations:', criticalViolations);

    // Send critical alert
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'critical_performance_violation', {
        event_category: 'performance',
        event_label: 'critical_violation',
        value: criticalViolations.length,
        custom_parameter_violations: criticalViolations.map(v => v.metric),
      });
    }
  }

  if (highViolations.length > 0) {
    console.warn('⚠️ HIGH performance budget violations:', highViolations);

    // Send high priority alert
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'high_performance_violation', {
        event_category: 'performance',
        event_label: 'high_violation',
        value: highViolations.length,
        custom_parameter_violations: highViolations.map(v => v.metric),
      });
    }
  }
}
