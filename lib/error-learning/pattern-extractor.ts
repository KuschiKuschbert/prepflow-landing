const MIN_FIX_COUNT_FOR_RULE = 3;

/**
 * Find common pattern in array of strings
 */
function findCommonPattern(strings: string[]): string | null {
  if (strings.length === 0) {
    return null;
  }

  // Simple approach: find common words/phrases
  const allWords = strings
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3);

  const wordCounts: Record<string, number> = {};
  for (const word of allWords) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // Find words that appear in at least 50% of strings
  const threshold = strings.length * 0.5;
  const commonWords = Object.entries(wordCounts)
    .filter(([_, count]) => count >= threshold)
    .map(([word]) => word);

  if (commonWords.length === 0) {
    return null;
  }

  // Return first common phrase (can be enhanced)
  return commonWords[0];
}

/**
 * Extract pattern from fixes
 */
/**
 * Extract pattern from fixes
 */
export function extractPattern(
  fixes: Array<{ solution: string; prevention: string; badCode?: string }>,
): {
  name: string;
  description: string;
  detection: string;
  fix: string;
  prevention: string;
  badPattern?: string;
  goodPattern?: string;
  context?: string[];
} | null {
  if (fixes.length < MIN_FIX_COUNT_FOR_RULE) {
    return null; // Not enough fixes to generate pattern
  }

  // Extract common solution pattern
  const solutions = fixes.map(f => f.solution);
  const commonSolution = findCommonPattern(solutions);

  // Extract common prevention pattern
  const preventions = fixes.map(f => f.prevention);
  const commonPrevention = findCommonPattern(preventions);

  // Extract common bad code pattern (naive)
  const badCodes = fixes.map(f => f.badCode).filter((c): c is string => !!c);
  // For now, just take the first one or use common pattern logic if we implemented strict pattern matching
  const commonBadCode =
    badCodes.length > 0 ? findCommonPattern(badCodes) || badCodes[0] : undefined;

  if (!commonSolution && !commonPrevention) {
    return null; // No clear pattern
  }

  // Generate pattern name from solution
  const patternName = commonSolution
    ? commonSolution.substring(0, 60).replace(/[^a-zA-Z0-9\s]/g, '')
    : 'Unknown Pattern';

  return {
    name: patternName,
    description: `Pattern learned from ${fixes.length} fixes`,
    detection: 'Error pattern detected from knowledge base',
    fix: commonSolution || 'Review fixes in knowledge base',
    prevention: commonPrevention || 'Follow prevention strategies from fixes',
    badPattern: commonBadCode || undefined, // Ensure it is string | undefined
    goodPattern: commonSolution || undefined, // undefined if null
    context: ['CallExpression'], // Defaulting to CallExpression for now as a heuristic
  };
}
