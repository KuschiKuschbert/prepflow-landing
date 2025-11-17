import type { ABTestEvent, ABTestResult, ABTestVariant } from './types';

export function calculateTestResults(
  testId: string,
  variants: ABTestVariant[],
  events: ABTestEvent[],
): ABTestResult[] {
  const results: ABTestResult[] = [];
  for (const variant of variants) {
    const variantEvents = events.filter(e => e.testId === testId && e.variantId === variant.id);
    const totalUsers = new Set(variantEvents.map(e => e.userId)).size;
    const conversions = variantEvents.filter(e => e.eventType === 'conversion').length;
    const conversionRate = totalUsers > 0 ? (conversions / totalUsers) * 100 : 0;
    const conversionEvents = variantEvents.filter(e => e.eventType === 'conversion');
    const totalValue = conversionEvents.reduce((sum, e) => sum + (e.eventValue || 0), 0);
    const averageOrderValue = conversions > 0 ? totalValue / conversions : 0;
    results.push({
      testId,
      variantId: variant.id,
      totalUsers,
      conversions,
      conversionRate,
      averageOrderValue,
      revenue: totalValue,
      statisticalSignificance: calculateStatisticalSignificance(testId, variant.id, events),
    });
  }
  return results.sort((a, b) => b.conversionRate - a.conversionRate);
}

function calculateStatisticalSignificance(
  testId: string,
  variantId: string,
  events: ABTestEvent[],
): number {
  const variantEvents = events.filter(e => e.testId === testId && e.variantId === variantId);
  const controlEvents = events.filter(e => e.testId === testId && e.variantId === 'control');
  const variantConversions = variantEvents.filter(e => e.eventType === 'conversion').length;
  const variantTotal = variantEvents.length;
  const controlConversions = controlEvents.filter(e => e.eventType === 'conversion').length;
  const controlTotal = controlEvents.length;
  if (variantTotal === 0 || controlTotal === 0) return 0;
  const variantRate = variantConversions / variantTotal;
  const controlRate = controlConversions / controlTotal;
  const difference = Math.abs(variantRate - controlRate);
  const significance = Math.min(difference * 100, 100);
  return Math.round(significance);
}
