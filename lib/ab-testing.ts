// PrepFlow A/B Testing Framework
// Integrates with existing analytics for conversion tracking

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  trafficSplit: number; // Percentage of traffic to test (0-100)
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  primaryMetric: string;
  minimumSampleSize: number;
}

export interface Variant {
  id: string;
  name: string;
  weight: number; // Traffic distribution weight
  config: Record<string, any>;
}

export interface ExperimentResult {
  experimentId: string;
  variantId: string;
  sessionId: string;
  userId?: string;
  timestamp: number;
  page: string;
  conversions: number;
  revenue?: number;
  engagementScore?: number;
}

export interface ExperimentStats {
  experimentId: string;
  variantId: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  confidence: number;
  isWinner: boolean;
}

class PrepFlowABTesting {
  private experiments: Map<string, ExperimentConfig> = new Map();
  private results: ExperimentResult[] = [];
  private sessionExperiments: Map<string, Map<string, string>> = new Map(); // sessionId -> experimentId -> variantId

  constructor() {
    this.initializeDefaultExperiments();
  }

  private initializeDefaultExperiments(): void {
    // Hero Section A/B Test
    this.addExperiment({
      id: 'hero_section_v1',
      name: 'Hero Section Layout Test',
      description: 'Testing different hero section layouts for conversion optimization',
      variants: [
        {
          id: 'control',
          name: 'Control (Current)',
          weight: 50,
          config: {
            layout: 'centered',
            ctaText: 'Get Started',
            ctaColor: 'primary',
            showDemoButton: true
          }
        },
        {
          id: 'variant_a',
          name: 'Left-Aligned with Social Proof',
          weight: 50,
          config: {
            layout: 'left_aligned',
            ctaText: 'Start Free Trial',
            ctaColor: 'secondary',
            showDemoButton: false,
            showSocialProof: true
          }
        }
      ],
      trafficSplit: 100,
      startDate: new Date(),
      isActive: true,
      primaryMetric: 'cta_click',
      minimumSampleSize: 1000
    });

    // CTA Button Test
    this.addExperiment({
      id: 'cta_button_v1',
      name: 'CTA Button Optimization',
      description: 'Testing different CTA button text and colors',
      variants: [
        {
          id: 'control',
          name: 'Control',
          weight: 33,
          config: {
            text: 'Get Started',
            color: 'primary',
            size: 'large'
          }
        },
        {
          id: 'variant_a',
          name: 'Action-Oriented',
          weight: 33,
          config: {
            text: 'Start Free Trial',
            color: 'secondary',
            size: 'large'
          }
        },
        {
          id: 'variant_b',
          name: 'Urgency-Based',
          weight: 34,
          config: {
            text: 'Join Now - Free',
            color: 'accent',
            size: 'large'
          }
        }
      ],
      trafficSplit: 100,
      startDate: new Date(),
      isActive: true,
      primaryMetric: 'cta_click',
      minimumSampleSize: 500
    });

    // Pricing Layout Test
    this.addExperiment({
      id: 'pricing_layout_v1',
      name: 'Pricing Layout Optimization',
      description: 'Testing different pricing section layouts and features',
      variants: [
        {
          id: 'control',
          name: 'Control (Cards)',
          weight: 50,
          config: {
            layout: 'cards',
            showFeatures: true,
            highlightPopular: true,
            ctaText: 'Start Free Trial'
          }
        },
        {
          id: 'variant_a',
          name: 'Table Layout',
          weight: 50,
          config: {
            layout: 'table',
            showFeatures: false,
            highlightPopular: false,
            ctaText: 'Get Started'
          }
        }
      ],
      trafficSplit: 100,
      startDate: new Date(),
      isActive: true,
      primaryMetric: 'pricing_view',
      minimumSampleSize: 300
    });
  }

  public addExperiment(experiment: ExperimentConfig): void {
    this.experiments.set(experiment.id, experiment);
  }

