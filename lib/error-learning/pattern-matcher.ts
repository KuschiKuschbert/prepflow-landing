/**
 * Pattern Matching Engine
 * Matches new errors to known patterns for fix suggestions
 */

import { loadKnowledgeBase, type KnowledgeBaseError } from './knowledge-base';
import { matchErrorContext, matchErrorMessage } from './matching-heuristics';

export interface PatternMatch {
  error: KnowledgeBaseError;
  score: number;
  matchedFields: string[];
  reason: string;
}

/**
 * Find similar errors in knowledge base
 */
export async function findSimilarErrors(
  errorMessage: string,
  errorContext: {
    file?: string;
    line?: number;
    errorType?: string;
    category?: string;
    severity?: string;
    [key: string]: unknown;
  },
  limit = 5,
): Promise<PatternMatch[]> {
  const kb = await loadKnowledgeBase();
  const matches: PatternMatch[] = [];

  for (const knownError of kb.errors) {
    let totalScore = 0;
    const matchedFields: string[] = [];
    const reasons: string[] = [];

    // Match error message/pattern
    const messageScore = matchErrorMessage(errorMessage, knownError.pattern);
    totalScore += messageScore * 0.6; // Message is most important
    if (messageScore > 0.7) {
      matchedFields.push('message');
      reasons.push(`Message similarity: ${(messageScore * 100).toFixed(0)}%`);
    }

    // Match context
    const contextMatch = matchErrorContext(errorContext, knownError.context);
    totalScore += contextMatch.score;
    if (contextMatch.matches > 0) {
      matchedFields.push('context');
      reasons.push(`Context matches: ${contextMatch.matches}`);
    }

    // Match error type
    if (errorContext.errorType && errorContext.errorType === knownError.errorType) {
      totalScore += 0.3;
      matchedFields.push('errorType');
      reasons.push('Same error type');
    }

    // Match category
    if (errorContext.category && errorContext.category === knownError.category) {
      totalScore += 0.2;
      matchedFields.push('category');
      reasons.push('Same category');
    }

    // Only include matches with score > 0.5
    if (totalScore > 0.5) {
      matches.push({
        error: knownError,
        score: totalScore,
        matchedFields,
        reason: reasons.join(', '),
      });
    }
  }

  // Sort by score (highest first) and limit
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, limit);
}

/**
 * Get fix suggestions for an error
 */
export async function getFixSuggestions(
  errorMessage: string,
  errorContext: {
    file?: string;
    line?: number;
    errorType?: string;
    category?: string;
    severity?: string;
    [key: string]: unknown;
  },
): Promise<
  Array<{
    error: KnowledgeBaseError;
    fix: KnowledgeBaseError['fixes'][0];
    score: number;
    reason: string;
  }>
> {
  const similarErrors = await findSimilarErrors(errorMessage, errorContext, 3);
  const suggestions: Array<{
    error: KnowledgeBaseError;
    fix: KnowledgeBaseError['fixes'][0];
    score: number;
    reason: string;
  }> = [];

  for (const match of similarErrors) {
    // Get the most recent fix (or best fix if multiple)
    const fix =
      match.error.fixes.length > 0 ? match.error.fixes[match.error.fixes.length - 1] : null;

    if (fix) {
      suggestions.push({
        error: match.error,
        fix,
        score: match.score,
        reason: match.reason,
      });
    }
  }

  return suggestions;
}

/**
 * Match error pattern (fuzzy matching)
 */
export async function matchErrorPattern(
  errorMessage: string,
  errorType: string,
  category?: string,
): Promise<PatternMatch[]> {
  return findSimilarErrors(errorMessage, { errorType, category }, 3);
}
