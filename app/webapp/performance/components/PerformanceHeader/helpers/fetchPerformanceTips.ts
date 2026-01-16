/**
 * Fetch performance tips (AI or fallback).
 */
import type { PerformanceItem } from '../../../types';
import { generatePerformanceTips } from '../../../utils/generatePerformanceTips';

export async function fetchPerformanceTips(
  performanceScore: number,
  performanceItems: PerformanceItem[],
  selectedCountry: string,
  generateTips: (
    score: number,
    items: PerformanceItem[],
    country: string,
  ) => Promise<ReturnType<typeof generatePerformanceTips>>,
): Promise<ReturnType<typeof generatePerformanceTips>> {
  try {
    const aiTips = await generateTips(performanceScore, performanceItems, selectedCountry);
    return aiTips.length > 0
      ? (aiTips as ReturnType<typeof generatePerformanceTips>)
      : generatePerformanceTips(performanceScore, performanceItems);
  } catch {
    return generatePerformanceTips(performanceScore, performanceItems);
  }
}
