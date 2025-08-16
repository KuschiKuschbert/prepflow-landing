import { NextRequest } from 'next/server';

// Experiment configuration
export interface ExperimentConfig {
  name: string;
  goal: string;
  split: Record<string, number>;
  metrics: string[];
  variants: Record<string, string>;
  guardrails: string[];
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  config: Record<string, unknown>;
}

// Current experiment configuration
export const EXPERIMENTS: Record<string, ExperimentConfig> = {
  landing_ab_001: {
    name: 'Landing Page Conversion Optimization',
    goal: 'primary_cta_conversion',
    split: { control: 25, v1: 25, v2: 25, v3: 25 },
    metrics: [
      'primary_cta_click',
      'purchase_complete', 
      'hero_cta_click',
      'scroll_50',
      'outbound_click_gumroad'
    ],
    variants: {
      control: 'Current landing unchanged - baseline for comparison',
      v1: 'Clarity-first: tighter hero, 3 key benefits + single CTA, screenshots above fold',
      v2: 'Trust-first: social proof above fold, refund policy near CTA, trust badges prominent',
      v3: 'Action-first: pricing preview in hero, prominent risk reduction, simplified messaging'
    },
    guardrails: [
      'Keep tone/style; no color palette changes',
      'No price or policy edits; links are fine',
      'Accessibility: maintain heading order and alt text',
      'Preserve existing brand voice and messaging',
      'Keep all legal and pricing information intact'
    ]
  }
};

// Helper function to generate stable user ID
function generateUserId(): string {
  return `pf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to get consistent variant for a user
export function getVariantForUser(userId: string, experimentKey: string): string {
  const experiment = EXPERIMENTS[experimentKey];
  if (!experiment) return 'control';

  // Create consistent hash for user + experiment
  let hash = 0;
  const combinedString = `${userId}_${experimentKey}`;
  
  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  const hashValue = Math.abs(hash) % 100;
  let cumulativeWeight = 0;

  // Sort variants by weight for consistent assignment
  const sortedVariants = Object.entries(experiment.split)
    .sort(([,a], [,b]) => b - a); // Sort by weight descending

  for (const [variant, weight] of sortedVariants) {
    cumulativeWeight += weight;
    if (hashValue < cumulativeWeight) {
      return variant;
    }
  }

  return 'control'; // Fallback
}

// Main function to get assigned variant for a request
export function getAssignedVariant(req: NextRequest): 'control' | 'v1' | 'v2' | 'v3' {
  // Get or create user ID
  let userId = req.cookies.get('pf_uid')?.value;
  
  if (!userId) {
    userId = generateUserId();
  }

  // Check if variant is already assigned for this experiment
  const experimentKey = 'landing_ab_001';
  const variantCookie = req.cookies.get(`pf_exp_${experimentKey}`);
  
  if (variantCookie?.value && ['control', 'v1', 'v2', 'v3'].includes(variantCookie.value)) {
    return variantCookie.value as 'control' | 'v1' | 'v2' | 'v3';
  }

  // Assign new variant
  const variant = getVariantForUser(userId, experimentKey);
  
  return variant as 'control' | 'v1' | 'v2' | 'v3';
}

// Helper function to get experiment info
export function getExperimentInfo(experimentKey: string): ExperimentConfig | null {
  return EXPERIMENTS[experimentKey] || null;
}

// Helper function to get all active experiments
export function getActiveExperiments(): Record<string, ExperimentConfig> {
  return EXPERIMENTS;
}

// Helper function to validate variant assignment
export function validateVariantAssignment(
  userId: string, 
  experimentKey: string, 
  expectedVariant: string
): boolean {
  const actualVariant = getVariantForUser(userId, experimentKey);
  return actualVariant === expectedVariant;
}

// Helper function to get traffic split validation
export function getTrafficSplitValidation(experimentKey: string): Record<string, number> {
  const experiment = EXPERIMENTS[experimentKey];
  if (!experiment) return {};
  
  return experiment.split;
}

// Helper function to check if experiment is active
export function isExperimentActive(experimentKey: string): boolean {
  return experimentKey in EXPERIMENTS;
}

// Helper function to get experiment metrics
export function getExperimentMetrics(experimentKey: string): string[] {
  const experiment = EXPERIMENTS[experimentKey];
  return experiment?.metrics || [];
}

// Helper function to get experiment variants
export function getExperimentVariants(experimentKey: string): Record<string, string> {
  const experiment = EXPERIMENTS[experimentKey];
  return experiment?.variants || {};
}

// Helper function to get experiment guardrails
export function getExperimentGuardrails(experimentKey: string): string[] {
  const experiment = EXPERIMENTS[experimentKey];
  return experiment?.guardrails || [];
}
