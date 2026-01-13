/**
 * Error Suggestion System
 * Suggests fixes based on knowledge base when errors occur
 */

import { getFixSuggestions } from './pattern-matcher';
import { loadKnowledgeBase } from './knowledge-base';
import type { KnowledgeBaseError } from './knowledge-base';

export interface FixSuggestion {
  error: KnowledgeBaseError;
  fix: KnowledgeBaseError['fixes'][0];
  score: number;
  reason: string;
  codeExample?: string;
  preventionStrategies: string[];
}

/**
 * Suggest fixes for an error
 */
export async function suggestFixes(
  errorMessage: string,
  errorContext: {
    file?: string;
    line?: number;
    errorType?: string;
    category?: string;
    severity?: string;
    [key: string]: unknown;
  },
): Promise<FixSuggestion[]> {
  const suggestions = await getFixSuggestions(errorMessage, errorContext);

  return suggestions.map(suggestion => ({
    error: suggestion.error,
    fix: suggestion.fix,
    score: suggestion.score,
    reason: suggestion.reason,
    codeExample: suggestion.fix.codeChanges?.substring(0, 500), // Limit size
    preventionStrategies: suggestion.error.preventionRules.map(ruleId => {
      // Get prevention strategies from fixes
      const allPreventions = suggestion.error.fixes.flatMap(f => f.prevention);
      return allPreventions[0] || 'Review error patterns and add prevention rules';
    }),
  }));
}

/**
 * Format suggestion for display
 */
export function formatSuggestion(suggestion: FixSuggestion): string {
  return `
Similar Error Found (Score: ${(suggestion.score * 100).toFixed(0)}%)
${'='.repeat(60)}

Error: ${suggestion.error.pattern}
Reason: ${suggestion.reason}

Solution:
${suggestion.fix.solution}

${
  suggestion.codeExample
    ? `Code Example:
${suggestion.codeExample}
`
    : ''
}

Prevention Strategies:
${suggestion.preventionStrategies.map((strategy, index) => `${index + 1}. ${strategy}`).join('\n')}

Error ID: ${suggestion.error.id}
Fix ID: ${suggestion.fix.id}
`;
}

/**
 * Get top suggestion
 */
export async function getTopSuggestion(
  errorMessage: string,
  errorContext: {
    file?: string;
    line?: number;
    errorType?: string;
    category?: string;
    severity?: string;
    [key: string]: unknown;
  },
): Promise<FixSuggestion | null> {
  const suggestions = await suggestFixes(errorMessage, errorContext);
  return suggestions.length > 0 ? suggestions[0] : null;
}
