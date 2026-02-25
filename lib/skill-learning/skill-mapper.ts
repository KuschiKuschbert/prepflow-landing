/**
 * Maps error patterns and RSI types to skill names
 */

import { loadSkillMapping } from './config';

export function getSkillForErrorPattern(patternId: string): string | null {
  const mapping = loadSkillMapping();
  return mapping.errorPatterns[patternId] ?? null;
}

export function getSkillForRsiType(rsiType: string): string | null {
  const mapping = loadSkillMapping();
  return mapping.rsiTypes[rsiType] ?? null;
}
