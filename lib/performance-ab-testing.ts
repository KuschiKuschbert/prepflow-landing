// Performance-Based A/B Testing for PrepFlow
// Implements A/B testing with performance metrics as success criteria

// A/B testing configuration
export const AB_TEST_CONFIG = {
  // Test variants
  variants: {
    control: { name: 'Control', weight: 0.25 },
    variant_a: { name: 'Variant A', weight: 0.25 },
    variant_b: { name: 'Variant B', weight: 0.25 },
    variant_c: { name: 'Variant C', weight: 0.25 },
  },

  // Performance metrics to track
  performanceMetrics: ['lcp', 'fid', 'cls', 'fcp', 'tti', 'si', 'tbt'],

  // Success criteria
  successCriteria: {
    lcp: { threshold: 2500, weight: 0.3 },
    fid: { threshold: 100, weight: 0.2 },
    cls: { threshold: 0.1, weight: 0.2 },
    fcp: { threshold: 1800, weight: 0.15 },
    tti: { threshold: 3800, weight: 0.1 },
    si: { threshold: 3000, weight: 0.05 },
  },

  // Test duration and sample size
  testDuration: 14 * 24 * 60 * 60 * 1000, // 14 days
  minSampleSize: 100, // Minimum users per variant
  maxSampleSize: 10000, // Maximum users per test

  // Statistical significance
  confidenceLevel: 0.95, // 95% confidence
  power: 0.8, // 80% power
};

// A/B test interfaces
export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  startDate: number;
  endDate: number;
  status: 'draft' | 'running' | 'paused' | 'completed';
  successCriteria: SuccessCriteria;
  results?: ABTestResults;
}

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number;
  config: Record<string, any>;
  performance: PerformanceMetrics;
  users: number;
  conversions: number;
  conversionRate: number;
}

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  tti?: number;
  si?: number;
  tbt?: number;
  score?: number;
}

export interface SuccessCriteria {
  primary: string; // Primary metric (e.g., 'lcp')
  secondary: string[]; // Secondary metrics
  threshold: number; // Success threshold
  weight: number; // Weight in overall score
}

export interface ABTestResults {
  winner: string;
  confidence: number;
  pValue: number;
  effectSize: number;
  sampleSize: number;
  duration: number;
  recommendations: string[];
}

// Performance-based A/B testing manager
export class PerformanceABTestingManager {
  private static instance: PerformanceABTestingManager;
  private activeTests: Map<string, ABTest> = new Map();
  private testData: Map<string, ABTestData[]> = new Map();
  private currentVariant: string | null = null;

  static getInstance(): PerformanceABTestingManager {
    if (!PerformanceABTestingManager.instance) {
      PerformanceABTestingManager.instance = new PerformanceABTestingManager();
    }
    return PerformanceABTestingManager.instance;
  }

  // Create new A/B test
  createTest(test: Omit<ABTest, 'id' | 'startDate' | 'status' | 'results'>): string {
    const id = this.generateTestId();
    const newTest: ABTest = {
      ...test,
      id,
      startDate: Date.now(),
      status: 'draft',
    };

    this.activeTests.set(id, newTest);
    this.testData.set(id, []);

    console.log(`🧪 A/B test created: ${test.name} (${id})`);
    return id;
  }

  // Start A/B test
  startTest(testId: string): boolean {
    const test = this.activeTests.get(testId);
    if (!test) return false;

    test.status = 'running';
    test.startDate = Date.now();
    test.endDate = test.startDate + AB_TEST_CONFIG.testDuration;

    console.log(`🚀 A/B test started: ${test.name}`);
    return true;
  }

  // Assign user to variant
  assignVariant(testId: string, userId: string): string | null {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') return null;

    // Check if user already assigned
    const existingAssignment = this.getUserAssignment(testId, userId);
    if (existingAssignment) return existingAssignment;

    // Assign based on weights
    const variant = this.selectVariant(test.variants);
    if (!variant) return null;

    // Store assignment
    this.storeUserAssignment(testId, userId, variant.id);

    // Track assignment
    this.trackVariantAssignment(testId, variant.id, userId);

    return variant.id;
  }

