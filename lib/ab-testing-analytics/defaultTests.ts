import type { ABTestVariant } from './types';

export function getDefaultTests(): Map<string, ABTestVariant[]> {
  const tests = new Map<string, ABTestVariant[]>();
  tests.set('landing_page_variants', [
    {
      id: 'control',
      name: 'Control',
      description: 'Original landing page',
      trafficSplit: 25,
      isControl: true,
    },
    {
      id: 'variant_a',
      name: 'Variant A',
      description: 'Alternative hero section',
      trafficSplit: 25,
      isControl: false,
    },
    {
      id: 'variant_b',
      name: 'Variant B',
      description: 'Different pricing layout',
      trafficSplit: 25,
      isControl: false,
    },
    {
      id: 'variant_c',
      name: 'Variant C',
      description: 'New CTA positioning',
      trafficSplit: 25,
      isControl: false,
    },
  ]);
  return tests;
}