  public getVariant(experimentId: string, sessionId: string): Variant | null {
    const experiment = this.experiments.get(experimentId);
    if (!experiment || !experiment.isActive) {
      return null;
    }

    // Check if user already has a variant assigned
    let sessionExperiments = this.sessionExperiments.get(sessionId);
    if (!sessionExperiments) {
      sessionExperiments = new Map();
      this.sessionExperiments.set(sessionId, sessionExperiments);
    }

    if (sessionExperiments.has(experimentId)) {
      const variantId = sessionExperiments.get(experimentId)!;
      return experiment.variants.find(v => v.id === variantId) || null;
    }

    // Assign variant based on traffic split and weights
    const variant = this.assignVariant(experiment, sessionId);
    if (variant) {
      sessionExperiments.set(experimentId, variant.id);
      this.trackImpression(experimentId, variant.id, sessionId);
    }

    return variant;
  }

  private assignVariant(experiment: ExperimentConfig, sessionId: string): Variant | null {
    // Simple hash-based assignment for consistent user experience
    const hash = this.hashString(sessionId + experiment.id);
    const hashValue = hash % 100;

    let cumulativeWeight = 0;
    for (const variant of experiment.variants) {
      cumulativeWeight += variant.weight;
      if (hashValue < cumulativeWeight) {
        return variant;
      }
    }

    return experiment.variants[0]; // Fallback
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  public trackImpression(experimentId: string, variantId: string, sessionId: string): void {
    // This would integrate with your existing analytics
    // Silent tracking - no visible indicators to users
  }

  public trackConversion(experimentId: string, variantId: string, sessionId: string, conversionType: string, value?: number): void {
    const result: ExperimentResult = {
      experimentId,
      variantId,
      sessionId,
      timestamp: Date.now(),
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      conversions: 1,
      revenue: value
    };

    this.results.push(result);
    // Silent tracking - no visible indicators to users
  }

  public getExperimentStats(experimentId: string): ExperimentStats[] {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return [];

    const stats: ExperimentStats[] = [];
    
    for (const variant of experiment.variants) {
      const variantResults = this.results.filter(r => 
        r.experimentId === experimentId && r.variantId === variant.id
      );

      const impressions = this.getImpressions(experimentId, variant.id);
      const conversions = variantResults.length;
      const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
      const revenue = variantResults.reduce((sum, r) => sum + (r.revenue || 0), 0);

      stats.push({
        experimentId,
        variantId: variant.id,
        impressions,
        conversions,
        conversionRate,
        revenue,
        confidence: this.calculateConfidence(impressions, conversions),
        isWinner: false // Will be calculated below
      });
    }

    // Determine winner based on conversion rate and statistical significance
    if (stats.length > 1) {
      const bestVariant = stats.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      );
      
      if (bestVariant.confidence >= 0.95) {
        bestVariant.isWinner = true;
      }
    }

    return stats;
  }

  private getImpressions(experimentId: string, variantId: string): number {
    let count = 0;
    for (const [sessionId, experiments] of this.sessionExperiments) {
      if (experiments.get(experimentId) === variantId) {
        count++;
      }
    }
    return count;
  }

  private calculateConfidence(impressions: number, conversions: number): number {
    if (impressions === 0) return 0;
    
    // Simple confidence calculation based on sample size
    // In production, you'd use proper statistical tests (chi-square, t-test, etc.)
    const conversionRate = conversions / impressions;
    const standardError = Math.sqrt((conversionRate * (1 - conversionRate)) / impressions);
    
    // 95% confidence interval
    return Math.max(0, Math.min(1, 1 - (standardError * 1.96)));
  }

  public isExperimentActive(experimentId: string): boolean {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return false;

    const now = new Date();
    if (experiment.startDate > now) return false;
    if (experiment.endDate && experiment.endDate < now) return false;

    return experiment.isActive;
  }

  public getActiveExperiments(): ExperimentConfig[] {
    return Array.from(this.experiments.values()).filter(exp => this.isExperimentActive(exp.id));
  }

  public exportResults(): ExperimentResult[] {
    return [...this.results];
  }

  public clearResults(): void {
    this.results = [];
  }
}

// Create singleton instance
export const abTesting = new PrepFlowABTesting();

// Export individual functions for easy use
export const getVariant = abTesting.getVariant.bind(abTesting);
export const trackConversion = abTesting.trackConversion.bind(abTesting);
export const getExperimentStats = abTesting.getExperimentStats.bind(abTesting);
export const isExperimentActive = abTesting.isExperimentActive.bind(abTesting);
export const getActiveExperiments = abTesting.getActiveExperiments.bind(abTesting);