  // Track performance metrics for variant
  trackPerformance(
    testId: string,
    variantId: string,
    metrics: PerformanceMetrics,
    userId: string,
  ): void {
    const test = this.activeTests.get(testId);
    if (!test || test.status !== 'running') return;

    // Store performance data
    const data: ABTestData = {
      testId,
      variantId,
      userId,
      metrics,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
    };

    this.testData.get(testId)?.push(data);

    // Update variant performance
    this.updateVariantPerformance(testId, variantId, metrics);

    // Check if test should end
    this.checkTestCompletion(testId);

    // Track performance
    this.trackPerformanceMetric(testId, variantId, metrics, userId);
  }

  // Get current variant for user
  getCurrentVariant(testId: string, userId: string): string | null {
    return this.getUserAssignment(testId, userId);
  }

  // Get test results
  getTestResults(testId: string): ABTestResults | null {
    const test = this.activeTests.get(testId);
    if (!test || !test.results) return null;

    return test.results;
  }

  // Get all active tests
  getActiveTests(): ABTest[] {
    return Array.from(this.activeTests.values()).filter(test => test.status === 'running');
  }

  // Select variant based on weights
  private selectVariant(variants: ABTestVariant[]): ABTestVariant | null {
    const random = Math.random();
    let cumulative = 0;

    for (const variant of variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant;
      }
    }

