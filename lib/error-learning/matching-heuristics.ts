import { calculateSimilarity } from './string-distance';

/**
 * Match error message to known patterns
 */
export function matchErrorMessage(errorMessage: string, knownPattern: string): number {
  return calculateSimilarity(errorMessage, knownPattern);
}

/**
 * Match error context (file, line, etc.)
 */
export function matchErrorContext(
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
