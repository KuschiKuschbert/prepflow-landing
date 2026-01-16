/**
 * Fetch performance tips (AI or fallback).
 */
import { generatePerformanceTips } from '../../../utils/generatePerformanceTips';
import type { PerformanceItem } from '../../../types';

export async function fetchPerformanceTips(
  performanceScore: number,
  performanceItems: PerformanceItem[],
  selectedCountry: string,
  generateTips: (score: number, items: PerformanceItem[], country: string) => Promise<unknown[]>,
): Promise<ReturnType<typeof generatePerformanceTips>> {
  try {
    const aiTips = await generateTips(performanceScore, performanceItems, selectedCountry);
    return aiTips.length > 0 ? aiTips : generatePerformanceTips(performanceScore, performanceItems);
  } catch {
    return generatePerformanceTips(performanceScore, performanceItems);
  }
}
