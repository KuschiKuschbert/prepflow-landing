import { loadFixes } from './fix-storage';
import type { FixDocumentation } from './types';

/**
 * Get fix documentation for an error
 */
export async function getFixDocumentation(errorId: string): Promise<FixDocumentation | null> {
  try {
    const fixes = await loadFixes();
    return fixes.find(fix => fix.errorId === errorId) || null;
  } catch {
    return null;
  }
}

/**
 * Get all fixes for similar errors
 */
export async function getSimilarFixes(
  errorPattern: string,
  limit = 5,
): Promise<FixDocumentation[]> {
  try {
    const fixes = await loadFixes();

    // Simple pattern matching (can be enhanced with fuzzy matching)
    const patternLower = errorPattern.toLowerCase();

    return fixes
      .filter(fix => {
        return (
          fix.rootCause.toLowerCase().includes(patternLower) ||
          fix.solution.toLowerCase().includes(patternLower) ||
          fix.preventionStrategies.some(strategy => strategy.toLowerCase().includes(patternLower))
        );
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}
