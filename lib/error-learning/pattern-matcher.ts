/**
 * Pattern Matching Engine
 * Matches new errors to known patterns for fix suggestions
 */

import { loadKnowledgeBase, type KnowledgeBaseError } from './knowledge-base';

export interface PatternMatch {
  error: KnowledgeBaseError;
  score: number;
  matchedFields: string[];
  reason: string;
}

/**
 * Calculate similarity between two strings (simple Levenshtein distance)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const distance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - distance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Match error message to known patterns
 */
function matchErrorMessage(errorMessage: string, knownPattern: string): number {
  return calculateSimilarity(errorMessage, knownPattern);
}

/**
 * Match error context (file, line, etc.)
 */
function matchErrorContext(
  errorContext: { file?: string; line?: number; [key: string]: unknown },
  knownContext: { file?: string; line?: number; [key: string]: unknown },
): { score: number; matches: number } {
  let score = 0;
  let matches = 0;

  // Match file paths
  if (errorContext.file && knownContext.file) {
    const fileScore = calculateSimilarity(errorContext.file, knownContext.file);
    score += fileScore * 0.3; // File path is less important
    if (fileScore > 0.5) matches++;
  }

  // Match error type
  if (errorContext.errorType && knownContext.errorType) {
    if (errorContext.errorType === knownContext.errorType) {
      score += 0.5;
      matches++;
    }
  }

  // Match category
  if (errorContext.category && knownContext.category) {
    if (errorContext.category === knownContext.category) {
      score += 0.3;
      matches++;
    }
  }

  // Match severity
  if (errorContext.severity && knownContext.severity) {
    if (errorContext.severity === knownContext.severity) {
      score += 0.2;
      matches++;
    }
  }

  return { score, matches };
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