    return variants[0]; // Fallback to first variant
  }

  // Update variant performance
  private updateVariantPerformance(
    testId: string,
    variantId: string,
    metrics: PerformanceMetrics,
  ): void {
    const test = this.activeTests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) return;

    // Update performance metrics
    Object.keys(metrics).forEach(key => {
      const value = metrics[key as keyof PerformanceMetrics];
      if (typeof value === 'number') {
        variant.performance[key as keyof PerformanceMetrics] = value;
      }
    });

    // Calculate performance score
    variant.performance.score = this.calculatePerformanceScore(metrics);
  }

  // Calculate performance score
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 0;
    let totalWeight = 0;

    Object.keys(AB_TEST_CONFIG.successCriteria).forEach(metric => {
      const criteria =
        AB_TEST_CONFIG.successCriteria[metric as keyof typeof AB_TEST_CONFIG.successCriteria];
      const value = metrics[metric as keyof PerformanceMetrics];

      if (typeof value === 'number') {
        const normalizedValue = Math.min(value / criteria.threshold, 1);
        score += normalizedValue * criteria.weight;
        totalWeight += criteria.weight;
      }
    });

    return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
  }

  // Check if test should complete
  private checkTestCompletion(testId: string): void {
    const test = this.activeTests.get(testId);
    if (!test) return;

    const data = this.testData.get(testId) || [];
    const totalUsers = data.length;

    // Check if minimum sample size reached
    if (totalUsers < AB_TEST_CONFIG.minSampleSize) return;

    // Check if test duration exceeded
    if (Date.now() > test.endDate) {
      this.completeTest(testId);
      return;
    }

    // Check if maximum sample size reached
    if (totalUsers >= AB_TEST_CONFIG.maxSampleSize) {
      this.completeTest(testId);
      return;
    }

    // Check if statistical significance reached
    if (this.isStatisticallySignificant(testId)) {
      this.completeTest(testId);
      return;
    }
  }

  // Complete test and calculate results
  private completeTest(testId: string): void {
    const test = this.activeTests.get(testId);
    if (!test) return;

    test.status = 'completed';
    test.results = this.calculateTestResults(testId);

    console.log(`🏁 A/B test completed: ${test.name}`);
    console.log(`🏆 Winner: ${test.results?.winner}`);
    console.log(`📊 Confidence: ${test.results?.confidence}%`);
  }

  // Calculate test results
  private calculateTestResults(testId: string): ABTestResults {
    const test = this.activeTests.get(testId);
    if (!test) return {} as ABTestResults;

    const data = this.testData.get(testId) || [];
    const variants = test.variants;

    // Calculate performance scores for each variant
    const variantScores = variants.map(variant => {
      const variantData = data.filter(d => d.variantId === variant.id);
      const avgScore =
        variantData.length > 0
          ? variantData.reduce((sum, d) => sum + (d.metrics.score || 0), 0) / variantData.length
          : 0;

      return {
        variantId: variant.id,
        score: avgScore,
        sampleSize: variantData.length,
      };
    });

    // Find winner
    const winner = variantScores.reduce((prev, current) =>
      current.score > prev.score ? current : prev,
    );

    // Calculate statistical significance
    const confidence = this.calculateConfidence(variantScores);
    const pValue = this.calculatePValue(variantScores);
    const effectSize = this.calculateEffectSize(variantScores);

    // Generate recommendations
    const recommendations = this.generateRecommendations(test, variantScores);

    return {
      winner: winner.variantId,
      confidence,
      pValue,
      effectSize,
      sampleSize: data.length,
      duration: Date.now() - test.startDate,
      recommendations,
    };
  }

  // Calculate confidence level
  private calculateConfidence(
    variantScores: Array<{ variantId: string; score: number; sampleSize: number }>,
  ): number {
    // Simplified confidence calculation
    // In a real implementation, you'd use proper statistical tests
    const scores = variantScores.map(v => v.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const range = maxScore - minScore;

    return range > 0 ? Math.min(95, (range / maxScore) * 100) : 50;
  }

  // Calculate p-value
  private calculatePValue(
    variantScores: Array<{ variantId: string; score: number; sampleSize: number }>,
  ): number {
    // Simplified p-value calculation
    // In a real implementation, you'd use proper statistical tests
    const scores = variantScores.map(v => v.score);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const range = maxScore - minScore;

    return range > 0 ? Math.max(0.01, 1 - range / maxScore) : 0.5;
  }

  // Calculate effect size
  private calculateEffectSize(
    variantScores: Array<{ variantId: string; score: number; sampleSize: number }>,
  ): number {
    // Simplified effect size calculation
    const scores = variantScores.map(v => v.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    return stdDev > 0 ? (Math.max(...scores) - Math.min(...scores)) / stdDev : 0;
  }

  // Check if results are statistically significant
  private isStatisticallySignificant(testId: string): boolean {
    const test = this.activeTests.get(testId);
    if (!test) return false;

    const data = this.testData.get(testId) || [];
    const variants = test.variants;

    // Simplified significance check
    // In a real implementation, you'd use proper statistical tests
    const variantScores = variants.map(variant => {
      const variantData = data.filter(d => d.variantId === variant.id);
      return variantData.length > 0
        ? variantData.reduce((sum, d) => sum + (d.metrics.score || 0), 0) / variantData.length
        : 0;
    });

    const maxScore = Math.max(...variantScores);
    const minScore = Math.min(...variantScores);
    const range = maxScore - minScore;

    return range > 10 && data.length >= AB_TEST_CONFIG.minSampleSize;
  }

  // Generate recommendations
  private generateRecommendations(
    test: ABTest,
    variantScores: Array<{ variantId: string; score: number; sampleSize: number }>,
  ): string[] {
    const recommendations: string[] = [];

    const winner = variantScores.reduce((prev, current) =>
      current.score > prev.score ? current : prev,
    );

    recommendations.push(`Winner: ${winner.variantId} with score ${winner.score.toFixed(2)}`);

    if (winner.score > 80) {
      recommendations.push('Consider implementing the winning variant as the default');
    } else if (winner.score < 60) {
      recommendations.push('Consider running additional tests or refining the variants');
    }

    const lowPerformingVariants = variantScores.filter(v => v.score < 50);
    if (lowPerformingVariants.length > 0) {
      recommendations.push(
        `Consider removing low-performing variants: ${lowPerformingVariants.map(v => v.variantId).join(', ')}`,
      );
    }

    return recommendations;
  }

  // Track variant assignment
  private trackVariantAssignment(testId: string, variantId: string, userId: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_assignment', {
        event_category: 'ab_testing',
        event_label: testId,
        value: 1,
        custom_parameter_test_id: testId,
        custom_parameter_variant_id: variantId,
        custom_parameter_user_id: userId,
      });
    }
  }

  // Track performance metric
  private trackPerformanceMetric(
    testId: string,
    variantId: string,
    metrics: PerformanceMetrics,
    userId: string,
  ): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'ab_test_performance', {
        event_category: 'ab_testing',
        event_label: testId,
        value: metrics.score || 0,
        custom_parameter_test_id: testId,
        custom_parameter_variant_id: variantId,
        custom_parameter_user_id: userId,
        custom_parameter_lcp: metrics.lcp,
        custom_parameter_fid: metrics.fid,
        custom_parameter_cls: metrics.cls,
        custom_parameter_score: metrics.score,
      });
    }
  }

  // Store user assignment
  private storeUserAssignment(testId: string, userId: string, variantId: string): void {
    const key = `ab_test_${testId}_${userId}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, variantId);
    }
  }

  // Get user assignment
  private getUserAssignment(testId: string, userId: string): string | null {
    const key = `ab_test_${testId}_${userId}`;
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  // Get session ID
  private getSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  // Generate test ID
  private generateTestId(): string {
    return 'test_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

// A/B test data interface
interface ABTestData {
  testId: string;
  variantId: string;
  userId: string;
  metrics: PerformanceMetrics;
  timestamp: number;
  sessionId: string;
}

// Export singleton instance
export const performanceABTestingManager = PerformanceABTestingManager.getInstance();

// Initialize performance-based A/B testing
export function initializePerformanceABTesting(): void {
  console.log('🧪 Initializing Performance-based A/B Testing...');

  // Create example tests
  const testId = performanceABTestingManager.createTest({
    name: 'Landing Page Performance Optimization',
    description: 'Test different landing page configurations for performance',
    endDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
    variants: [
      {
        id: 'control',
        name: 'Control',
        weight: 0.25,
        config: {},
        performance: {},
        users: 0,
        conversions: 0,
        conversionRate: 0,
      },
      {
        id: 'variant_a',
        name: 'Variant A',
        weight: 0.25,
        config: {},
        performance: {},
        users: 0,
        conversions: 0,
        conversionRate: 0,
      },
      {
        id: 'variant_b',
        name: 'Variant B',
        weight: 0.25,
        config: {},
        performance: {},
        users: 0,
        conversions: 0,
        conversionRate: 0,
      },
      {
        id: 'variant_c',
        name: 'Variant C',
        weight: 0.25,
        config: {},
        performance: {},
        users: 0,
        conversions: 0,
        conversionRate: 0,
      },
    ],
    successCriteria: {
      primary: 'lcp',
      secondary: ['fid', 'cls'],
      threshold: 2500,
      weight: 0.3,
    },
  });

  // Start the test
  performanceABTestingManager.startTest(testId);

  console.log('✅ Performance-based A/B Testing initialized');
}

// Track performance for A/B test
export function trackABTestPerformance(
  testId: string,
  variantId: string,
  metrics: PerformanceMetrics,
  userId: string,
): void {
  performanceABTestingManager.trackPerformance(testId, variantId, metrics, userId);
}

// Get A/B test variant
export function getABTestVariant(testId: string, userId: string): string | null {
  return performanceABTestingManager.getCurrentVariant(testId, userId);
}
